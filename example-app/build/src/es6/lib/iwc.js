import { getWidgetTagName } from "../config";
export class Intent {
    constructor(sender, receiver, action, data, global) {
        this.dataType = "text/xml";
        this.categories = ["", ""];
        this.extras = {};
        this.sender = sender;
        this.receiver = receiver;
        this.data = data;
        this.action = action;
        this.flags = [global ? "PUBLISH_GLOBAL" : "PUBLISH_LOCAL"];
    }
}
export class Client {
    constructor(componentName, categories, origin, y) {
        this._componentName = "unknown";
        this._connected = false;
        this._y = y;
        this._componentName = componentName;
        this._categories = categories;
        this._origin = origin;
    }
    connect(callback) {
        this._callback = callback;
        var handler = this.receiveMessage.bind(this);
        const widgetTageName = getWidgetTagName(this._componentName);
        try {
            const _node = document.querySelector(widgetTageName);
            if (!_node) {
                throw new Error("html tag not found in document. Please make sure that you added the " +
                    widgetTageName +
                    " to the document. Hint: do not use the shadow dom.");
            }
            _node.addEventListener("syncmeta-message", handler);
        }
        catch (error) {
            console.error(error);
        }
        if (this._y) {
            const intents = this._y.getMap("intents");
            if (intents)
                intents.observe(handler);
        }
    }
    disconnect() {
        this._callback = null;
        if (!(this._y === null || this._y === undefined)) {
            this._y.getMap("intents").unobserve(this.receiveMessage);
        }
    }
    publish(intent) {
        if (util.validateIntent(intent)) {
            if (intent.flags[0] === util.FLAGS.PUBLISH_GLOBAL) {
                this.publishGlobal(intent, this._y);
            }
            else if (intent.flags[0] === util.FLAGS.PUBLISH_LOCAL) {
                this.publishLocal(intent, this._origin);
            }
        }
    }
    publishLocal(intent, origin) {
        const widgets = [];
        for (const el of document.querySelectorAll("*")) {
            if (el.tagName.match(/-widget$/i)) {
                widgets.push(el);
            }
        }
        widgets.forEach(function (widget) {
            const receiverTagName = getWidgetTagName(intent.receiver.toLowerCase());
            if (widget.tagName.toLowerCase() === receiverTagName.toLowerCase()) {
                const event = new CustomEvent("syncmeta-message", {
                    detail: {
                        intent,
                        origin,
                    },
                });
                widget.dispatchEvent(event);
            }
        });
    }
    publishGlobal(intent, y) {
        y.getMap("intents").set(intent.receiver, intent);
    }
    receiveMessage(event) {
        if (event.type === "syncmeta-message") {
            if (event instanceof CustomEvent) {
                this._callback(event.detail.intent);
            }
        }
        else if (event.type === "add" || event.type == "update") {
            var intent = event.object.get(event.name);
            event.object.delete(event.name);
            console.log(intent);
            this._callback(intent);
        }
    }
}
export class util {
    static { this.FLAGS = {
        PUBLISH_LOCAL: "PUBLISH_LOCAL",
        PUBLISH_GLOBAL: "PUBLISH_GLOBAL",
    }; }
    static validateIntent(intent) {
        if (typeof intent.sender != "string") {
            throw new Error("Intent object must possess property 'component' of type 'String'");
        }
        if (typeof intent.data != "string") {
            throw new Error("Intent object must possess property 'data' of type 'String'");
        }
        if (typeof intent.dataType != "string") {
            throw new Error("Intent object must possess property 'dataType' of type 'String'");
        }
        return true;
    }
}
export default { Client, util };
//# sourceMappingURL=iwc.js.map