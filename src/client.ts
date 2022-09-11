import { Vector3 } from "./Vector3";

// Adapted from https://forum.cfx.re/t/release-generic-dui-2d-3d-renderer/131208
const width = 640;
const height = 360;

const modelHash = GetHashKey("zhinm_holospeed_drawable");
const modelDimensions = new Vector3(1.28, 0.72);
const txdName = "zhinm_holospeed_drawable";
const txdNameDui = txdName + "-dui";
const txnName = "holospeed";

let objHandle = 0;
let duiObj = 0;
let lastVeh = 0;
let ready = false;

on("onClientResourceStart", async (resName: string) => {
  if (resName === GetCurrentResourceName()) {
    await loadModel(modelHash);

    duiObj = CreateDui(`nui://${GetCurrentResourceName()}/index.html`, width, height);
    const dui = GetDuiHandle(duiObj);
    const txd = CreateRuntimeTxd(txdNameDui);
    CreateRuntimeTextureFromDuiHandle(txd, txnName, dui);
    AddReplaceTexture(txdName, txnName, txdNameDui, txnName);

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
    SetModelAsNoLongerNeeded(modelHash);
  }
});

setTick(() => {
  if (!ready) return;

  const ped = PlayerPedId();
  const veh = GetVehiclePedIsIn(ped, false);

  if (!veh && objHandle) {
    // Vehicle left
    DeleteObject(objHandle);
    objHandle = 0;
  } else if (veh) {
    // Is inside vehicle
    if (!objHandle) {
      // Create object
      objHandle = CreateObject(modelHash, 0, 0, 0, false, true, false);
      if (!objHandle) throw new Error("Failed to create object");
    }

    if (lastVeh != veh) {
      // Attach object
      const [boxMin, boxMax] = GetModelDimensions(GetEntityModel(veh));

      const dimensions = new Vector3(...boxMax).sub(new Vector3(...boxMin));

      AttachEntityToEntity(
        objHandle,
        veh,
        0,
        // Pos
        modelDimensions.x * 0.5 + dimensions.x * 0.45,
        dimensions.y * 0.15,
        dimensions.z * 0.3,
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
        true,
      );
    }

    const speed = GetEntitySpeed(veh);
    SendDuiMessage(
      duiObj,
      JSON.stringify({
        speed,
        rpm: GetVehicleCurrentRpm(veh),
      }),
    );
  }
});

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
