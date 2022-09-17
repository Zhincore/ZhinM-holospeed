import { IVector3 } from "./Vector3";

export class Settings {
  constructor() {
    this.load();
  }

  enabled = true;
  opacity = 0.9;
  color: IVector3 = [1, 1, 1];
  offset: IVector3 = [0, 0, 0];
  // rotation: IVector3 = [0, 0, 0];
  scale = 1;

  save() {
    SetResourceKvp("ZhinM-holospeed:settings", JSON.stringify(this));
  }

  load() {
    Object.assign(this, JSON.parse(GetResourceKvpString("ZhinM-holospeed:settings") || "{}"));
  }
}

export default new Settings();
