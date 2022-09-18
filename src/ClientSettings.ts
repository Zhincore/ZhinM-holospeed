import { Settings, defaults } from "./Settings";

export type { Settings };

export class ClientSettings extends Settings {
  constructor() {
    super();
    this.load();
  }

  save() {
    SetResourceKvp("ZhinM-holospeed:settings", JSON.stringify(this));
  }

  load() {
    const data = JSON.parse(GetResourceKvpString("ZhinM-holospeed:settings") || "{}");
    for (const [key, value] of Object.entries(defaults)) {
      const saved = data[key];
      if (saved !== undefined && typeof saved === typeof value && Array.isArray(saved) === Array.isArray(value)) {
        (this as any)[key] = saved;
      }
    }
  }
}

export default new ClientSettings();
