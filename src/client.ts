import { Vector3, IVector3 } from "./Vector3";
import settings, { Settings } from "./Settings";

const width = 320;
const height = 180;

const modelHash = GetHashKey("zhinm_holospeed_drawable");
const modelDimensions = new Vector3(3.84, 2.16);
const minScale = 0.25;
const offsetMult = 2;
const txdName = "zhinm_holospeed_drawable";
const txdNameDui = txdName + "-dui";
const txnName = "holospeed";

let settingsReady = false;
let settingsVisible = false;
let speedUnit = "";
let speedMult = 1;
let scale = 0.5;
let settingsUpdateInterval: CitizenTimer;

let objHandle = 0;
let duiObj = 0;
let lastVeh = 0;
let ready = false;
let hidden = false;
let lastUserOffset = new Vector3(...settings.offset);

RegisterNuiCallbackType("init");
RegisterNuiCallbackType("update");
RegisterNuiCallbackType("save");
RegisterNuiCallbackType("close");

on("__cfx_nui:init", (data: any, cb: any) => {
  settingsReady = true;
  sendSettingsUpdate();
  cb();
});

on("__cfx_nui:update", (data: any, cb: any) => {
  Object.assign(settings, data);
  cb();
});

on("__cfx_nui:save", (data: any, cb: any) => {
  Object.assign(settings, data);
  settings.save();
  toggleSettings(false);
  cb();
});

on("__cfx_nui:close", (data: any, cb: any) => {
  toggleSettings(false);
  cb();
});

RegisterCommand(
  "holospeed",
  () => {
    toggleSettings(true);
  },
  false
);

on("onClientResourceStart", async (resName: string) => {
  if (resName === GetCurrentResourceName()) {
    // Settings update checker
    settingsUpdateInterval = setInterval(() => {
      const metric = GetProfileSetting(227) == 1;
      speedUnit = metric ? "KPH" : "MPH";
      speedMult = metric ? 3.6 : 2.236936;
    }, 1000);

    await loadModel(modelHash);

    duiObj = CreateDui(`nui://${GetCurrentResourceName()}/dui/index.html`, width, height);
    const dui = GetDuiHandle(duiObj);
    const txd = CreateRuntimeTxd(txdNameDui);
    CreateRuntimeTextureFromDuiHandle(txd, txnName, dui);
    AddReplaceTexture(txdName, txnName, txdNameDui, txnName);

    objHandle = CreateObject(modelHash, 0, 0, 0, false, true, false);
    if (!objHandle) throw new Error("Failed to create object");
    SetEntityMotionBlur(objHandle, false);

    ready = true;
  }
});

on("onResourceStop", (resName: string) => {
  if (resName === GetCurrentResourceName()) {
    if (duiObj) {
      DestroyDui(duiObj);
      RemoveReplaceTexture(txdName, txnName);
    }
    if (objHandle) DeleteObject(objHandle);
    if (settingsUpdateInterval) clearInterval(settingsUpdateInterval);
    SetModelAsNoLongerNeeded(modelHash);
  }
});

setTick(() => {
  if (!settings.enabled || !ready) return;

  const ped = PlayerPedId();
  const veh = GetVehiclePedIsIn(ped, false);
  const shouldBeVisible = veh && GetFollowPedCamViewMode() !== 4;

  if (!shouldBeVisible && !hidden) {
    SetEntityVisible(objHandle, false, false);
    hidden = true;
  } else if (shouldBeVisible) {
    if (hidden) {
      SetEntityVisible(objHandle, true, false);
      hidden = false;
    }

    if (lastVeh != veh || lastUserOffset.equals(settings.offset)) {
      // Attach object
      const [boxMin, boxMax] = GetModelDimensions(GetEntityModel(veh));
      const dimensions = new Vector3(...boxMax).sub(new Vector3(...boxMin));
      scale = dimensions.getLength() * 0.05;

      const offset = new Vector3();

      for (const bone of ["wheel_lr", "wheel_rr", "wheel_lf", "wheel_rf"]) {
        const boneOffset = getEntityBoneOffset(bone, veh);
        if (boneOffset && Math.abs(boneOffset[0]) > 0.3) {
          offset.x = Math.abs(boneOffset[0]);
          break;
        }
      }
      if (!offset.x) {
        offset.x = dimensions.x * 0.5;
      }
      offset.x += modelDimensions.x * 0.5;

      const seatBoneI = GetEntityBoneIndexByName(veh, "seat_dside_f"); // Driver seat
      if (seatBoneI != -1) {
        const seatBonePos = GetWorldPositionOfEntityBone(veh, seatBoneI) as IVector3;
        const seatOffset = GetOffsetFromEntityGivenWorldCoords(veh, ...seatBonePos);
        offset.y = seatOffset[1] + 0.5;
        offset.z = seatOffset[2] + 0.5;
      } else {
        offset.y = dimensions.y * 0.3;
        offset.z = dimensions.z * 0.2;
      }

      lastUserOffset = new Vector3(...settings.offset);

      AttachEntityToEntity(
        objHandle,
        veh,
        0,
        // Pos
        ...offset.add(lastUserOffset.mult(offsetMult)).toTuple(),
        // Rot
        0,
        0,
        0,
        //
        false,
        false,
        false,
        false,
        2,
        true
      );
      lastVeh = veh;
    }

    if (IsVehicleEngineOn(veh)) {
      let rpm = GetVehicleCurrentRpm(veh);
      // Simulate limiter
      if (rpm >= 0.9) rpm -= Math.random() * 0.1;

      sendDuiUpdate({
        silent: false,
        speed: Math.round(GetEntitySpeed(veh) * speedMult),
        rpm,
      });
    } else {
      sendDuiUpdate({
        silent: true,
        speed: 0,
        rpm: 0,
      });
    }
  }
});

interface DuiUpdateData {
  silent: boolean;
  speed: number;
  rpm: number;
}

function sendDuiUpdate(data: DuiUpdateData) {
  sendDui({
    unit: speedUnit ? "KMH" : "MPH",
    scale: Math.max(minScale, Math.min(1, scale * settings.scale)),
    settings,
    ...data,
  });
}

function sendSettingsUpdate() {
  sendSettingsMessage("data", settings);
}

function toggleSettings(state: boolean) {
  if (sendSettingsMessage("toggle", { state })) {
    settingsVisible = state;
  }
}

function sendSettingsMessage(eventName: string, data = {}) {
  return SendNuiMessage(JSON.stringify({ eventName, ...data }));
}

function sendDui(data: any) {
  if (!duiObj) return;
  SendDuiMessage(duiObj, JSON.stringify(data));
}

function getEntityBoneOffset(boneName: string, entity: number) {
  const boneI = GetEntityBoneIndexByName(entity, boneName);
  if (boneI === -1) return;
  const bonePos = GetWorldPositionOfEntityBone(entity, boneI) as IVector3;
  return GetOffsetFromEntityGivenWorldCoords(entity, ...bonePos) as IVector3;
}

async function loadModel(model: string | number): Promise<void> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (HasModelLoaded(model)) {
        clearInterval(interval);
        resolve();
      } else {
        RequestModel(model);
      }
    }, 0);
  });
}
