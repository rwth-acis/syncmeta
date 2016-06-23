    define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'iwcw',
    'attribute_widget/AbstractValue',
    'operations/ot/ValueChangeOperation',
    'text!templates/attribute_widget/code_edtior_value.html',
    'ace'
],/** @lends CodeEditorValue */function ($, jsPlumb, _, IWCW, AbstractValue, ValueChangeOperation, codeEditorValueHtml) {

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
    function CodeEditorValue(id, name, subjectEntity, rootSubjectEntity) {
        var that = this;

        var _ytext = null;

        AbstractValue.prototype.constructor.call(this, id, name, subjectEntity, rootSubjectEntity);

        /**
         * Value
         * @type {string}
         * @private
         */
        var _value = "";

        var editor = null;

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = $(codeEditorValueHtml);

        var bindAceEditor = function (ytext) {
            _ytext = ytext;
            ytext.bindAce(editor);
            initData(ytext, _value);

            _ytext.observe(function (event) {
                _value = event.object.toString();
                propagateValueChange(CONFIG.OPERATION.TYPE.INSERT, _value, 0);
            })
        }

        var createYText = function () {
            var deferred = $.Deferred();
            try {
                y.share.nodes.get(rootSubjectEntity.getEntityId()).then(function (ymap) {
                    var promise = ymap.get(subjectEntity.getEntityId());
                    if (promise) {
                        promise.then(function (ytext) {
                            bindAceEditor(ytext);
                            deferred.resolve();
                        });
                    }
                    else {
                        ymap.set(subjectEntity.getEntityId(), Y.Text).then(function (ytext) {
                            bindAceEditor(ytext);
                            deferred.resolve();
                        });
                    }


                });
            }
            catch (e) {
                deferred.reject();
            }
            return deferred.promise();
        };

        _$node.click(function () {
            if (editor) {
                $(editor.container).parent().show();
                $('#wrapper').hide();
            }
            else {
                $('#loading').show();

                var tpl = $('<div class="ace-container"><button id="undo"><img width="10px" height="10px" src="<%= grunt.config("baseUrl") %>/img/undo.png" /></button><div class="codeEditorValue" id="ace-' + rootSubjectEntity.getEntityId() + '"></div></div>');

                $('body').append(tpl);
                $('#wrapper').hide();

                tpl.find('button').click(function () {
                    $(editor.container).parent().hide();
                    $('#wrapper').show();

                });
                editor = ace.edit('ace-' + rootSubjectEntity.getEntityId());
                editor.setTheme("ace/theme/github");
                editor.getSession().setMode("ace/mode/svg");

                createYText().done(function () {
                    $('#loading').hide();
                }).fail(function () {
                    alert('Failed to create and bind code editor to yjs');
                });

            }

        });

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
        var propagateValueChangeOperation = function (operation) {
            //processValueChangeOperation(operation);
            iwc.sendLocalOTOperation(CONFIG.WIDGET.NAME.MAIN, operation.getOTOperation());
        };

        /**
         * Propagate a Value Change to the remote users and the local widgets
         * @param type Type of the update (CONFIG.OPERATION.TYPE.INSERT,DELETE)
         * @param value Char that was inserted or deleted
         * @param position Position the change took place
         */
        var propagateValueChange = function (type, value, position) {
            var operation = new ValueChangeOperation(that.getEntityId(), value, type, position);
            propagateValueChangeOperation(operation);

        };


        /**
         * Set value
         * @param {string} value
         */
        this.setValue = function (value) {
            _value = value;
            _$node.val(value);
        };

        /**
         * Get value
         * @returns {string}
         */
        this.getValue = function () {
            return _value;
        };

        /**
         * Get jQuery object of DOM node representing the value
         * @returns {jQuery}
         */
        this.get$node = function () {
            return _$node;
        };

        /**
         * Set value by its JSON representation
         * @param json
         */
        this.setValueFromJSON = function (json) {
            this.setValue(json.value);
        };

        /**
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function () {
            //iwc.registerOnDataReceivedCallback(bindYTextCallback);

        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function () {
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

        var initData = function (ytext, data) {
            if (data) {
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
        this.registerYType = function (ytext) {
            _ytext = ytext;
            _ytext.observe(function (event) {
                _value = event.object.toString();
                propagateValueChange(CONFIG.OPERATION.TYPE.INSERT, _value, 0);
            })
            initData(ytext);
        };

        this.getYText = function () {
            return _ytext;
        };

        if (iwc) {
            that.registerCallbacks();
        }
        //init();
    }

    return CodeEditorValue;

});