class Settings {
  constructor() {
    this.load();
  }

  enabled = true;
  color = "#FFFFFF";
  opacity = 0.9;
  offset = [0, 0, 0];
  rotation = [0, 0, 0];
  scale = 1;

  save() {
    SetResourceKvp("ZhinM-holospeed:settings", JSON.stringify(this));
  }

  load() {
    Object.assign(this, JSON.parse(GetResourceKvpString("ZhinM-holospeed:settings") || "{}"));
  }
}

export default new Settings();
