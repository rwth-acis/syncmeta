import $ from 'jqueryui';
import jsPlumb from 'jsplumb';
import _ from 'lodash';
import IWCW from 'iwcw';
import Util from 'Util';
import AbstractValue from 'attribute_widget/AbstractValue';
import ValueChangeOperation from 'operations/ot/ValueChangeOperation';
import QuizAttribute from 'attribute_widget/QuizAttribute';
import selectionValueHtml from 'text!templates/attribute_widget/selection_value.html';

        SelectionValue.prototype = new AbstractValue();
        SelectionValue.prototype.constructor = SelectionValue;
        /**
         * SelectionValue
         * @class attribute_widget.SelectionValue
         * @extends attribute_widget.AbstractValue
         * @memberof attribute_widget
         * @param {string} id Entity identifier
         * @param {string} name Name of attribute
         * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
         * @param {attribute_widget.AbstractNode|attribute_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
         * @param {Object} options Selection options
         * @constructor
         */
        function SelectionValue(id, name, subjectEntity, rootSubjectEntity, options) {
            var that = this;

            AbstractValue.prototype.constructor.call(this, id, name, subjectEntity, rootSubjectEntity);

            /**
             * Value
             * @type {string}
             * @private
             */
            var _value = _.keys(options)[0];

            /**
             * jQuery object of DOM node representing the node
             * @type {jQuery}
             * @private
             */
            var _$node = $(_.template(selectionValueHtml)({
                name: name,
                options: options
            }));

            /**
             * Inter widget communication wrapper
             * @type {Object}
             * @private
             */
            var _iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

            /**
             * Apply a Value Change Operation
             * @param {operations.ot.ValueChangeOperation} operation
             * @param {bool} fromCallback determines if the method is called from the callback or not
             */
            var processValueChangeOperation = function (operation, fromCallback) {
                that.setValue(operation.getValue());
            };

            /**
             * Propagate a Value Change to the remote users and the local widgets
             * @param type Type of the update (CONFIG.OPERATION.TYPE.INSERT,DELETE)
             * @param value Char that was inserted or deleted
             * @param position Position the change took place
             */
            this.propagateValueChange = function (type, value, position) {
                var operation = new ValueChangeOperation(that.getEntityId(), value, type, position, _iwc.getUser()[CONFIG.NS.PERSON.JABBERID]);
                propagateValueChangeOperation(operation);

            };

            /**
             * Propagate a Value Change Operation to the remote users and the local widgets
             * @param {operations.ot.ValueChangeOperation} operation
             */
            var propagateValueChangeOperation = function (operation) {
                processValueChangeOperation(operation);
                const nodesMap = y.getMap("nodes");
                var ymap = nodesMap.get(rootSubjectEntity.getEntityId());
                if (ymap) {
                    ymap.set(that.getEntityId(), operation.toJSON());
                }
            };

            /**
             * Callback for a Value Change Operation
             * @param {operations.ot.ValueChangeOperation} operation
             */
            var valueChangeCallback = function (operation) {
                if (operation instanceof ValueChangeOperation && operation.getEntityId() === that.getEntityId()) {
                    processValueChangeOperation(operation);
                }
            };

            var init = function () {
                _$node.off();
                _$node.change(function () {
                    that.propagateValueChange(CONFIG.OPERATION.TYPE.UPDATE, $(this).val(), 0);
                });
            };

            /**
             * Set value
             * @param {string} value
             */
            this.setValue = function (value) {
                if(name == "Content Type"){
                    if(value == "Quiz" ){
                        Object.values(rootSubjectEntity.getAttributes()).forEach((value) => {if(value instanceof QuizAttribute){value.showTable();}})
                    } else  Object.values(rootSubjectEntity.getAttributes()).forEach((value) => {if(value instanceof QuizAttribute){value.hideTable();}})
                }
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
             * Register inter widget communication callbacks
             */
            this.registerCallbacks = function () {
                _iwc.registerOnDataReceivedCallback(valueChangeCallback);
            };

            /**
             * Unregister inter widget communication callbacks
             */
            this.unregisterCallbacks = function () {
                _iwc.unregisterOnDataReceivedCallback(valueChangeCallback);
            };

            this.setValueFromJSON = function (json) {
                this.setValue(json.value);
            };
            init();

            if (_iwc) {
                that.registerCallbacks();
            }
        }

        export default SelectionValue;

    
