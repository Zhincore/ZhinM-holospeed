import { IVector3 } from "./Vector3";

export class Settings {
  constructor() {
    this.load();
  }

  enabled = true;
  color: IVector3 = [1, 1, 1];
  offset: IVector3 = [0.5, 0.5, 0.5];
  // rotation: IVector3 = [0, 0, 0];
  scale = 1;

  save() {
    SetResourceKvp("ZhinM-holospeed:settings", JSON.stringify(this));
  }

  load() {
    const data = JSON.parse(GetResourceKvpString("ZhinM-holospeed:settings") || "{}");
    if ("enabled" in data) this.enabled = data.enabled;
    if (Array.isArray(data.color)) this.color = data.color;
    if (Array.isArray(data.offset)) this.offset = data.offset;
    if (typeof data.scale === "number") this.scale = data.scale;
  }
}

export default new Settings();
