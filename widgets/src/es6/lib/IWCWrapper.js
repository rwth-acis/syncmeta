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
  /**
   * Inter-widget communication wrapper
   * @class IWCWrapper
   * @constructor
   * @param componentName Name of component (widget) using the wrapper
   */

  /**
   * Set if local messages should be buffered
   * @type {boolean}
   */
  BUFFER_ENABLED = false;

  /**
   * Interval for sending buffered local messages
   * @type {number}
   */
  INTERVAL_SEND = 25;

  Space = null;

  //noinspection JSMismatchedCollectionQueryUpdate
  /**
   * Buffer for local messages
   * @type {Array}
   * @private
   */
  _messageBuffer = [];

  //noinspection JSMismatchedCollectionQueryUpdate
  /**
   * Set of registered Callbacks for local data receive events
   * @type {Array}
   * @private
   */
  _onDataReceivedCallbacks = [];

  _onDataReceivedCallers = [];

  /**
   * Stores (for each user) the times an inocming messages has been received to drop duplicate (same time) messages
   * @type {object}
   * @private
   */
  _times = {};

  /**
   * Inter widget communication client
   * @type {iwc.Client}
   * @private
   */
  _iwc;
  /**
   * Disconnect the iwc client
   * @memberof IWCWrapper#
   */
  disconnect;
  /**
   * Connect the iwc client
   * @memberof IWCWrapper#
   */
  connect;
  sendLocalMessage;
  sendLocalOTOperation;
  sendLocalNonOTOperation;
  getUserColor;
  registerOnDataReceivedCallback;
  unregisterOnDataReceivedCallback;
  getUser;
  getMembers;
  getSpaceTitle;
  setSpace;
  componentName;

  /**
   * Encapsulates the passed message information into the Android Intent-like format required by the iwc client
   * @param {string} receiver Component name of the receiving component (widget), empty string for remote messages
   * @param {string|string[]} flags Single flag or array of flags to indicate if the messages should be propagate locally or remotely
   * @param {string} action Type of data (DATA, DATA_ARRAY, SYNC)
   * @param {object} payload Message Payload
   * @returns {Object}
   */
  encapsulateMessage(receiver, flags, action, payload) {
    var i, numOfFlags, flag;
    // @ts-ignore
    var validatedFlags = [];

    if (flags instanceof Array) {
      for (i = 0, numOfFlags = flags.length; i < numOfFlags; i++) {
        flag = flags[i];
        if (
          flag === CONFIG.IWC.FLAG.PUBLISH_LOCAL ||
          flag === CONFIG.IWC.FLAG.PUBLISH_GLOBAL
        ) {
          // @ts-ignore
          validatedFlags.push(flag);
        }
      }
    } else if (typeof flags === "string") {
      if (
        flags === CONFIG.IWC.FLAG.PUBLISH_LOCAL ||
        flags === CONFIG.IWC.FLAG.PUBLISH_GLOBAL
      ) {
        // @ts-ignore
        validatedFlags.push(flags);
      }
    } else {
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

  /**
   * Send all buffered local messages encapsulated in one message
   */
  sendBufferedMessages() {
    var intent;
    var data = null;

    for (var receiver in this._messageBuffer) {
      if (this._messageBuffer.hasOwnProperty(receiver)) {
        data = this._messageBuffer[receiver].splice(
          0,
          this._messageBuffer[receiver].length
        );
        //sendBufferTimer.pause();
        if (data.length == 1) {
          intent = this.encapsulateMessage(
            receiver,
            CONFIG.IWC.FLAG.PUBLISH_LOCAL,
            CONFIG.IWC.ACTION.DATA,
            data[0]
          );
          if (IWC.util.validateIntent(intent)) {
            //console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g, "") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
            //console.log(intent);

            this._iwc.publish(intent);
          }
        } else if (data.length > 1) {
          intent = this.encapsulateMessage(
            receiver,
            CONFIG.IWC.FLAG.PUBLISH_LOCAL,
            CONFIG.IWC.ACTION.DATA_ARRAY,
            data
          );
          if (IWC.util.validateIntent(intent)) {
            //console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g, "") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
            //console.log(intent);

            this._iwc.publish(intent);
          }
        }
      }
    }
    //sendBufferTimer.resume();
  }

  /**
   * Callback for received local messages
   * @param {object} intent Message content in Android Intent-like format required by the iwc client
   */
  onIntentReceivedCallback(_self, intent) {
    //some CAE widgets still use the old iwc.js library
    //then it happens that intent are not parsed and processes correctly by the new iwc and then
    //the complete message as string is returned
    //this workaround should help for now to make it work with syncmeta
    if (typeof intent === "string") {
      try {
        intent = JSON.parse(intent);
        if (intent.hasOwnProperty("OpenApplicationEvent")) {
          intent = intent["OpenApplicationEvent"];
          if (intent.hasOwnProperty("message")) intent = intent.message;
        }
      } catch (e) {
        return;
      }
    }

    if (
      !intent.hasOwnProperty("extras") ||
      !intent.extras.hasOwnProperty("payload")
    ) {
      return;
    }

    var payload = intent.extras.payload,
      senderTime = intent.extras.time,
      senderTimes = _self._times[intent.sender];

    var i, numOfSenderTimes, numOfMessages;

    function handleMessage(payload) {
      var type, data, sender, operation, resOperation, i, numOfCallbacks;

      if (
        !payload ||
        !payload.hasOwnProperty("type") ||
        !payload.hasOwnProperty("data")
      ) {
        return;
      }
      type = payload.type;
      data = payload.data;
      sender = payload.sender;
      switch (type) {
        case PAYLOAD_DATA_TYPE.OT_OPERATION:
          operation = new OTOperation(
            data.name,
            data.value,
            data.type,
            data.position
          );
          operation.setSender(sender);
          resOperation =
            OperationFactory.createOperationFromOTOperation(operation);
          //adjustHistory(remoteOp);
          for (
            i = 0, numOfCallbacks = _self._onDataReceivedCallbacks.length;
            i < numOfCallbacks;
            i++
          ) {
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
          //adjustHistory(remoteOp);
          for (
            i = 0, numOfCallbacks = _self._onDataReceivedCallbacks.length;
            i < numOfCallbacks;
            i++
          ) {
            if (typeof _self._onDataReceivedCallbacks[i] === "function") {
              var caller = _self._onDataReceivedCallers[i] || _self;
              _self._onDataReceivedCallbacks[i].call(caller, resOperation);
            }
          }
          break;
      }
    }

    if (intent.flags.indexOf(CONFIG.IWC.FLAG.PUBLISH_GLOBAL) !== -1) return;

    if (typeof senderTimes === "undefined") {
      senderTimes = _self._times[intent.sender] = [];
    } else {
      for (
        i = 0, numOfSenderTimes = senderTimes.length;
        i < numOfSenderTimes;
        i++
      ) {
        if (senderTime === senderTimes[i]) {
          return;
        }
      }
    }

    senderTimes.push(senderTime);

    //console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g,"") + " INTENT RECEIVED AT COMPONENT " + componentName + " ===");
    //console.log(intent);

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

  constructor(componentName, y) {
    this.componentName = componentName;
    this._iwc = new IWC.Client(componentName, "*", null, y);
    window._iwc_instance_ = this._iwc;

    //var sendBufferTimer;
    //if(BUFFER_ENABLED) sendBufferTimer = new IWCWrapper.PausableInterval(sendBufferedMessages, INTERVAL_SEND);
    if (this.BUFFER_ENABLED)
      setInterval(this.sendBufferedMessages, this.INTERVAL_SEND);

    this.connect = () =>
      this._iwc.connect((intent) =>
        this.onIntentReceivedCallback(this, intent)
      );
    this.disconnect = () => this._iwc.disconnect;

    /**
     * Send data locally to an other component
     * @memberof IWCWrapper#
     * @param {string} receiver Component name of receiving component, empty string for broadcast
     * @param {object} data Data to send
     */
    (this.sendLocalMessage = function (receiver, data) {
      var intent;

      if (!receiver || receiver === "") return;

      if (this.BUFFER_ENABLED) {
        //sendBufferTimer.pause();
        if (this._messageBuffer.hasOwnProperty(receiver)) {
          this._messageBuffer[receiver].push(data);
        } else {
          this._messageBuffer[receiver] = [data];
        }
        //sendBufferTimer.resume();
      } else {
        intent = this.encapsulateMessage(
          receiver,
          CONFIG.IWC.FLAG.PUBLISH_LOCAL,
          CONFIG.IWC.ACTION.DATA,
          data
        );
        if (IWC.util.validateIntent(intent)) {
          //console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g,"") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
          //console.log(intent);

          this._iwc.publish(intent);
        }
      }
    }),
      /**
       * Send OTOperation locally to an other component
       * @memberof IWCWrapper#
       * @param {string} receiver Component name of receiving component, empty string for broadcast
       * @param {operations.ot.OTOperation} operation Operation to send
       */
      (this.sendLocalOTOperation = function (receiver, operation) {
        this.sendLocalMessage(receiver, {
          type: PAYLOAD_DATA_TYPE.OT_OPERATION,
          data: operation.getOperationObject(),
          sender: operation.getSender(),
        });
      }),
      /**
       * Send NonOTOperation locally to an other component
       * @memberof IWCWrapper#
       * @param {string} receiver Component name of receiving component, empty string for broadcast
       * @param {operations.non_ot.NonOTOperation} operation Operation to send
       */
      (this.sendLocalNonOTOperation = function (receiver, operation) {
        this.sendLocalMessage(receiver, {
          type: PAYLOAD_DATA_TYPE.NON_OT_OPERATION,
          data: operation.getOperationObject(),
          sender: operation.getSender(),
        });
      }),
      (this.getUserColor = function (jabberId) {
        return Util.getColor(this.Space.members[jabberId].globalId);
      }),
      /**
       * Register callback for local data receive events
       * @memberof IWCWrapper#
       * @param {function} callback
       */
      (this.registerOnDataReceivedCallback = function (callback, caller) {
        if (typeof callback === "function") {
          this.unregisterOnDataReceivedCallback(callback);
          this._onDataReceivedCallbacks.push(callback);
          this._onDataReceivedCallers.push(caller);
        }
      }),
      /**
       * Unregister callback for local data receive events
       * @memberof IWCWrapper#
       * @param {function} callback
       */
      (this.unregisterOnDataReceivedCallback = function (callback) {
        var i, numOfCallbacks;

        if (typeof callback === "function") {
          for (
            i = 0, numOfCallbacks = this._onDataReceivedCallbacks.length;
            i < numOfCallbacks;
            i++
          ) {
            if (callback === this._onDataReceivedCallbacks[i]) {
              this._onDataReceivedCallbacks.splice(i, 1);
              this._onDataReceivedCallers.splice(i, 1);
            }
          }
        }
      }),
      (this.getUser = function () {
        if (!this.Space) {
          console.error("Space is null");
          return null;
        }
        return this.Space.user;
      }),
      (this.getMembers = function () {
        return this.Space.members;
      }),
      (this.getSpaceTitle = function () {
        return this.Space.title;
      }),
      (this.setSpace = function (s) {
        this.Space = s;
      });

    return this;
  }
}

/**
 * Inter widget communication and OT client module
 * @exports IWCW
 */
export default class IWCW {
  static instance;
  constructor() {}
  /**
   * Instance of IWCWrapper
   * @type {IWCWrapper}
   */

  static hasInstance() {
    return !!IWCW.instance;
  }

  /**
   * Get instance of IWCOTWrapper
   * @param {string} componentName Name of component (widget) using the wrapper
   * @returns {IWCWrapper}
   */
  static getInstance(componentName, y) {
    if (!IWCW.instance) {
      if (!y) {
        console.error(
          "y is null, y is the shared y document that should be passed along when calling getInstance, proceed with caution"
        );
      }
      IWCW.instance = new IWCWrapper(componentName, y);
      IWCW.instance.connect();
    }
    return IWCW.instance;
  }
}
