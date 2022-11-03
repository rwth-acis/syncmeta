import $ from "jquery-ui";
import _ from "lodash";
import IWCW from "../lib/IWCWrapper";
import AttributeDeleteOperation from "../operations/ot/AttributeDeleteOperation";
import AbstractAttribute from "./AbstractAttribute";
import Value from "./Value";
import SelectionValue from "./SelectionValue";
import loadHTML from "../html.template.loader";
const keySelectionValueSelectionValueAttributeHtml = await loadHTML(
  "../../../html/templates/attribute_widget/key_value_value_attribute.html",
  import.meta.url
);

KeySelectionValueSelectionValueAttribute.TYPE =
  "KeySelectionValueSelectionValueAttribute";

KeySelectionValueSelectionValueAttribute.prototype = new AbstractAttribute();
KeySelectionValueSelectionValueAttribute.prototype.constructor =
  KeySelectionValueSelectionValueAttribute;
/**
 * KeySelectionValueSelectionValueAttribute
 * @class attribute_widget.KeySelectionValueSelectionValueAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 * @param {Object} options2 Selection options
 * @constructor
 */
function KeySelectionValueSelectionValueAttribute(
  id,
  name,
  subjectEntity,
  options,
  options2
) {
  var that = this;

  AbstractAttribute.call(this, id, name, subjectEntity);

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
    id + "[key]",
    "Attribute Name",
    this,
    this.getRootSubjectEntity()
  );

  /***
   * Value object of value
   * @type {attribute_widget.Value}
   * @private
   */
  var _value = new SelectionValue(
    id + "[value]",
    "Attribute Type",
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
    id + "[value2]",
    "Attribute Position",
    this,
    this.getRootSubjectEntity(),
    _options2
  );

  /**
   * jQuery object of the DOM node representing the attribute
   * @type {jQuery}
   * @private
   */
  var _$node = $(
    _.template(keySelectionValueSelectionValueAttributeHtml)({ id: id })
  );

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
    //processAttributeDeleteOperation(operation);
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
    _key.setValueFromJSON(json.key);
    _value.setValueFromJSON(json.value);
    _value2.setValueFromJSON(json.value2 || { value: "" });
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

  _$node.find(".key").append(_key.get$node());
  _$node.find(".value").append(_value.get$node());
  _$node.find(".value2").append(_value2.get$node());
  _$node.find(".ui-icon-close").click(function () {
    var operation = new AttributeDeleteOperation(
      that.getEntityId(),
      that.getSubjectEntityId(),
      that.getRootSubjectEntity().getEntityId(),
      KeySelectionValueSelectionValueAttribute.TYPE
    );
    that.propagateAttributeDeleteOperation(operation);
  });

  if (_iwc) {
    that.registerCallbacks();
  }
}

export default KeySelectionValueSelectionValueAttribute;
