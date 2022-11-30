import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import IWCW from "../../lib/IWCWrapper";

import AbstractAttribute from "../AbstractAttribute";
import Value from "../Value";
import SelectionValue from "../SelectionValue";
import loadHTML from "../../html.template.loader";
import { AttributeDeleteOperation } from "../../operations/ot/EntityOperation";
const condition_predicateHtml = await loadHTML(
  "../../../templates/attribute_widget/condition_predicate.html",
  import.meta.url
);

/**
 * ConditionPredicateAttribute
 * @class attribute_widget.ConditionPredicateAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 * @param {Object} options2 Selection options
 * @constructor
 */
class ConditionPredicateAttribute extends AbstractAttribute {
  static TYPE = "ConditionPredicateAttribute";
  constructor(id, name, subjectEntity, options, options2) {
    super(id, name, subjectEntity);
    var that = this;

    //noinspection UnnecessaryLocalVariableJS
    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options = options;

    //noinspection UnnecessaryLocalVariableJS
    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options2 = options2;

    /**
     * Value object of key
     * @type {attribute_widget.Value}
     * @private
     */
    var _key = new Value(
      id + "[value]",
      "Attribute Value",
      this,
      this.getRootSubjectEntity()
    );

    /***
     * Value object of value
     * @type {attribute_widget.Value}
     * @private
     */
    var _value = new SelectionValue(
      id + "[property]",
      "Attribute Name",
      this,
      this.getRootSubjectEntity(),
      _options
    );

    /***
     * Value object of value
     * @type {attribute_widget.Value}
     * @private
     */
    var _value2 = new SelectionValue(
      id + "[operator]",
      "Logical Operator",
      this,
      this.getRootSubjectEntity(),
      _options2
    );

    //var _value3 = new SelectionValue(id+"[operator2]", "Logical Operator", this, this.getRootSubjectEntity(), _options3);
    /**
     * jQuery object of the DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(condition_predicateHtml)());

    /**
     * Inter widget communication wrapper
     * @type {Object}
     * @private
     */
    var _iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

    /**
     * Propagate an Attribute Delete Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    this.propagateAttributeDeleteOperation = function (operation) {
      processAttributeDeleteOperation(operation);
      _iwc.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.MAIN,
        operation.getOTOperation()
      );
    };

    /**
     * Apply an Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var processAttributeDeleteOperation = function (operation) {
      subjectEntity.deleteAttribute(operation.getEntityId());
      that.get$node().remove();
    };

    /**
     * Callback for an Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var attributeDeleteCallback = function (operation) {
      if (
        operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        processAttributeDeleteOperation(operation);
      }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set Value object of key
     * @param {attribute_widget.Value} key
     */
    this.setKey = function (key) {
      _key = key;
    };

    /**
     * Get Value object of key
     * @returns {attribute_widget.Value}
     */
    this.getKey = function () {
      return _key;
    };

    /**
     * Set Value object of value
     * @param {attribute_widget.Value} value
     */
    this.setValue = function (value) {
      _value = value;
    };

    /**
     * Get Value object of value
     * @returns {attribute_widget.Value}
     */
    this.getValue = function () {
      return _value;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set Value object of value
     * @param {attribute_widget.Value} value
     */
    this.setValue2 = function (value) {
      _value2 = value;
    };

    /**
     * Get Value object of value
     * @returns {attribute_widget.Value}
     */
    this.getValue2 = function () {
      return _value2;
    };

    /**
     * Get jQuery object of the DOM node representing the attribute
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Set value of key and value by their JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _key.setValueFromJSON(json.val);
      _value.setValueFromJSON(json.property);
      _value2.setValueFromJSON(json.operator || { value: "" });
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      _iwc.registerOnDataReceivedCallback(attributeDeleteCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      _iwc.unregisterOnDataReceivedCallback(attributeDeleteCallback);
    };

    _$node.find(".val").append(_key.get$node());
    _$node.find(".property").append(_value.get$node());
    _$node.find(".operator").append(_value2.get$node());
    _$node.find(".ui-icon-close").click(function () {
      var operation = new AttributeDeleteOperation(
        that.getEntityId(),
        that.getSubjectEntityId(),
        that.getRootSubjectEntity().getEntityId(),
        ConditionPredicateAttribute.TYPE
      );
      that.propagateAttributeDeleteOperation(operation);
    });

    if (_iwc) {
      that.registerCallbacks();
    }
  }
}

export default ConditionPredicateAttribute;
