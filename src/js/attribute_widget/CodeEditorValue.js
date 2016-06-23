define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'iwcw',
    'attribute_widget/AbstractValue',
    'operations/ot/ValueChangeOperation',
    'operations/non_ot/BindYTextOperation',
    'text!templates/attribute_widget/code_editor_value.html'
],/** @lends CodeEditorValue */function($,jsPlumb,_,IWCW,AbstractValue,ValueChangeOperation,BindYTextOperation,codeEditorValueHtml) {

    CodeEditorValue.prototype = new AbstractValue();
    CodeEditorValue.prototype.constructor = CodeEditorValue;
    /**
     * CodeEditorValue
     * @class attribute_widget.CodeEditorValue
     * @extends attribute_widget.AbstractValue
     * @memberof attribute_widget
     * @constructor
     * @param {string} id Entity identifier
     * @param {string} name Name of attribute
     * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {attribute_widget.AbstractNode|attribute_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
     */
    function CodeEditorValue(id,name,subjectEntity,rootSubjectEntity){
        var that = this;

        var _ytext = null;

        AbstractValue.prototype.constructor.call(this,id,name,subjectEntity,rootSubjectEntity);

        /**
         * Value
         * @type {string}
         * @private
         */
        var _value = "";

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(codeEditorValueHtml,{name: name}));

        /**
         * Inter widget communication wrapper
         * @type {Object}
         * @private
         */
        var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);



        /**
         * Propagate a Value Change Operation to the remote users and the local widgets
         * @param {operations.ot.ValueChangeOperation} operation

         */
        var propagateValueChangeOperation = function(operation){
            //processValueChangeOperation(operation);
            iwc.sendLocalOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.getOTOperation());
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
            if(iwc){
                that.registerCallbacks();
            }
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
            //iwc.registerOnDataReceivedCallback(bindYTextCallback);

        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function(){
            //iwc.unregisterOnDataReceivedCallback(bindYTextCallback);

        };

        function bindYTextCallback(operation) {
            if (operation instanceof BindYTextOperation && operation.getEntityId() === that.getEntityId()) {
                setTimeout(function () {
                    var entityId = that.getRootSubjectEntity().getEntityId();
                    if (y.share.nodes.opContents.hasOwnProperty(entityId)) {
                        y.share.nodes.get(entityId).then(function (ymap) {
                            ymap.get(operation.getEntityId()).then(function (ytext) {
                                ytext.bind(_$node[0]);

                                if (that.getValue() !== ytext.toString()) {
                                    if (ytext.toString().length > 0)
                                        ytext.delete(0, ytext.toString().length);
                                    ytext.insert(0, that.getValue());
                                }

                            })
                        })
                    }
                    else if (y.share.edges.opContents.hasOwnProperty(entityId)) {
                        y.share.edges.get(entityId).then(function (ymap) {
                            ymap.get(operation.getEntityId()).then(function (ytext) {
                                ytext.bind(_$node[0]);

                                if (that.getValue() !== ytext.toString()) {
                                    if (ytext.toString().length > 0)
                                        ytext.delete(0, ytext.toString().length);
                                    ytext.insert(0, that.getValue());
                                }

                            })
                        })
                    }
                }, 300);
            }
        }

        var initData = function(ytext, data){
            if(data){
                if (data !== ytext.toString()) {
                    if (ytext.toString().length > 0)
                        ytext.delete(0, ytext.toString().length);
                    ytext.insert(0, data);
                }
            }
            else {
                if (that.getValue() !== ytext.toString()) {
                    if (ytext.toString().length > 0)
                        ytext.delete(0, ytext.toString().length);
                    ytext.insert(0, that.getValue());
                }
            }
        };
        this.registerYType = function(ytext){
            _ytext = ytext;
            _ytext.bind(_$node[0]);
            initData(ytext);
        };

        this.getYText = function(){
            return _ytext;
        };

        if(iwc){
            that.registerCallbacks();
        }
        //init();
    }

    return CodeEditorValue;

});