define([
    'iwc',
    'operations/ot/OTOperation',
    'operations/non_ot/NonOTOperation',
    'operations/OperationFactory',
    'Util',
    'promise!Space'
],/** @lends IWC */function(IIWC,OTOperation,NonOTOperation,OperationFactory, Util, Space){

    var PAYLOAD_DATA_TYPE = {
        OT_OPERATION: "OTOperation",
        NON_OT_OPERATION: "NonOTOperation"
    };

    /**
     * Inter widget communication and OT client module
     * @exports IWC
     */
    var IWC={};

    /**
     * Inter-widget communication wrapper
     * @class IWCWrapper
     * @constructor
     * @param componentName Name of component (widget) using the wrapper
     */
    function IWCWrapper(componentName){

        /**
         * Set if local messages should be buffered
         * @type {boolean}
         */
        var BUFFER_ENABLED = true;

        /**
         * Interval for sending buffered local messages
         * @type {number}
         */
        var INTERVAL_SEND  = 25;

        //noinspection JSMismatchedCollectionQueryUpdate
        /**
         * Buffer for local messages
         * @type {Array}
         * @private
         */
        var _messageBuffer = [];

        //noinspection JSMismatchedCollectionQueryUpdate
        /**
         * Set of registered Callbacks for local data receive events
         * @type {Array}
         * @private
         */
        var _onDataReceivedCallbacks = [];

        var _onDataReceivedCallers = [];

        /**
         * Stores (for each user) the times an inocming messages has been received to drop duplicate (same time) messages
         * @type {object}
         * @private
         */
        var _times = {};

        /**
         * Inter widget communication client
         * @type {iwc.Client}
         * @private
         */
        var _iwc = new IIWC.Client(componentName);
        window._iwc_instance_ = _iwc;


        /**
         * Encapsulates the passed message information into the Android Intent-like format required by the iwc client
         * @param {string} receiver Component name of the receiving component (widget), empty string for remote messages
         * @param {string|string[]} flags Single flag or array of flags to indicate if the messages should be propagate locally or remotely
         * @param {string} action Type of data (DATA, DATA_ARRAY, SYNC)
         * @param {object} payload Message Payload
         * @returns {Object}
         */
        var encapsulateMessage = function(receiver,flags,action,payload){
            var i, numOfFlags, flag;
            var validatedFlags = [];

            if(flags instanceof Array){
                for (i = 0, numOfFlags = flags.length; i < numOfFlags; i++) {
                    flag = flags[i];
                    if(flag === CONFIG.IWC.FLAG.PUBLISH_LOCAL || flag === CONFIG.IWC.FLAG.PUBLISH_GLOBAL){
                        validatedFlags.push(flag);
                    }
                }
            } else if (typeof flags === "string"){
                if(flags === CONFIG.IWC.FLAG.PUBLISH_LOCAL || flags === CONFIG.IWC.FLAG.PUBLISH_GLOBAL){
                    validatedFlags.push(flags);
                }
            } else {
                throw "Parameter flags has wrong type. Array or String expected.";
            }

            if(typeof action !== "string"){
                throw "Parameter action has wrong type. String expected.";
            }

            receiver = receiver || "";

            return {
                "component": receiver,
                "sender": componentName,
                "data": "",
                "dataType": "",
                "action": action,
                "flags"	: validatedFlags,
                "extras":{
                    "payload": payload,
                    "time": parseInt(new Date().getTime(), 10)
                }
            };
        };

        /**
         * Send all buffered local messages encapsulated in one message
         */
        var sendBufferedMessages = function(){
            var intent;
            var data = _messageBuffer.splice(0,_messageBuffer.length);
            //sendBufferTimer.pause();
            if(data.length == 1){
                intent = encapsulateMessage(CONFIG.WIDGET.NAME.MAIN,CONFIG.IWC.FLAG.PUBLISH_LOCAL, CONFIG.IWC.ACTION.DATA, data[0]);
                if (IIWC.util.validateIntent(intent)) {

                    console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g,"") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
                    console.log(intent);

                    _iwc.publish(intent);
                }
            } else if(data.length > 1){
                intent = encapsulateMessage(CONFIG.WIDGET.NAME.MAIN,CONFIG.IWC.FLAG.PUBLISH_LOCAL, CONFIG.IWC.ACTION.DATA_ARRAY, data);
                if (IIWC.util.validateIntent(intent)) {

                    console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g,"") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
                    console.log(intent);

                    _iwc.publish(intent);
                }
            }
            //sendBufferTimer.resume();
        };

        /**
         * Callback for received local messages
         * @param {object} intent Message content in Android Intent-like format required by the iwc client
         */
        var onIntentReceivedCallback = function(intent){
            var payload = intent.extras.payload,
                senderTime = intent.extras.time,
                senderTimes = _times[intent.extras.sender];

            var i,
                numOfSenderTimes,
                numOfMessages;

            function handleMessage(payload){
                var type,
                    data,
                    sender,
                    operation,
                    resOperation,
                    i,
                    numOfCallbacks;

                if(!payload || !payload.hasOwnProperty("type") || !payload.hasOwnProperty("data")){
                    return;
                }
                type = payload.type;
                data = payload.data;
                sender = payload.sender;
                switch (type){
                    case PAYLOAD_DATA_TYPE.OT_OPERATION:
                        operation = new OTOperation(data.name,data.value,data.type,data.position);
                        operation.setSender(sender);
                        resOperation = OperationFactory.createOperationFromOTOperation(operation);
                        //adjustHistory(remoteOp);
                        for(i = 0, numOfCallbacks = _onDataReceivedCallbacks.length; i < numOfCallbacks; i++){
                            if(typeof _onDataReceivedCallbacks[i] === 'function'){
                                var caller = _onDataReceivedCallers[i] || this;
                                _onDataReceivedCallbacks[i].call(caller, resOperation);
                            }
                        }
                        break;
                    case PAYLOAD_DATA_TYPE.NON_OT_OPERATION:
                        operation = new NonOTOperation(data.type,data.data);
                        operation.setSender(sender);
                        resOperation = OperationFactory.createOperationFromNonOTOperation(operation);
                        //adjustHistory(remoteOp);
                        for(i = 0, numOfCallbacks = _onDataReceivedCallbacks.length; i < numOfCallbacks; i++){
                            if(typeof _onDataReceivedCallbacks[i] === 'function'){
                                var caller = _onDataReceivedCallers[i] || this;
                                _onDataReceivedCallbacks[i].call(caller, resOperation);
                            }
                        }
                        break;
                }
            }

            if(intent.flags.indexOf(CONFIG.IWC.FLAG.PUBLISH_GLOBAL) !== -1) return;

            if(typeof senderTimes === "undefined"){
                senderTimes = _times[intent.extras.sender] = [];
            } else {
                for(i = 0, numOfSenderTimes = senderTimes.length; i < numOfSenderTimes; i++){
                    if(senderTime === senderTimes[i]){
                        return;
                    }
                }
            }

            senderTimes.push(senderTime);

            console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g,"") + " INTENT RECEIVED AT COMPONENT " + componentName + " ===");
            console.log(intent);

            switch(intent.action){
                case CONFIG.IWC.ACTION.DATA:
                    handleMessage(payload);
                    break;
                case CONFIG.IWC.ACTION.DATA_ARRAY:
                    for(i = 0, numOfMessages = payload.length; i < numOfMessages; i++){
                        handleMessage(payload[i]);
                    }
                    break;
            }
        };

        //var sendBufferTimer;
        //if(BUFFER_ENABLED) sendBufferTimer = new IWCWrapper.PausableInterval(sendBufferedMessages, INTERVAL_SEND);
        if(BUFFER_ENABLED) setInterval(sendBufferedMessages,INTERVAL_SEND);

        return {
            _iwc: _iwc,
            /**
             * Connect the iwc client
             * @memberof IWCWrapper#
             */
            connect: function(){
                _iwc.connect(onIntentReceivedCallback);
            },
            /**
             * Disconnect the iwc client
             * @memberof IWCWrapper#
             */
            disconnect: function(){
                _iwc.disconnect();
            },
            /**
             * Send data locally to an other component
             * @memberof IWCWrapper#
             * @param {string} receiver Component name of receiving component, empty string for broadcast
             * @param {object} data Data to send
             */
            sendLocalMessage: function(receiver,data){
                var intent;

                if(!receiver || receiver === "") return;

                if(BUFFER_ENABLED){
                    //sendBufferTimer.pause();
                    _messageBuffer.push(data);
                    //sendBufferTimer.resume();
                } else {
                    intent = encapsulateMessage(receiver, CONFIG.IWC.FLAG.PUBLISH_LOCAL, CONFIG.IWC.ACTION.DATA, data);
                    if (IIWC.util.validateIntent(intent)) {

                        console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g,"") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
                        console.log(intent);

                        _iwc.publish(intent);
                    }
                }
            },
            /**
             * Send OTOperation locally to an other component
             * @memberof IWCWrapper#
             * @param {string} receiver Component name of receiving component, empty string for broadcast
             * @param {operations.ot.OTOperation} operation Operation to send
             */
            sendLocalOTOperation:function(receiver,operation){
                this.sendLocalMessage(receiver,{
                    type: PAYLOAD_DATA_TYPE.OT_OPERATION,
                    data: operation.getOperationObject(),
                    sender: operation.getSender()
                });
            },
            /**
             * Send NonOTOperation locally to an other component
             * @memberof IWCWrapper#
             * @param {string} receiver Component name of receiving component, empty string for broadcast
             * @param {operations.non_ot.NonOTOperation} operation Operation to send
             */
            sendLocalNonOTOperation:function(receiver,operation){
                this.sendLocalMessage(receiver,{
                    type: PAYLOAD_DATA_TYPE.NON_OT_OPERATION,
                    data: operation.getOperationObject(),
                    sender: operation.getSender()
                });
            },
            getUserColor: function(jabberId){
                return Util.getColor(Space.members[jabberId].globalId);
            },
            /**
             * Register callback for local data receive events
             * @memberof IWCWrapper#
             * @param {function} callback
             */
            registerOnDataReceivedCallback: function(callback, caller){
                if(typeof callback === "function"){
                    this.unregisterOnDataReceivedCallback(callback);
                    _onDataReceivedCallbacks.push(callback);
                    _onDataReceivedCallers.push(caller);
                }
            },
            /**
             * Unregister callback for local data receive events
             * @memberof IWCWrapper#
             * @param {function} callback
             */
            unregisterOnDataReceivedCallback: function(callback){
                var i, numOfCallbacks;

                if(typeof callback === "function"){
                    for(i = 0, numOfCallbacks = _onDataReceivedCallbacks.length; i < numOfCallbacks; i++){
                        if(callback === _onDataReceivedCallbacks[i]){
                            _onDataReceivedCallbacks.splice(i,1);
                            _onDataReceivedCallers.splice(i, 1);
                        }
                    }
                }
            },

            getUser: function(){
                return Space.user;
            }
        };
    }

    /**
     * Instance of IWCWrapper
     * @type {IWCWrapper}
     */
    var instance = null;

    IWC.hasInstance = function(){
        if(instance === null){
            return false;
        } else {
            return instance;
        }
    };

    /**
     * Get instance of IWCOTWrapper
     * @param {string} componentName Name of component (widget) using the wrapper
     * @returns {IWCWrapper}
     */
    IWC.getInstance = function(componentName){
        if(instance === null){
            instance = new IWCWrapper(componentName);
            instance.connect();
        }
        return instance;
    };


    return IWC;

});
