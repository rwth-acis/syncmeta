define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'iwcw',
    'canvas_widget/AbstractValue',
    'canvas_widget/AbstractAttribute',
    'operations/ot/ValueChangeOperation',
    'operations/non_ot/ActivityOperation',
    'operations/non_ot/BindYTextOperation',
    'text!templates/canvas_widget/multi_line_value.html'
],/** @lends MultiLineValue */function($,jsPlumb,_,IWCW,AbstractValue,AbstractAttribute,ValueChangeOperation,ActivityOperation,BindYTextOperation,multiLineValueHtml) {

    MultiLineValue.prototype = new AbstractValue();
    MultiLineValue.prototype.constructor = MultiLineValue;
    /**
     * MultiLineValue
     * @class canvas_widget.MultiLineValue
     * @extends canvas_widget.AbstractValue
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity identifier
     * @param {string} name Name of attribute
     * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {canvas_widget.AbstractNode|canvas_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
     */
    function MultiLineValue(id,name,subjectEntity,rootSubjectEntity){
        var that = this;

        var _ytext= null;

        AbstractValue.call(this,id,name,subjectEntity,rootSubjectEntity);

        /**
         * MultiLineValue
         * @type {string}
         * @private
         */
        var _value = "";

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(multiLineValueHtml,{value: _value}));

        /**
         * Inter widget communication wrapper
         * @type {Object}
         * @private
         */
        var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);

        /**
         * Get chain of entities the attribute is assigned to
         * @returns {string[]}
         */
        var getEntityIdChain = function(){
            var chain = [that.getEntityId()],
                entity = that;
            while(entity instanceof AbstractAttribute){
                chain.unshift(entity.getSubjectEntity().getEntityId());
                entity = entity.getSubjectEntity();
            }
            return chain;
        };

        /**
         * Calculate the new value resulting in the application of the passed Value Change Operation
         * @param {operations.ot.ValueChangeOperation} operation
         * @returns {string}
         */
        var calcNewValue = function(operation){
            if(operation.getType() === CONFIG.OPERATION.TYPE.INSERT) {
                return _value.substr(0,operation.getPosition()) + operation.getValue() + _value.substring(operation.getPosition());
            } else if(operation.getType() === CONFIG.OPERATION.TYPE.DELETE){
                return _value.substr(0,operation.getPosition()) + _value.substring(operation.getPosition()+1);
            }
            return "";
        };

        //noinspection JSUnusedLocalSymbols
        /**
         * Commit Value Change to value
         * @param {string} type Type of the update (CONFIG.OPERATION.TYPE.INSERT,DELETE)
         * @param {string} value The new value
         * @param {number} position Position where change took place
         * @param {boolean} remote Is the change issued by a remote user
         */
        var commitUpdate = function(type,value,position,remote){
            _$node.text(value.split("\n")[0]);
        };

        /**
         * Apply a Value Change Operation
         * @param {operations.ot.ValueChangeOperation} operation
         */
        var processValueChangeOperation = function(operation){
            _value = calcNewValue(operation);
            commitUpdate(operation.getType(),_value,operation.getPosition(),operation.getRemote());
        };

        /**
         * Propagate a Value Change Operation to the remote users and the local widgets
         * @param {operations.ot.ValueChangeOperation} operation
         */
        var propagateValueChangeOperation = function(operation){
            operation.setEntityIdChain(getEntityIdChain());
            operation.setRemote(false);
            processValueChangeOperation(operation);
            operation.setRemote(true);
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                "ValueChangeActivity",
                that.getEntityId(),
                _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
                ValueChangeOperation.getOperationDescription(that.getSubjectEntity().getName(),that.getRootSubjectEntity().getType(),that.getRootSubjectEntity().getLabel().getValue().getValue()),
                {
                    value: calcNewValue(operation),
                    subjectEntityName: that.getSubjectEntity().getName(),
                    rootSubjectEntityType: that.getRootSubjectEntity().getType(),
                    rootSubjectEntityId: that.getRootSubjectEntity().getEntityId()
                }
            ).toNonOTOperation());

            if(that.getRootSubjectEntity().getYMap()){
                that.getRootSubjectEntity().getYMap().set(that.getEntityId(),operation.toJSON());
            }
        };

        /**
         * Propagate a Value Change to the remote users and the local widgets
         * @param type Type of the update (CONFIG.OPERATION.TYPE.INSERT,DELETE)
         * @param value Char that was inserted or deleted
         * @param position Position the change took place
         */
        var propagateValueChange = function(type,value,position){
            var operation = new ValueChangeOperation(that.getEntityId(),value,type,position);
            propagateValueChangeOperation(operation);
            _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
        };

        /**
         * Callback for a remote Value Change Operation
         * @param {operations.ot.ValueChangeOperation} operation
         */
        var remoteValueChangeCallback = function(operation){
            if(operation instanceof ValueChangeOperation && operation.getEntityId() === that.getEntityId()){
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                    "ValueChangeActivity",
                    that.getEntityId(),
                    operation.getOTOperation().getSender(),
                    ValueChangeOperation.getOperationDescription(that.getSubjectEntity().getName(),that.getRootSubjectEntity().getType(),that.getRootSubjectEntity().getLabel().getValue().getValue()),
                    {
                        value: calcNewValue(operation),
                        subjectEntityName: that.getSubjectEntity().getName(),
                        rootSubjectEntityType: that.getRootSubjectEntity().getType(),
                        rootSubjectEntityId: that.getRootSubjectEntity().getEntityId()
                    }
                ).toNonOTOperation());
                processValueChangeOperation(operation);
            }
        };

        /**
         * Callback for a local Value Change Operation
         * @param {operations.ot.ValueChangeOperation} operation
         */
        var localValueChangeCallback = function(operation){
            if(operation instanceof ValueChangeOperation && operation.getEntityId() === that.getEntityId()){
                propagateValueChangeOperation(operation);
            }
        };

        /**
         * Callback for an undone resp. redone Value Change Operation
         * @param {operations.ot.ValueChangeOperation} operation
         */
        var historyValueChangeCallback = function(operation){
            if(operation instanceof ValueChangeOperation && operation.getEntityId() === that.getEntityId()){
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                processValueChangeOperation(operation);
            }
        };

        var init = function(){
            _$node.off();
            _$node.bind("input",function(){
                //noinspection UnnecessaryLocalVariableJS
                var oldValue = _value;
                var removedString, addedString, i, len;
                var newValue = _$node.val();
                var selectionStart = _$node[0].selectionStart;
                var left = 0;
                var suffixStart = -newValue.length+selectionStart;
                if(suffixStart<0){
                    oldValue = oldValue.slice(0,suffixStart);
                    newValue = newValue.slice(0,suffixStart);
                }
                while(newValue[left]===oldValue[left]&&left<selectionStart-1){
                    left+=1;
                }
                removedString = oldValue.slice(left,oldValue.length-(newValue.length-selectionStart));
                addedString = newValue.slice(left,selectionStart);
                if(addedString.length > 0 && removedString.length > 0 && addedString[0] === removedString[0]){
                    addedString = addedString.slice(1);
                    removedString = removedString.slice(1);
                    left+=1;
                }
                _$node.val(_value);
                _$node[0].selectionStart = left;
                _$node[0].selectionEnd = left;
                for(i = 0, len = removedString.length; i <len; i++){
                    propagateValueChange(CONFIG.OPERATION.TYPE.DELETE,removedString[i],left);
                }
                for(i = 0, len = addedString.length; i <len; i++){
                    propagateValueChange(CONFIG.OPERATION.TYPE.INSERT,addedString[i],left+i);
                }
            });
        };

        //noinspection JSUnusedLocalSymbols
        var init2 = function(){
            _$node.off();
            _$node.keypress(function (ev) {
                var selectionStart, selectionEnd;
                var character = String.fromCharCode(ev.which);
                var deletedChar;

                ev.preventDefault();
                ev.stopPropagation();
                selectionStart = this.selectionStart;
                selectionEnd = this.selectionEnd;
                if (character.length > 0) {
                    while(selectionStart < selectionEnd){
                        deletedChar = $(this).val()[selectionStart];
                        propagateValueChange(CONFIG.OPERATION.TYPE.DELETE,deletedChar,selectionStart);
                        selectionEnd--;
                    }
                    propagateValueChange(CONFIG.OPERATION.TYPE.INSERT,character,selectionStart);
                }
            }).keydown(function(ev){
                if (ev.which === $.ui.keyCode.BACKSPACE || ev.which === $.ui.keyCode.DELETE) {
                    var selectionStart, selectionEnd;
                    var deletedChar;

                    ev.preventDefault();
                    ev.stopPropagation();
                    selectionStart = this.selectionStart;
                    selectionEnd = this.selectionEnd;
                    if(selectionStart == selectionEnd){
                        if (ev.which === $.ui.keyCode.BACKSPACE) {
                            deletedChar = $(this).val()[selectionStart-1];
                            propagateValueChange(CONFIG.OPERATION.TYPE.DELETE,deletedChar,selectionStart-1);
                        } else if (ev.which === $.ui.keyCode.DELETE) {
                            deletedChar = $(this).val()[selectionStart];
                            propagateValueChange(CONFIG.OPERATION.TYPE.DELETE,deletedChar,selectionStart);
                        }
                    } else {
                        while(selectionStart < selectionEnd){
                            deletedChar = $(this).val()[selectionStart];
                            propagateValueChange(CONFIG.OPERATION.TYPE.DELETE,deletedChar,selectionStart);
                            selectionEnd--;
                        }
                    }
                }
            });

        };

        /**
         * Set value
         * @param {string} value
         */
        this.setValue = function(value){
            _value = value;
            _$node.val(value);
        };

        /**
         * Get value
         * @returns {string}
         */
        this.getValue = function(){
            return _value;
        };

        /**
         * Get jQuery object of DOM node representing the value
         * @returns {jQuery}
         */
        this.get$node = function(){
            return _$node;
        };

        /**
         * Get JSON representation of the edge
         * @returns {Object}
         */
        this.toJSON = function(){
            var json = AbstractValue.prototype.toJSON.call(this);
            json.value = _value;
            return json;
        };

        /**
         * Set value by its JSON representation
         * @param json
         */
        this.setValueFromJSON = function(json){
            this.setValue(json.value);
        };

        /**
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function(){
            _iwcw.registerOnDataReceivedCallback(localValueChangeCallback);
            //_iwcw.registerOnHistoryChangedCallback(historyValueChangeCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function(){
            _iwcw.unregisterOnDataReceivedCallback(localValueChangeCallback);
            //_iwcw.unregisterOnHistoryChangedCallback(historyValueChangeCallback);
        };

        this.registerYType = function(ytext){
            _ytext= ytext;
            _ytext.bind(_$node[0]);

            if(that.getValue() !== _ytext.toString()){
                if(_ytext.toString().length > 0)
                    _ytext.delete(0, _ytext.toString().length);
                _ytext.insert(0, that.getValue());
            }
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, new BindYTextOperation(that.getEntityId()).toNonOTOperation());

            _ytext.observe(function(events){
                for(var i in events){
                    var event = events[i];
                    //TODO i can not find out who triggered the delete :(
                    //var jabberId = y.share.users.get(JSON.parse(event.object.idArray[event.index])[0]);

                    //No longer needed. the attribute widgets has his own Yjs instance
                    //var operation = new ValueChangeOperation(that.getEntityId(), event.value, event.type, event.index);
                    //_iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.getOTOperation());


                    _value = _ytext.toString();
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, new ActivityOperation(
                        "ValueChangeActivity",
                        that.getEntityId(),
                        //TODO
                        null,
                        ValueChangeOperation.getOperationDescription(that.getSubjectEntity().getName(), that.getRootSubjectEntity().getType(), that.getRootSubjectEntity().getLabel().getValue().getValue()),
                        {
                            value: '',
                            subjectEntityName: that.getSubjectEntity().getName(),
                            rootSubjectEntityType: that.getRootSubjectEntity().getType(),
                            rootSubjectEntityId: that.getRootSubjectEntity().getEntityId()
                        }
                    ).toNonOTOperation());
                }
            });
        };


        init();

        if(_iwcw){
            that.registerCallbacks();
        }

    }

    return MultiLineValue;

});