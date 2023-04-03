import { CONFIG } from "../config";
import OTOperation from "../operations/ot/OTOperation";
import NonOTOperation from "../operations/non_ot/NonOTOperation";
import OperationFactory from "../operations/OperationFactory";
import Util from "../Util";
import * as IWC from "./iwc";
import "./openapp";
var PAYLOAD_DATA_TYPE = {
    OT_OPERATION: "OTOperation",
    NON_OT_OPERATION: "NonOTOperation",
};
class IWCWrapper {
    constructor(componentName, y) {
        this.BUFFER_ENABLED = false;
        this.INTERVAL_SEND = 25;
        this.Space = null;
        this._messageBuffer = [];
        this._onDataReceivedCallbacks = [];
        this._onDataReceivedCallers = [];
        this._times = {};
        this.componentName = componentName;
        this._iwc = new IWC.Client(componentName, "*", null, y);
        window._iwc_instance_ = this._iwc;
        if (this.BUFFER_ENABLED)
            setInterval(this.sendBufferedMessages, this.INTERVAL_SEND);
        this.connect = () => this._iwc.connect((intent) => this.onIntentReceivedCallback(this, intent));
        this.disconnect = () => this._iwc.disconnect;
        this.sendLocalMessage = function (receiver, data) {
            var intent;
            if (!receiver || receiver === "")
                return;
            if (this.BUFFER_ENABLED) {
                if (this._messageBuffer.hasOwnProperty(receiver)) {
                    this._messageBuffer[receiver].push(data);
                }
                else {
                    this._messageBuffer[receiver] = [data];
                }
            }
            else {
                intent = this.encapsulateMessage(receiver, CONFIG.IWC.FLAG.PUBLISH_LOCAL, CONFIG.IWC.ACTION.DATA, data);
                if (IWC.util.validateIntent(intent)) {
                    this._iwc.publish(intent);
                }
            }
        };
        this.sendLocalOTOperation = function (receiver, operation) {
            this.sendLocalMessage(receiver, {
                type: PAYLOAD_DATA_TYPE.OT_OPERATION,
                data: operation.getOperationObject(),
                sender: operation.getSender(),
            });
        };
        this.sendLocalNonOTOperation = function (receiver, operation) {
            this.sendLocalMessage(receiver, {
                type: PAYLOAD_DATA_TYPE.NON_OT_OPERATION,
                data: operation.getOperationObject(),
                sender: operation.getSender(),
            });
        };
        this.getUserColor = function (jabberId) {
            return Util.getColor(this.Space.members[jabberId].globalId);
        };
        this.registerOnDataReceivedCallback = function (callback, caller) {
            if (typeof callback === "function") {
                this.unregisterOnDataReceivedCallback(callback);
                this._onDataReceivedCallbacks.push(callback);
                this._onDataReceivedCallers.push(caller);
            }
        };
        this.unregisterOnDataReceivedCallback = function (callback) {
            var i, numOfCallbacks;
            if (typeof callback === "function") {
                for (i = 0, numOfCallbacks = this._onDataReceivedCallbacks.length; i < numOfCallbacks; i++) {
                    if (callback === this._onDataReceivedCallbacks[i]) {
                        this._onDataReceivedCallbacks.splice(i, 1);
                        this._onDataReceivedCallers.splice(i, 1);
                    }
                }
            }
        };
        this.getUser = function () {
            if (!this.Space) {
                console.error("Space is null");
                this.Space = { user: {} };
            }
            else if (!this.Space.user) {
                console.error("User in space is null, generating new anonymous user");
                this.Space.user = Util.generateAnonymousUser();
            }
            return this.Space.user;
        };
        this.getMembers = function () {
            return this.Space.members;
        };
        this.getSpaceTitle = function () {
            return this.Space.title;
        };
        this.setSpace = function (s) {
            this.Space = s;
        };
        return this;
    }
    encapsulateMessage(receiver, flags, action, payload) {
        var i, numOfFlags, flag;
        var validatedFlags = [];
        if (flags instanceof Array) {
            for (i = 0, numOfFlags = flags.length; i < numOfFlags; i++) {
                flag = flags[i];
                if (flag === CONFIG.IWC.FLAG.PUBLISH_LOCAL ||
                    flag === CONFIG.IWC.FLAG.PUBLISH_GLOBAL) {
                    validatedFlags.push(flag);
                }
            }
        }
        else if (typeof flags === "string") {
            if (flags === CONFIG.IWC.FLAG.PUBLISH_LOCAL ||
                flags === CONFIG.IWC.FLAG.PUBLISH_GLOBAL) {
                validatedFlags.push(flags);
            }
        }
        else {
            throw "Parameter flags has wrong type. Array or String expected.";
        }
        if (typeof action !== "string") {
            throw "Parameter action has wrong type. String expected.";
        }
        receiver = receiver || "";
        return {
            receiver: receiver,
            sender: this.componentName,
            data: "",
            dataType: "",
            action: action,
            flags: validatedFlags,
            extras: {
                payload: payload,
                time: new Date().getTime(),
            },
        };
    }
    sendBufferedMessages() {
        var intent;
        var data = null;
        for (var receiver in this._messageBuffer) {
            if (this._messageBuffer.hasOwnProperty(receiver)) {
                data = this._messageBuffer[receiver].splice(0, this._messageBuffer[receiver].length);
                if (data.length == 1) {
                    intent = this.encapsulateMessage(receiver, CONFIG.IWC.FLAG.PUBLISH_LOCAL, CONFIG.IWC.ACTION.DATA, data[0]);
                    if (IWC.util.validateIntent(intent)) {
                        this._iwc.publish(intent);
                    }
                }
                else if (data.length > 1) {
                    intent = this.encapsulateMessage(receiver, CONFIG.IWC.FLAG.PUBLISH_LOCAL, CONFIG.IWC.ACTION.DATA_ARRAY, data);
                    if (IWC.util.validateIntent(intent)) {
                        this._iwc.publish(intent);
                    }
                }
            }
        }
    }
    onIntentReceivedCallback(_self, intent) {
        if (typeof intent === "string") {
            try {
                intent = JSON.parse(intent);
                if (intent.hasOwnProperty("OpenApplicationEvent")) {
                    intent = intent["OpenApplicationEvent"];
                    if (intent.hasOwnProperty("message"))
                        intent = intent.message;
                }
            }
            catch (e) {
                return;
            }
        }
        if (!intent.hasOwnProperty("extras") ||
            !intent.extras.hasOwnProperty("payload")) {
            return;
        }
        var payload = intent.extras.payload, senderTime = intent.extras.time, senderTimes = _self._times[intent.sender];
        var i, numOfSenderTimes, numOfMessages;
        function handleMessage(payload) {
            var type, data, sender, operation, resOperation, i, numOfCallbacks;
            if (!payload ||
                !payload.hasOwnProperty("type") ||
                !payload.hasOwnProperty("data")) {
                return;
            }
            type = payload.type;
            data = payload.data;
            sender = payload.sender;
            switch (type) {
                case PAYLOAD_DATA_TYPE.OT_OPERATION:
                    operation = new OTOperation(data.name, data.value, data.type, data.position);
                    operation.setSender(sender);
                    resOperation =
                        OperationFactory.createOperationFromOTOperation(operation);
                    for (i = 0, numOfCallbacks = _self._onDataReceivedCallbacks.length; i < numOfCallbacks; i++) {
                        if (typeof _self._onDataReceivedCallbacks[i] === "function") {
                            var caller = _self._onDataReceivedCallers[i] || _self;
                            _self._onDataReceivedCallbacks[i].call(caller, resOperation);
                        }
                    }
                    break;
                case PAYLOAD_DATA_TYPE.NON_OT_OPERATION:
                    operation = new NonOTOperation(data.type, data.data);
                    operation.setSender(sender);
                    resOperation =
                        OperationFactory.createOperationFromNonOTOperation(operation);
                    for (i = 0, numOfCallbacks = _self._onDataReceivedCallbacks.length; i < numOfCallbacks; i++) {
                        if (typeof _self._onDataReceivedCallbacks[i] === "function") {
                            var caller = _self._onDataReceivedCallers[i] || _self;
                            _self._onDataReceivedCallbacks[i].call(caller, resOperation);
                        }
                    }
                    break;
            }
        }
        if (intent.flags.indexOf(CONFIG.IWC.FLAG.PUBLISH_GLOBAL) !== -1)
            return;
        if (typeof senderTimes === "undefined") {
            senderTimes = _self._times[intent.sender] = [];
        }
        else {
            for (i = 0, numOfSenderTimes = senderTimes.length; i < numOfSenderTimes; i++) {
                if (senderTime === senderTimes[i]) {
                    return;
                }
            }
        }
        senderTimes.push(senderTime);
        switch (intent.action) {
            case CONFIG.IWC.ACTION.DATA:
                handleMessage(payload);
                break;
            case CONFIG.IWC.ACTION.DATA_ARRAY:
                for (i = 0, numOfMessages = payload.length; i < numOfMessages; i++) {
                    handleMessage(payload[i]);
                }
                break;
        }
    }
}
export default class IWCW {
    constructor() { }
    static { this.instances = {}; }
    static hasInstance(componentName) {
        return componentName in IWCW.instances;
    }
    static getInstance(componentName, y) {
        if (!this.hasInstance(componentName)) {
            y = y || window.y;
            if (!y) {
                console.error("y is null, y is the shared y document that should be passed along when calling getInstance, proceed with caution");
            }
            IWCW.instances[componentName] = new IWCWrapper(componentName, y);
            IWCW.instances[componentName].connect();
        }
        return IWCW.instances[componentName];
    }
}
//# sourceMappingURL=IWCWrapper.js.map