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
		'text!templates/attribute_widget/selection_value.html'
	], /** @lends SelectionValue */
	function ($, jsPlumb, _, IWCW, Util, AbstractValue, ValueChangeOperation, LogicalOperator, LogicalConjunctions,selectionValueHtml) {

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
		 */
		var processValueChangeOperation = function (operation, fromCallback) {
			that.setValue(operation.getValue());
			if (!fromCallback) {
				var EntityMangager = require('attribute_widget/EntityManager');
				var AttributeAddOperation = require('operations/ot/AttributeAddOperation');
				var AttributeDeleteOperation = require('operations/ot/AttributeDeleteOperation');
				var KeySelectionValueSelectionValueAttribute = require('attribute_widget/KeySelectionValueSelectionValueAttribute');
				var ConditionListAttribute = require('attribute_widget/view_types/attr_ConditionListAttribute');
				var ConditionPredicateAttribute = require('attribute_widget/view_types/attr_ConditionPredicateAttribute');

				if (node = EntityMangager.find(operation.getValue())) {
					var viewtype = that.getRootSubjectEntity();
					var viewtypeAttribute = viewtype.getAttributes()["[attributes]"];
					for (var key in viewtypeAttribute.getAttributes()) {
						if (viewtypeAttribute.getAttributes().hasOwnProperty(key)) {
							var attr = viewtypeAttribute.getAttributes()[key];
							var operation = new AttributeDeleteOperation(attr.getEntityId(), attr.getSubjectEntityId(), attr.getRootSubjectEntity().getEntityId(), KeySelectionValueSelectionValueAttribute.TYPE);
							attr.propagateAttributeDeleteOperation(operation);
						}
					}
					var attributeList = {};
					var targetAttributes = node.getAttributes()["[attributes]"].getAttributes();
					for (var key in targetAttributes) {
						if (targetAttributes.hasOwnProperty(key)) {
							var id = Util.generateRandomId();

							var operation = new AttributeAddOperation(id, viewtypeAttribute.getEntityId(), viewtypeAttribute.getRootSubjectEntity().getEntityId(), KeySelectionValueSelectionValueAttribute.TYPE);
							viewtypeAttribute.propagateAttributeAddOperation(operation);
							var attr = viewtypeAttribute.getAttribute(id);
							attr.getKey().propagateValueChange(CONFIG.OPERATION.TYPE.INSERT, targetAttributes[key].getKey().getValue(), 0);
							attr.getValue().propagateValueChange(CONFIG.OPERATION.TYPE.INSERT,targetAttributes[key].getValue().getValue(), 0);
                            if(viewtype.getType() === 'ViewRelationship')
                                attr.getValue2().propagateValueChange(CONFIG.OPERATION.TYPE.INSERT,targetAttributes[key].getValue2().getValue(), 0);

                            attributeList[id] = targetAttributes[key].getKey().getValue();
						}
					}
					
					if (condListAttr = viewtype.getAttribute('[condition]')) {
						condListAttr.setOptions(attributeList);
						for (var key in viewtype.getAttribute('[condition]').getAttributes()) {
							if (viewtype.getAttribute('[condition]').getAttributes().hasOwnProperty(key)) {
								var attr = viewtype.getAttribute('[condition]').getAttributes()[key];
								var operation = new AttributeDeleteOperation(attr.getEntityId(), attr.getSubjectEntityId(), attr.getRootSubjectEntity().getEntityId(), ConditionPredicateAttribute.TYPE);
								attr.propagateAttributeDeleteOperation(operation);
							}
						}
					} else {
						var condAttr = new ConditionListAttribute("[condition]", "Conditions", viewtype, attributeList, LogicalOperator, LogicalConjunctions);
						viewtype.addAttribute(condAttr);
						viewtype.get$node().find('.attributes').append(condAttr.get$node());
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
			propagateValueChangeOperation(operation);
		};
		/**
		 * Propagate a Value Change Operation to the remote users and the local widgets
		 * @param {operations.ot.ValueChangeOperation} operation
		 */
		var propagateValueChangeOperation = function (operation) {
			processValueChangeOperation(operation);
			_iwc.sendLocalOTOperation(CONFIG.WIDGET.NAME.MAIN, operation.getOTOperation());
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
