import { CONFIG } from "../config";
import "jquery";
import "jquery-ui";
import _ from "lodash-es";
import IWCW from "../lib/IWCWrapper";

import AbstractAttribute from "./AbstractAttribute";
import Value from "./Value";
import loadHTML from "../html.template.loader";
import { AttributeDeleteOperation } from "../operations/ot/EntityOperation";
const listSingleValueAttributeHtml = await loadHTML(
  "../../templates/attribute_widget/list_single_value_attribute.html",
  import.meta.url
);

/**
 * ListSingleValueAttribute
 * @class attribute_widget.ListSingleValueAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
class ListSingleValueAttribute extends AbstractAttribute {
  constructor(id, name, subjectEntity) {
    
    super(id, name, subjectEntity);
    var that = this;


    /***
     * Value object of value
     * @type {attribute_widget.Value}
     * @private
     */
    var _value = new Value(id, name, this, this.getRootSubjectEntity());

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(listSingleValueAttributeHtml)({ id: id }));

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
    var propagateAttributeDeleteOperation = function (operation) {
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
      if (operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
        that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()) {
        processAttributeDeleteOperation(operation);
      }
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

    /**
     * jQuery object of DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Set attribute value by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _value.setValueFromJSON(json.value);
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

    _$node.find(".name").text(this.getName());
    _$node.find(".value").append(_value.get$node());
    _$node.find(".ui-icon-close").click(function () {
      var operation = new AttributeDeleteOperation(
        that.getEntityId(),
        that.getSubjectEntityId(),
        that.getRootSubjectEntity().getEntityId(),
        ListSingleValueAttribute.TYPE
      );
      propagateAttributeDeleteOperation(operation, CONFIG.WIDGET.NAME.MAIN);
    });

    if (_iwc) {
      that.registerCallbacks();
    }
  }
}

export default ListSingleValueAttribute;
