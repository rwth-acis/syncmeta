define([
		'jqueryui',
		'jsplumb',
		'lodash',
		'iwcw',
		'Util',
		'attribute_widget/AbstractValue',
		'operations/ot/ValueChangeOperation',
		'viewcanvas_widget/LogicalOperator',
		'viewcanvas_widget/LogicalConjunctions',
        'attribute_widget/ClosedViewGeneration',
		'text!templates/attribute_widget/selection_value.html'
	], /** @lends SelectionValue */
	function ($, jsPlumb, _, IWCW, Util, AbstractValue, ValueChangeOperation, LogicalOperator, LogicalConjunctions, CVG,selectionValueHtml) {

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
		var _$node = $(_.template(selectionValueHtml, {
					name : name,
					options : options
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
			if (operation.getEntityId() === that.getRootSubjectEntity().getEntityId()+'[target]') {
				var EntityManager = require('attribute_widget/EntityManager');
                var DeleteCvgOperation = require('operations/non_ot/DeleteCvgOperation');
                var PerformCvgOperation = require('operations/non_ot/PerformCvgOperation');
				var AttributeAddOperation = require('operations/ot/AttributeAddOperation');
				var AttributeDeleteOperation = require('operations/ot/AttributeDeleteOperation');
				var KeySelectionValueSelectionValueAttribute = require('attribute_widget/KeySelectionValueSelectionValueAttribute');
				var ConditionListAttribute = require('attribute_widget/ConditionListAttribute');
                var ConditionPredicateAttribute = require('attribute_widget/ConditionPredicateAttribute');

                var viewType = that.getRootSubjectEntity();
                var deleteCvgOp = null;
                if(operation.getValue() === 'empty'){
                    EntityManager.deleteFromMap(viewType.getViewId(), viewType.getEntityId());
                    deleteCvgOp = new DeleteCvgOperation(_(viewType.getNeighbors()).keys().value());
                    _iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.VIEWCANVAS, deleteCvgOp.toNonOTOperation());
                    return;
                }
                var  node = EntityManager.find(operation.getValue());
                var op = null;
                var attr = null;
                if (node) {
                    _iwc.enableBuffer();
                    _iwc.setBufferedMessagesReceiver(CONFIG.WIDGET.NAME.VIEWCANVAS);
                    var viewTypeAttribute = viewType.getAttributes()["[attributes]"];
                    var viewTypeAttrList = viewTypeAttribute.getAttributes();
                    var attributeList = null;

                    if (!fromCallback) {
                        //delete the old all attributes of the old target
                        for (var key1 in viewTypeAttrList) {
                            if (viewTypeAttrList.hasOwnProperty(key1)) {
                                attr = viewTypeAttrList[key1];
                                op = new AttributeDeleteOperation(attr.getEntityId(), attr.getSubjectEntityId(), attr.getRootSubjectEntity().getEntityId(), KeySelectionValueSelectionValueAttribute.TYPE);
                                attr.propagateAttributeDeleteOperation(op, CONFIG.WIDGET.NAME.VIEWCANVAS);
                            }
                        }


                        attributeList = {};
                        //the attributes of the new target
                        var targetAttributes = node.getAttributes()["[attributes]"].getAttributes();
                        //crate the attributes of the new target
                        for (var key2 in targetAttributes) {
                            if (targetAttributes.hasOwnProperty(key2)) {
                                var id = Util.generateRandomId();

                                op = new AttributeAddOperation(id, viewTypeAttribute.getEntityId(), viewTypeAttribute.getRootSubjectEntity().getEntityId(), KeySelectionValueSelectionValueAttribute.TYPE);

                                viewTypeAttribute.propagateAttributeAddOperation(op, CONFIG.WIDGET.NAME.VIEWCANVAS);
                                attr = viewTypeAttribute.getAttribute(id);
                                attr.getKey().propagateValueChange(CONFIG.OPERATION.TYPE.INSERT, targetAttributes[key2].getKey().getValue(), 0);
                                attr.getValue().propagateValueChange(CONFIG.OPERATION.TYPE.INSERT, targetAttributes[key2].getValue().getValue(), 0);
                                if (viewType.getType() === 'ViewRelationship')
                                    attr.getValue2().propagateValueChange(CONFIG.OPERATION.TYPE.INSERT, targetAttributes[key2].getValue2().getValue(), 0);

                                attributeList[id] = targetAttributes[key2].getKey().getValue();
                            }
                        }
                    }
                    //if from callback is true, attributeList is null. Initialize it
                    if(!attributeList){
                        attributeList = {};
                        for(var k in viewTypeAttrList){
                            if(viewTypeAttrList.hasOwnProperty(k)){
                                attributeList[k] = viewTypeAttrList[k].getKey().getValue();
                            }
                        }
                    }
                    if (condListAttr = viewType.getAttribute('[condition]')) {
                        condListAttr.setOptions(attributeList);
                        var attrList = condListAttr.getAttributes();
                        for (var key3 in attrList) {
                            if (attrList.hasOwnProperty(key3)) {
                                attr = attrList[key3];
                                op = new AttributeDeleteOperation(attr.getEntityId(), attr.getSubjectEntityId(), attr.getRootSubjectEntity().getEntityId(), ConditionPredicateAttribute.TYPE);
                                attr.propagateAttributeDeleteOperation(op, CONFIG.WIDGET.NAME.VIEWCANVAS);
                            }
                        }
                    } else {
                        var condAttr = new ConditionListAttribute("[condition]", "Conditions", viewType, attributeList, LogicalOperator, LogicalConjunctions);
                        viewType.addAttribute(condAttr);
                        viewType.get$node().find('.attributes').append(condAttr.get$node());
                    }

                    if(!fromCallback) {
                        EntityManager.deleteFromMap(viewType.getViewId(), viewType.getEntityId());
                        EntityManager.addToMap(viewType.getViewId(), node.getEntityId(), viewType.getEntityId());
                        deleteCvgOp = new DeleteCvgOperation(_(viewType.getNeighbors()).keys().value());
                        _iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.VIEWCANVAS, deleteCvgOp.toNonOTOperation());
                        var res = CVG(node, that.getRootSubjectEntity());
                        var performCvgOp = new PerformCvgOperation(res);
                        _iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.VIEWCANVAS, performCvgOp.toNonOTOperation());
                    }
                    else{
                        EntityManager.addToMap(viewType.getViewId(), node.getEntityId(), viewType.getEntityId());
                    }


                }
            }
        };

        /**
         * Propagate a Value Change to the remote users and the local widgets
         * @param type Type of the update (CONFIG.OPERATION.TYPE.INSERT,DELETE)
         * @param value Char that was inserted or deleted
         * @param position Position the change took place
         */
        this.propagateValueChange = function (type, value, position) {
            var operation = new ValueChangeOperation(that.getEntityId(), value, type, position);
            if(that.getRootSubjectEntity().getViewId()) {
                _iwc.setBufferedMessagesReceiver(CONFIG.WIDGET.NAME.VIEWCANVAS);
                propagateValueChangeOperation(operation, CONFIG.WIDGET.NAME.VIEWCANVAS);
            }
            else {
                _iwc.resetBufferedMessagesReceiver();
                propagateValueChangeOperation(operation, CONFIG.WIDGET.NAME.MAIN);

            }
        };

        /**
         * Propagate a Value Change Operation to the remote users and the local widgets
         * @param {operations.ot.ValueChangeOperation} operation
         * @param {string} component the receiver
         */
        var propagateValueChangeOperation = function (operation, component) {
            processValueChangeOperation(operation);
            _iwc.sendLocalOTOperation(component, operation.getOTOperation());
        };

        /**
         * Callback for a Value Change Operation
         * @param {operations.ot.ValueChangeOperation} operation
         */
        var valueChangeCallback = function (operation) {
            if (operation instanceof ValueChangeOperation && operation.getEntityId() === that.getEntityId()) {
                processValueChangeOperation(operation, true);
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

    return SelectionValue;

});
