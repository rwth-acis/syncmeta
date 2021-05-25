define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'iwcw',
    'canvas_widget/AbstractValue',
    'canvas_widget/AbstractAttribute',
    'canvas_widget/viewpoint/ViewTypesUtil',
    'canvas_widget/QuizAttribute',
    'operations/ot/ValueChangeOperation',
    'operations/non_ot/ActivityOperation',
    'text!templates/canvas_widget/selection_value.html',
    'text!templates/attribute_widget/selection_value.html'
], /** @lends SelectionValue */
    function($, jsPlumb, _, IWCW, AbstractValue, AbstractAttribute, ViewTypesUtil, QuizAttribute, ValueChangeOperation, ActivityOperation, selectionValueHtml, attributeSelectionValueHtml) {

        SelectionValue.prototype = new AbstractValue();
        SelectionValue.prototype.constructor = SelectionValue;
        /**
         * SelectionValue
         * @class canvas_widget.SelectionValue
         * @extends canvas_widget.AbstractValue
         * @memberof canvas_widget
         * @constructor
         * @param {string} id Entity identifier
         * @param {string} name Name of attribute
         * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
         * @param {canvas_widget.AbstractNode|canvas_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
         * @param {Object} options Selection options
         */
        function SelectionValue(id, name, subjectEntity, rootSubjectEntity, options, useAttributeHtml) {
            var that = this;

            useAttributeHtml = typeof useAttributeHtml !== 'undefinded' ? useAttributeHtml : false;

            AbstractValue.call(this, id, name, subjectEntity, rootSubjectEntity);

            /**
             * Value
             * @type {string}
             * @private
             */
            var _value = _.keys(options)[0];

            if (useAttributeHtml) {
                selectionValueHtml = attributeSelectionValueHtml;
            }

            /**
             * jQuery object of DOM node representing the node
             * @type {jQuery}
             * @private
             */
            var _$node = $(_.template(selectionValueHtml)({
                name: name,
                options: options
            }));

            if (useAttributeHtml) {
                _$node.off();
            }

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
            var getEntityIdChain = function() {
                var chain = [that.getEntityId()],
                    entity = that;
                while (entity instanceof AbstractAttribute) {
                    chain.unshift(entity.getSubjectEntity().getEntityId());
                    entity = entity.getSubjectEntity();
                }
                return chain;
            };

            /**
             * Apply a Value Change Operation
             * @param {operations.ot.ValueChangeOperation} operation
             */
            var processValueChangeOperation = function(operation) {
                that.setValue(operation.getValue());
            };

            /**
             * Set value
             * @param {string} value
             */
            this.setValue = function(value) {
                _value = value;
                if (useAttributeHtml) {
                    _$node.val(value);
                    if(value == "Quiz"){
                        Object.values(rootSubjectEntity.getAttributes()).forEach((value) => {if(value instanceof QuizAttribute){value.showTable();}})
                    } else  Object.values(rootSubjectEntity.getAttributes()).forEach((value) => {if(value instanceof QuizAttribute){value.hideTable();}})

                }
                else
                    _$node.text(options[value]);


            };

            /**
             * Get value
             * @returns {string}
             */
            this.getValue = function() {
                return _value;
            };

            /**
             * Get jQuery object of DOM node representing the value
             * @returns {jQuery}
             */
            this.get$node = function() {
                return _$node;
            };

            /**
             * Get JSON representation of the edge
             * @returns {Object}
             */
            this.toJSON = function() {
                var json = AbstractValue.prototype.toJSON.call(this);
                json.value = _value;
                return json;
            };

            /**
             * Set value by its JSON representation
             * @param json
             */
            this.setValueFromJSON = function(json) {
                this.setValue(json.value);
            };


            this.registerYType = function () {
                //observer
                that.getRootSubjectEntity().getYMap().observePath([that.getEntityId()], function (event) {
                    if (event) {
                        var operation = new ValueChangeOperation(event.entityId, event.value, event.type, event.position, event.jabberId);
                        _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.GUIDANCE, operation.getOTOperation());
                        processValueChangeOperation(operation);

                        //Only the local user Propagates the activity and saves the state of the model
                        if (_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] === operation.getJabberId()) {
                            y.share.activity.set(ActivityOperation.TYPE, new ActivityOperation(
                                "ValueChangeActivity",
                                that.getEntityId(),
                                _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
                                ValueChangeOperation.getOperationDescription(that.getSubjectEntity().getName(), that.getRootSubjectEntity().getType(), that.getRootSubjectEntity().getLabel().getValue().getValue()), {
                                    value: operation.getValue(),
                                    subjectEntityName: that.getSubjectEntity().getName(),
                                    rootSubjectEntityType: that.getRootSubjectEntity().getType(),
                                    rootSubjectEntityId: that.getRootSubjectEntity().getEntityId()
                                }));

                            //its a view type and create a reference to the origin
                            if (event.entityId.indexOf('[target]') != -1) {
                                ViewTypesUtil.createReferenceToOrigin(that.getRootSubjectEntity());
                                //CVG
                                require(['canvas_widget/viewpoint/ClosedViewGeneration'], function(CVG){
                                    CVG(rootSubjectEntity);
                                });
                            }
                            //trigger the save 
                            $('#save').click();
                        
                        }
                        else {
                            //the remote users propagtes the change to their local attribute widget
                            //TODO(PENDING): can be replaced with yjs as well
                            _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.getOTOperation());
                        }
                    }
                });
            }
        }

        return SelectionValue;

    });
