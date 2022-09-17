import EventEmitter from "eventemitter3";

const NUI_URL = new URL("/", location.href);
NUI_URL.protocol = "https:";

class API extends EventEmitter {
  constructor() {
    super();

    window.addEventListener("message", (ev) => this.emit(ev.data.eventName, ev.data));
    this.send("init");
  }

  send(eventName: string, data: Record<string, any> = {}) {
    const url = new URL(NUI_URL);
    url.pathname = eventName;
    if (import.meta.env.DEV) return Promise.resolve();
    return fetch(url.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    });
  }
}

export default new API();
