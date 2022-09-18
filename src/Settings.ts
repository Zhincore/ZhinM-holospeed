import { IVector3 } from "./Vector3";

export class Settings {
  enabled = true;
  color: IVector3 = [1, 1, 1];
  offset: IVector3 = [0.5, 0.5, 0.5];
  // rotation: IVector3 = [0, 0, 0];
  scale = 1;
  leftAlign = false;
  showRPM = true;
  showUnit = true;
  dayBrightness = 1.0;
  nightBrightness = 0.5;
}

export const defaults: Readonly<Settings> = new Settings();
