define([
    'require',
    'iwc',
    'ot',
    'Util',
    'operations/ot/OTOperation',
    'operations/non_ot/NonOTOperation',
    'operations/non_ot/JoinOperation',
    'operations/ot/EntityOperation',
    'operations/ot/ValueChangeOperation',
    'operations/OperationFactory',
    'promise!Space'
],/** @lends IWCOT */function(require,IWC,OT,Util,OTOperation,NonOTOperation,JoinOperation,EntityOperation,ValueChangeOperation,OperationFactory,space){

    var PAYLOAD_DATA_TYPE = {
        OT_OPERATION: "OTOperation",
        NON_OT_OPERATION: "NonOTOperation"
    };

    /**
     * Inter widget communication and OT client module
     * @exports IWCOT
     */
    var IWCOT={};

    /**
     * Constants for the current joining state
     * @type {{NOT_JOINED: number, REQUESTED: number, COMPLETED: number}}
     */
    IWCOT.JOIN_STATE = {
        NOT_JOINED: 0,
        REQUESTED: 1,
        COMPLETED: 2
    };

    /**
     * Inter-widget communication and OT wrapper
     * @class IWCOTWrapper
     * @constructor
     * @param {string} componentName Name of component (widget) using the wrapper
     * @param {number} localID Global id of local user
     */
    function IWCOTWrapper(componentName,localID){
        var that = this;

        /**
         * Set if local and remote messages should be buffered
         * @type {boolean}
         */
        var BUFFER_ENABLED = true;

        /**
         * Interval for sending buffered local messages
         * @type {number}
         */
        var INTERVAL_SEND_LOCAL  = 25;

        /**
         * Interval for sending buffered remote messages
         * @type {number}
         */
        var INTERVAL_SEND_REMOTE  = 200;

        /**
         * Interval for sending sync messages
         * @type {number}
         */
        var INTERVAL_SYNC  = 10000;

        /**
         * Interval for sending purge messages
         * @type {number}
         */
        var INTERVAL_PURGE = 10000;

        /**
         * Buffer for remote messages
         * @type {Array}
         * @private
         */
        var _remoteMessageBuffer = [];

        /**
         * Buffer for local messages
         * @type {Array}
         * @private
         */
        var _localMessageBuffer = [];

        /**
         * History of last operations for undo/redo
         * @type {Array}
         * @private
         */
        var _history = [];

        /**
         * Current position in history
         * @type {number}
         * @private
         */
        var _historyPosition = -1;

        /**
         * Maximum number of operations stored in history
         * @type {number}
         * @private
         */
        var _maxHistoryLength = 50;

        //noinspection JSMismatchedCollectionQueryUpdate
        /**
         * Set of registered Callbacks for remote data receive events
         * @type {Array}
         * @private
         */
        var _onRemoteDataReceivedCallbacks = [];

        //noinspection JSMismatchedCollectionQueryUpdate
        /**
         * Set of registered Callbacks for local data receive events
         * @type {Array}
         * @private
         */
        var _onLocalDataReceivedCallbacks = [];

        //noinspection JSMismatchedCollectionQueryUpdate
        /**
         * Set of registered Callbacks for history (undo/redo) events
         * @type {Array}
         * @private
         */
        var _onHistoryCallbacks = [];

        //noinspection JSMismatchedCollectionQueryUpdate
        /**
         * Set of registered Callbacks for join or leave events
         * @type {Array}
         * @private
         */
        var _onJoinOrLeaveCallbacks = [];

        /**
         * Stores (for each user) the times an inocming messages has been received to drop duplicate (same time) messages
         * @type {object}
         * @private
         */
        var _times = {};

        /**
         * Flag if ot library should perform a sync
         * @type {boolean}
         * @private
         */
        var _shouldSync = false;

        /**
         * Flag if ot library should perform a purge
         * @type {boolean}
         * @private
         */
        var _shouldPurge = false;

        /**
         * Inter widget communication client
         * @type {iwc.Client}
         * @private
         */
        var _iwc = new IWC.Client(componentName);
        window._iwc_instance_ = _iwc;

        /**
         * OT client
         * @type {ot}
         * @private
         */
        var _ot = new OT(localID);

        /**
         * Set of joining users
         * @type {string[]}
         * @private
         */
        var _joiningUsers = [];

        //noinspection JSMismatchedCollectionQueryUpdate
        /**
         * Buffer for operations waiting for being fed into the ot library
         * @type {Array}
         * @private
         */
        var _otOperationBuffer = [];

        /**
         * Flag if joining is complete
         * @type {number}
         * @private
         */
        var _joiningState = IWCOT.JOIN_STATE.NOT_JOINED;

        /**
         * Timeout to cancel joining process if nobody is replying
         */
        var _joiningTimeout;

        /**
         * Timeouts to cancel joining process if nobody is replying
         */
        var _joiningUsersTimeouts = [];

        /**
         * Callback to cancel joining process if nobody is replying
         */
        var _joiningTimeoutCallback;

        /**
         * Adds an operation to the history
         * @param {operations.ot.EntityOperation} operation
         */
        var addToHistory = function(operation){
            var i, numOfCallbacks;
            if(_historyPosition < 0){
                _history = [];
                _history.push(operation);
                _historyPosition = 0;
            } else {
                _historyPosition += 1;
                _history = _history.slice(Math.max(0,_historyPosition-_maxHistoryLength+1),_historyPosition);
                _historyPosition = Math.min(_maxHistoryLength-1,_historyPosition);
                _history.push(operation);
            }
            for(i = 0, numOfCallbacks = _onHistoryCallbacks.length; i < numOfCallbacks; i++){
                _onHistoryCallbacks[i](null,_history.length,_historyPosition);
            }
        };

        /**
         * Adjust all operations in the history with regard to the passed newly received operation
         * @param {operations.ot.EntityOperation} operationNew Received operation
         */
        var adjustHistory = function(operationNew){
            var i;
            var newHistory= [];
            var adjustedOperation;
            var numOfCallbacks;
            for(i = _history.length - 1; i >= 0; i--){
                adjustedOperation = adjustOperation(_history[i],operationNew);
                if(adjustedOperation === null){
                    if(i <= _historyPosition){
                        _historyPosition -= 1;
                    }
                } else {
                    newHistory.unshift(adjustedOperation);
                }
            }
            _history = newHistory;
            for(i = 0, numOfCallbacks = _onHistoryCallbacks.length; i < numOfCallbacks; i++){
                _onHistoryCallbacks[i](null,_history.length,_historyPosition);
            }
        };

        /**
         * Adjust passed operation with regard to the passed newly received operation
         * @param {operations.ot.EntityOperation} operation Operation to adjust
         * @param {operations.ot.EntityOperation} operationNew Received operation
         * @returns {operations.ot.EntityOperation}
         */
        var adjustOperation = function(operation, operationNew){
            return operationNew.adjust(require('canvas_widget/EntityManager'),operation);
        };

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
         * Send all buffered remote messages encapsulated in one message
         */
        var sendBufferedRemoteMessages = function(){
            var intent;
            var data = _remoteMessageBuffer.splice(0,_remoteMessageBuffer.length);

            if(data.length == 1){
                intent = encapsulateMessage(null,CONFIG.IWC.FLAG.PUBLISH_GLOBAL, CONFIG.IWC.ACTION.DATA, data[0]);
                if (IWC.util.validateIntent(intent)) {

                    console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g,"") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
                    console.log(intent);

                    _iwc.publish(intent);
                    _remoteMessageBuffer = [];
                }
            } else if(data.length > 1){
                intent = encapsulateMessage(null,CONFIG.IWC.FLAG.PUBLISH_GLOBAL, CONFIG.IWC.ACTION.DATA_ARRAY, data);
                if (IWC.util.validateIntent(intent)) {

                    console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g,"") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
                    console.log(intent);

                    _iwc.publish(intent);
                }
            }
        };

        /**
         * Send all buffered local messages encapsulated in one message
         */
        var sendBufferedLocalMessages = function(){
            var intent;
            var data;

            for(var receiver in _localMessageBuffer){
                if(_localMessageBuffer.hasOwnProperty(receiver)){
                    data = _localMessageBuffer[receiver].splice(0,_localMessageBuffer[receiver].length);
                    //sendBufferTimer.pause();
                    if(data.length == 1){
                        intent = encapsulateMessage(receiver,CONFIG.IWC.FLAG.PUBLISH_LOCAL, CONFIG.IWC.ACTION.DATA, data[0]);
                        if (IWC.util.validateIntent(intent)) {
                            console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g,"") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
                            console.log(intent);

                            _iwc.publish(intent);
                        }
                    } else if(data.length > 1){
                        intent = encapsulateMessage(receiver,CONFIG.IWC.FLAG.PUBLISH_LOCAL, CONFIG.IWC.ACTION.DATA_ARRAY, data);
                        if (IWC.util.validateIntent(intent)) {

                            console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g,"") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
                            console.log(intent);

                            _iwc.publish(intent);
                        }
                    }
                    //sendBufferTimer.resume();
                }
            }
        };

        /**
         * Send sync message
         * @param {object} sites Sync data generated by ot client
         */
        var sendSyncMessage = function(sites){
            var data, intent;

            data = {
                site: localID,
                sites: sites
            };
            intent = encapsulateMessage(null,CONFIG.IWC.FLAG.PUBLISH_GLOBAL,CONFIG.IWC.ACTION.SYNC,data);
            if (IWC.util.validateIntent(intent)) {

                console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g,"") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
                console.log(intent);

                _iwc.publish(intent);
            }
        };

        /**
         * Callback to initiate ot sync
         */
        var sync = function(){
            var toSend;

            //TODO: Set shouldSync on true, if and only if an operation has propagated or on negative server response
            //@see https://github.com/opencoweb/coweb-jsoe/blob/master/examples/inbrowser/main.js
            _shouldSync = true;
            if (_shouldSync) {
                toSend = _ot.syncOutbound();
                sendSyncMessage(toSend);
                _shouldSync = false;
            }
        };

        /**
         * Callback to initiate ot purge
         */
        var purge = function(){

            //TODO: Set shouldPurge on true, if and only if $condition
            //@see https://github.com/opencoweb/coweb-jsoe/blob/master/examples/inbrowser/main.js
            _shouldPurge = true;
            if (_shouldPurge) {
                _ot.purge();
                _shouldPurge = false;
            }
        };

        /**
         * Callback for received (local and remote) messages
         * @param {object} intent Message content in Android Intent-like format required by the iwc client
         */
        var onIntentReceivedCallback = function(intent){
            var payload = intent.extras.payload,
                senderTime = intent.extras.time,
                senderTimes = _times[intent.sender || "me"];

            var i,
                numOfSenderTimes,
                numOfMessages;

            function handleRemoteMessage(payload){
                var type,
                    data,
                    sender,
                    time,
                    remoteOp,
                    operation,
                    operations,
                    resOperation,
                    i,
                    j,
                    numOfCallbacks,
                    numOfOperations,
                    entityIdChain = [],
                    userPosition;

                if(!payload || !payload.hasOwnProperty("type") || !payload.hasOwnProperty("data")){
                    return;
                }
                type = payload.type;
                data = payload.data;
                sender = payload.sender;
                switch (type){
                    case PAYLOAD_DATA_TYPE.OT_OPERATION:
                        if(data.hasOwnProperty("entityIdChain")){
                            entityIdChain = data.entityIdChain.split(":");
                            delete data.entityIdChain;
                        }
                        time = new Date().getTime();
                        console.log("OT is stable: " + _ot.isStable());
                        remoteOp = _ot.remoteEvent(time,data);
                        operation = new OTOperation(data.name,remoteOp.value,remoteOp.type,remoteOp.position);
                        operation.setSender(sender);
                        resOperation = OperationFactory.createOperationFromOTOperation(operation);
                        if(resOperation instanceof ValueChangeOperation){
                            resOperation.setEntityIdChain(entityIdChain);
                        }
                        adjustHistory(resOperation);
                        for(i = 0, numOfCallbacks = _onRemoteDataReceivedCallbacks.length; i < numOfCallbacks; i++){
                            if(typeof _onRemoteDataReceivedCallbacks[i] === 'function'){
                                _onRemoteDataReceivedCallbacks[i](resOperation);
                            }
                        }
                        break;
                    case PAYLOAD_DATA_TYPE.NON_OT_OPERATION:
                        operation = new NonOTOperation(data.type,data.data);
                        operation.setSender(sender);
                        resOperation = OperationFactory.createOperationFromNonOTOperation(operation);


                        if(resOperation instanceof JoinOperation){
                            // First step
                            if(!resOperation.isDone()){

                                // A remote user tries to join..
                                if(resOperation.getUser() !== space.user[CONFIG.NS.PERSON.JABBERID]){

                                    console.log("JOINING LOG: REMOTE USER TRIES TO JOIN: " + resOperation.getUser());

                                    // ..and I already have joined
                                    if(_joiningState === IWCOT.JOIN_STATE.COMPLETED){
                                        _joiningUsers.push(resOperation.getUser());
                                        setTimeout(function(){
                                            clearInterval(_syncInterval);
                                            clearInterval(_purgeInterval);
                                            _ot = new OT(localID);
                                            sendRemoteNonOTOperation(new JoinOperation(resOperation.getUser(),true,space.user[CONFIG.NS.PERSON.JABBERID],require('canvas_widget/EntityManager').graphToJSON()).toNonOTOperation());
                                        },500);

                                        //Unlock if no remote message is received within 5 seconds
                                        _joiningUsersTimeouts[resOperation.getUser()] = setTimeout(function(){

                                            console.log("JOINING LOG: JOINING REMOTE USER DID NOT REPLY: " + resOperation.getUser());

                                            var userPosition = _joiningUsers.indexOf(sender);

                                            if(userPosition > -1){
                                                _joiningUsers.splice(userPosition,1);
                                            }
                                            if(_joiningUsers.length === 0){
                                                numOfOperations = _otOperationBuffer.length;
                                                operations = _otOperationBuffer.splice(0,numOfOperations);
                                                for(j = 0, numOfOperations = operation.length; j < numOfOperations; j++){
                                                    sendRemoteNonOTOperation(operations[j]).toNonOTOperation();
                                                }
                                            }
                                        },5000);
                                    } else {
                                        return;
                                    }

                                    //I try to join..
                                } else {

                                    console.log("JOINING LOG: GOT RESPONSE ON MY JOINING REQUEST");

                                    // ..and I did not get a reply on my join request or I already have joined in the meanwhile
                                    if(_joiningState === IWCOT.JOIN_STATE.NOT_JOINED || _joiningState === IWCOT.JOIN_STATE.COMPLETED){
                                        clearTimeout(_joiningTimeout);
                                        _joiningState = IWCOT.JOIN_STATE.REQUESTED;
                                        sendRemoteNonOTOperation(new JoinOperation(space.user[CONFIG.NS.PERSON.JABBERID],true,space.user[CONFIG.NS.PERSON.JABBERID],{}).toNonOTOperation());
                                    }

                                }

                                //Second step
                            } else {
                                // A remote user tries to join..
                                if(resOperation.getUser() !== space.user[CONFIG.NS.PERSON.JABBERID]){

                                    console.log("JOINING LOG: REMOTE USER FINISHED JOINING: " + resOperation.getUser());

                                    // ..and I already have joined
                                    if(_joiningState === IWCOT.JOIN_STATE.COMPLETED){
                                        //sendRemoteNonOTOperation(new JoinOperation(resOperation.getUser(),true,space.user[CONFIG.NS.PERSON.JABBERID],{}).toNonOTOperation());
                                        userPosition = _joiningUsers.indexOf(sender);
                                        if(userPosition > -1){
                                            _joiningUsers.splice(userPosition,1);
                                        }
                                        if(_joiningUsers.length === 0){
                                            numOfOperations = _otOperationBuffer.length;
                                            operations = _otOperationBuffer.splice(0,numOfOperations);
                                            for(j = 0, numOfOperations = operation.length; j < numOfOperations; j++){
                                                sendRemoteNonOTOperation(operations[j]).toNonOTOperation();
                                            }
                                        }
                                        _syncInterval = setInterval(sync,INTERVAL_SYNC);
                                        _purgeInterval = setInterval(purge,INTERVAL_PURGE);
                                    } else {
                                        return;
                                    }

                                    //I try to join..
                                } else {

                                    console.log("JOINING LOG: LOCAL USER FINISHED JOINING");

                                    _joiningState = IWCOT.JOIN_STATE.COMPLETED;

                                }
                            }
                            for(i = 0, numOfCallbacks = _onJoinOrLeaveCallbacks.length; i < numOfCallbacks; i++){
                                if(typeof _onJoinOrLeaveCallbacks[i] === 'function'){
                                    _onJoinOrLeaveCallbacks[i](resOperation);
                                }
                            }
                            return;
                        }
                        for(i = 0, numOfCallbacks = _onRemoteDataReceivedCallbacks.length; i < numOfCallbacks; i++){
                            if(typeof _onRemoteDataReceivedCallbacks[i] === 'function'){
                                _onRemoteDataReceivedCallbacks[i](resOperation);
                            }
                        }
                        break;
                }
            }

            function handleLocalMessage(payload){
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
                        for(i = 0, numOfCallbacks = _onLocalDataReceivedCallbacks.length; i < numOfCallbacks; i++){
                            if(typeof _onLocalDataReceivedCallbacks[i] === 'function'){
                                _onLocalDataReceivedCallbacks[i](resOperation);
                            }
                        }
                        break;
                    case PAYLOAD_DATA_TYPE.NON_OT_OPERATION:
                        operation = new NonOTOperation(data.type,data.data);
                        operation.setSender(sender);
                        resOperation = OperationFactory.createOperationFromNonOTOperation(operation);
                        for(i = 0, numOfCallbacks = _onLocalDataReceivedCallbacks.length; i < numOfCallbacks; i++){
                            if(typeof _onLocalDataReceivedCallbacks[i] === 'function'){
                                _onLocalDataReceivedCallbacks[i](resOperation);
                            }
                        }
                        break;
                }
            }

            if((intent.sender === "" || intent.sender === componentName) && intent.flags.indexOf(CONFIG.IWC.FLAG.PUBLISH_GLOBAL) !== -1) return;

            if(typeof senderTimes === "undefined"){
                senderTimes = _times[intent.sender || "me"] = [];
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

            if(intent.flags.indexOf(CONFIG.IWC.FLAG.PUBLISH_LOCAL) !== -1){
                switch(intent.action){
                    case CONFIG.IWC.ACTION.DATA:
                        handleLocalMessage(payload);
                        break;
                    case CONFIG.IWC.ACTION.DATA_ARRAY:
                        for(i = 0, numOfMessages = payload.length; i < numOfMessages; i++){
                            handleLocalMessage(payload[i]);
                        }
                        break;
                }
            }

            if(intent.flags.indexOf(CONFIG.IWC.FLAG.PUBLISH_GLOBAL) !== -1){
                switch(intent.action){
                    case CONFIG.IWC.ACTION.SYNC:
                        _ot.syncInbound(payload.site,payload.sites);
                        break;
                    case CONFIG.IWC.ACTION.DATA:
                        handleRemoteMessage(payload);
                        break;
                    case CONFIG.IWC.ACTION.DATA_ARRAY:
                        for(i = 0, numOfMessages = payload.length; i < numOfMessages; i++){
                            handleRemoteMessage(payload[i]);
                        }
                        break;
                }
            }
        };

        var sendRemoteNonOTOperation = function sendRemoteNonOTOperation(operation){
            _remoteMessageBuffer.push({
                type: PAYLOAD_DATA_TYPE.NON_OT_OPERATION,
                data: operation.getOperationObject(),
                sender: space.user[CONFIG.NS.PERSON.JABBERID]
            });
        };

        _joiningState = IWCOT.JOIN_STATE.NOT_JOINED;
        _joiningTimeoutCallback = function(){
            var i,
                numOfCallbacks;

            console.log("JOINING LOG: NO USER OUT THERE: JOINING COMPLETED");

            _joiningState = IWCOT.JOIN_STATE.COMPLETED;

            for(i = 0, numOfCallbacks = _onJoinOrLeaveCallbacks.length; i < numOfCallbacks; i++){
                if(typeof _onJoinOrLeaveCallbacks[i] === 'function'){
                    _onJoinOrLeaveCallbacks[i](new JoinOperation(space.user[CONFIG.NS.PERSON.JABBERID],true,space.user[CONFIG.NS.PERSON.JABBERID],{}));
                }
            }
        };
        _joiningTimeout = setTimeout(_joiningTimeoutCallback,5000);
        console.log("JOINING LOG: LOCAL USER TRIES TO JOIN");
        sendRemoteNonOTOperation(new JoinOperation(space.user[CONFIG.NS.PERSON.JABBERID],false,space.user[CONFIG.NS.PERSON.JABBERID],{}).toNonOTOperation());

        //var sendBufferTimer = new IWCOT.PausableInterval(sendBufferedMessages,INTERVAL_SEND);
        if(BUFFER_ENABLED) setInterval(sendBufferedLocalMessages,INTERVAL_SEND_LOCAL);

        setInterval(sendBufferedRemoteMessages,INTERVAL_SEND_REMOTE);
        var _syncInterval = setInterval(sync,INTERVAL_SYNC);
        var _purgeInterval = setInterval(purge,INTERVAL_PURGE);

        //noinspection JSUnusedGlobalSymbols
        return {
            /**
             * Connect the iwc client
             * @memberof IWCOTWrapper
             */
            connect: function(){
                _iwc.connect(onIntentReceivedCallback);
            },
            /**
             * Disconnect the iwc client
             * @memberof IWCOTWrapper
             */
            disconnect: function(){
                _iwc.disconnect();
            },
            /**
             * Get user information of local user
             * @memberof IWCOTWrapper
             * @returns {object}
             */
            getUser: function(){
                return space.user;
            },
            /**
             * Get color of local user
             * @memberof IWCOTWrapper
             * @param jabberId
             * @returns {*}
             */
            getUserColor: function(jabberId){
                return Util.getColor(space.members[jabberId].globalId);
            },
            /**
             * Get information of all users in space
             * @memberof IWCOTWrapper
             * @returns {object}
             */
            getMembers: function(){
                return space.members;
            },
            /**
             * Get Joining State
             * @returns {number}
             */
            getJoiningState: function(){
                return _joiningState;
            },
            /**
             * Send data locally to an other component
             * @memberof IWCOTWrapper
             * @param {string} receiver Component name of receiving component, empty string for broadcast
             * @param {object} data Data to send
             */
            sendLocalMessage: function(receiver,data){
                var intent;

                if(!receiver || receiver === "") return;

                if(BUFFER_ENABLED){
                    //sendBufferTimer.pause();
                    if(_localMessageBuffer.hasOwnProperty(receiver)){
                        _localMessageBuffer[receiver].push(data);
                    } else {
                        _localMessageBuffer[receiver] = [data];
                    }

                    //sendBufferTimer.resume();
                } else {
                    intent = encapsulateMessage(receiver, CONFIG.IWC.FLAG.PUBLISH_LOCAL, CONFIG.IWC.ACTION.DATA, data);
                    if (IWC.util.validateIntent(intent)) {

                        console.log("=== " + intent.flags.toString().replace(/PUBLISH_/g,"") + " INTENT TRANSMITTED AT COMPONENT " + componentName + " ===");
                        console.log(intent);

                        _iwc.publish(intent);
                    }
                }
            },
            /**
             * Send OTOperation locally to an other component
             * @memberof IWCOTWrapper
             * @param {string} receiver Component name of receiving component, empty string for broadcast
             * @param {operations.ot.OTOperation} operation Operation to send
             */
            sendLocalOTOperation:function(receiver,operation){
                this.sendLocalMessage(receiver,{
                    type: PAYLOAD_DATA_TYPE.OT_OPERATION,
                    data: operation.getOperationObject(),
                    sender: operation.getSender() || space.user[CONFIG.NS.PERSON.JABBERID]
                });
            },
            /**
             * Send NonOTOperation locally to an other component
             * @memberof IWCOTWrapper
             * @param {string} receiver Component name of receiving component, empty string for broadcast
             * @param {operations.non_ot.NonOTOperation} operation Operation to send
             */
            sendLocalNonOTOperation:function(receiver,operation){
                this.sendLocalMessage(receiver,{
                    type: PAYLOAD_DATA_TYPE.NON_OT_OPERATION,
                    data: operation.getOperationObject(),
                    sender: operation.getSender() || space.user[CONFIG.NS.PERSON.JABBERID]
                });
            },
            /**
             * Send data remotely to all remote users
             * @memberof IWCOTWrapper
             * @param {object} data Data to send
             */
            sendRemoteOTMessage: function(data){
                _remoteMessageBuffer.push({
                    type: PAYLOAD_DATA_TYPE.OT_OPERATION,
                    data: data,
                    sender: space.user[CONFIG.NS.PERSON.JABBERID]
                });
            },
            /**
             * Send NonOTOperation remotely to all remote users
             * @memberof IWCOTWrapper
             * @param {operations.ot.NonOTOperation} operation Operation to send
             */
            sendRemoteNonOTMessage: function(operation){
                _remoteMessageBuffer.push({
                    type: PAYLOAD_DATA_TYPE.NON_OT_OPERATION,
                    data: operation.getOperationObject(),
                    sender: space.user[CONFIG.NS.PERSON.JABBERID]
                });
            },
            /**
             * Send NonOTOperation remotely to all remote users
             * @memberof IWCOTWrapper
             * @param {operations.non_ot.NonOTOperation} operation Operation to send
             */
            sendRemoteNonOTOperation: sendRemoteNonOTOperation,
            /**
             * Register callback for remote data receive events
             * @memberof IWCOTWrapper
             * @param {function} callback
             */
            registerOnRemoteDataReceivedCallback: function(callback){
                if(typeof callback === "function"){
                    this.unregisterOnRemoteDataReceivedCallback(callback);
                    _onRemoteDataReceivedCallbacks.push(callback);
                }
            },
            /**
             * Unregister callback for remote data receive events
             * @memberof IWCOTWrapper
             * @param {function} callback
             */
            unregisterOnRemoteDataReceivedCallback: function(callback){
                var i, numOfCallbacks;

                if(typeof callback === "function"){
                    for(i = 0, numOfCallbacks = _onRemoteDataReceivedCallbacks.length; i < numOfCallbacks; i++){
                        if(callback === _onRemoteDataReceivedCallbacks[i]){
                            _onRemoteDataReceivedCallbacks.splice(i,1);
                        }
                    }
                }
            },
            /**
             * Register callback for local data receive events
             * @memberof IWCOTWrapper
             * @param {function} callback
             */
            registerOnLocalDataReceivedCallback: function(callback){
                if(typeof callback === "function"){
                    this.unregisterOnLocalDataReceivedCallback(callback);
                    _onLocalDataReceivedCallbacks.push(callback);
                }
            },
            /**
             * Unregister callback for local data receive events
             * @memberof IWCOTWrapper
             * @param {function} callback
             */
            unregisterOnLocalDataReceivedCallback: function(callback){
                var i, numOfCallbacks;

                if(typeof callback === "function"){
                    for(i = 0, numOfCallbacks = _onLocalDataReceivedCallbacks.length; i < numOfCallbacks; i++){
                        if(callback === _onLocalDataReceivedCallbacks[i]){
                            _onLocalDataReceivedCallbacks.splice(i,1);
                        }
                    }
                }
            },
            /**
             * Register callback for history (undo/redo) events
             * @memberof IWCOTWrapper
             * @param {function} callback
             */
            registerOnHistoryChangedCallback: function(callback){
                if(typeof callback === "function"){
                    this.unregisterOnHistoryChangedCallback(callback);
                    _onHistoryCallbacks.push(callback);
                }
            },
            /**
             * Unregister callback for history (undo/redo) events
             * @memberof IWCOTWrapper
             * @param {function} callback
             */
            unregisterOnHistoryChangedCallback: function(callback){
                var i, numOfCallbacks;

                if(typeof callback === "function"){
                    for(i = 0, numOfCallbacks = _onHistoryCallbacks.length; i < numOfCallbacks; i++){
                        if(callback === _onHistoryCallbacks[i]){
                            _onHistoryCallbacks.splice(i,1);
                        }
                    }
                }
            },
            /**
             * Register callback for join or leave events
             * @memberof IWCOTWrapper
             * @param {function} callback
             */
            registerOnJoinOrLeaveCallback: function(callback){
                if(typeof callback === "function"){
                    this.unregisterOnJoinOrLeaveCallback(callback);
                    _onJoinOrLeaveCallbacks.push(callback);
                }
            },
            /**
             * Unregister callback for join or leave events
             * @memberof IWCOTWrapper
             * @param {function} callback
             */
            unregisterOnJoinOrLeaveCallback: function(callback){
                var i, numOfCallbacks;

                if(typeof callback === "function"){
                    for(i = 0, numOfCallbacks = _onJoinOrLeaveCallbacks.length; i < numOfCallbacks; i++){
                        if(callback === _onJoinOrLeaveCallbacks[i]){
                            _onJoinOrLeaveCallbacks.splice(i,1);
                        }
                    }
                }
            },
            /**
             * Propagate an EntityOperation to the remote users
             * @memberof IWCOTWrapper
             * @param {operations.ot.EntityOperation} operation
             * @returns {boolean} if successful
             */
            sendRemoteOTOperation: function(operation){
                var otOperation;
                var toSend;
                if(_joiningUsers.length > 0){
                    _otOperationBuffer.push(operation);
                } else {
                    if(operation instanceof EntityOperation){
                        addToHistory(operation);
                        otOperation = operation.getOTOperation();
                        toSend = _ot.localEvent(otOperation.getOperationObject());
                        if(toSend){
                            if(operation instanceof ValueChangeOperation){
                                toSend.entityIdChain = operation.getEntityIdChain().join(":");
                            }
                            this.sendRemoteOTMessage(toSend);
                            return true;
                        }
                    }
                    return false;
                }
                return true;
            },
            /**
             * Undo last operation
             * @memberof IWCOTWrapper
             * @returns {operations.ot.EntityOperation} Undone operation
             */
            undo: function(){
                var operation, toSend, i, numOfCallbacks;

                if(_historyPosition !== -1){
                    operation = _history[_historyPosition--].inverse();
                    //noinspection JSAccessibilityCheck
                    toSend = _ot.localEvent(operation.getOTOperation().getOperationObject());
                    if(operation instanceof ValueChangeOperation){
                        toSend.entityIdChain = operation.getEntityIdChain().join(":");
                    }
                    this.sendRemoteOTMessage(toSend);
                    for(i = 0, numOfCallbacks = _onHistoryCallbacks.length; i < numOfCallbacks; i++){
                        if(typeof _onHistoryCallbacks[i] === 'function'){
                            _onHistoryCallbacks[i](operation,_history.length,_historyPosition);
                        }
                    }
                    return operation;
                }
                return null;
            },
            /**
             * Redo last undone operation
             * @memberof IWCOTWrapper
             * @returns {operations.ot.EntityOperation} Redone operation
             */
            redo: function(){
                var operation, toSend, i, numOfCallbacks;

                if(_historyPosition !== _history.length - 1){
                    operation = _history[++_historyPosition];
                    toSend = _ot.localEvent(operation.getOTOperation().getOperationObject());
                    if(operation instanceof ValueChangeOperation){
                        toSend.entityIdChain = operation.getEntityIdChain().join(":");
                    }
                    this.sendRemoteOTMessage(toSend);
                    for(i = 0, numOfCallbacks = _onHistoryCallbacks.length; i < numOfCallbacks; i++){
                        if(typeof _onHistoryCallbacks[i] === 'function'){
                            _onHistoryCallbacks[i](operation,_history.length,_historyPosition);
                        }

                    }
                    return operation;
                }
                return null;
            }
        };

    }

    /**
     * Instance of IWCOTWrapper
     * @type {IWCOTWrapper}
     */
    var instance = null;

    var instanceRequested = false;

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
     * @returns {IWCOTWrapper}
     */
    IWCOT.getInstance = function(componentName){
        if(instance === null){
            instanceRequested = true;
            instance = new IWCOTWrapper(componentName,space.user.globalId);
            instance.connect();
        }
        return instance;
    };

    return IWCOT;

});
