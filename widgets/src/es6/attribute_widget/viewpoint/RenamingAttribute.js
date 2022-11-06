import { CONFIG } from "../../config";
import "jquery";
import "jquery-ui";
import _ from "lodash-es";
import IWCW from "../../lib/IWCWrapper";
import AttributeDeleteOperation from "../../operations/ot/AttributeDeleteOperation";
import AbstractAttribute from "../AbstractAttribute";
import Value from "../Value";
import SelectionValue from "../SelectionValue";
import loadHTML from "../../html.template.loader";
const renamingAttrHTML = await loadHTML(
  "../../../html/templates/attribute_widget/renaming_attribute.html",
  import.meta.url
);

RenamingAttribute.TYPE = "RenamingAttribute";

RenamingAttribute.prototype = new AbstractAttribute();
RenamingAttribute.prototype.constructor = RenamingAttribute;
/**
 * RenamingAttribute
 * @class attribute_widget.ConditionPredicateAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 * @constructor
 */
function RenamingAttribute(id, name, subjectEntity, options) {
  var that = this;

  AbstractAttribute.call(this, id, name, subjectEntity);

  //noinspection UnnecessaryLocalVariableJS
  /**
   * Selection options
   * @type {Object}
   * @private
   */
  var _options = options;

  /**
   * Value object of key
   * @type {attribute_widget.Value}
   * @private
   */
  var _key = new Value(
    id + "[val]",
    "Attribute Name",
    this,
    this.getRootSubjectEntity()
  );

  /***
   * Value object of ref
   * @type {attribute_widget.Value}
   * @private
   */
  var _ref = new Value(
    id + "[ref]",
    "Attribute Reference",
    this,
    this.getRootSubjectEntity()
  );

  /***
   * Value object of vis
   * @type {attribute_widget.Value}
   * @private
   */
  var _vis = new SelectionValue(
    id + "[vis]",
    "Attribute Visibility",
    this,
    this.getRootSubjectEntity(),
    _options
  );

  /**
   * jQuery object of the DOM node representing the attribute
   * @type {jQuery}
   * @private
   */
  var _$node = $(_.template(renamingAttrHTML)());

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
   * Get Value object of value
   * @returns {attribute_widget.Value}
   */
  this.getRef = function () {
    return _ref;
  };

  //noinspection JSUnusedGlobalSymbols
  /**
   * Set Value object of value
   * @param {attribute_widget.Value} value
   */
  this.setVisibility = function (value) {
    _vis = value;
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
    _ref.setValueFromJSON(json.ref);
    _vis.setValueFromJSON(json.vis || { value: "" });
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
  _$node.find(".ref").append(_ref.get$node());
  _$node.find(".vis").append(_vis.get$node());

  _$node.find(".ref").find("input").prop("disabled", true);

  if (_iwc) {
    that.registerCallbacks();
  }
}

export default RenamingAttribute;
