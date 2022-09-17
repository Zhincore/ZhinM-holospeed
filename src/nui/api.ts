import EventEmitter from "eventemitter3";

class API extends EventEmitter {
  constructor() {
    super();

    window.addEventListener("message", (ev) => this.emit(ev.data.eventName, ev.data));
    this.send("init");
  }

  send(eventName: string, data: Record<string, any> = {}) {
    if (import.meta.env.DEV) return Promise.resolve();
    return fetch(`https://${GetParentResourceName()}/${eventName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    });
  }
}

export default new API();
