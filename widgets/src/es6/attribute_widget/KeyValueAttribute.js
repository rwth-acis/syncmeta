import { CONFIG } from "../config";
import "jquery";
import "jquery-ui";
import _ from "lodash-es";
import IWCW from "../lib/IWCWrapper";

import AbstractAttribute from "./AbstractAttribute";
import Value from "./Value";
import loadHTML from "../html.template.loader";
import { AttributeDeleteOperation } from "../operations/ot/EntityOperation";
const keyValueAttributeHtml = await loadHTML(
  "../../templates/attribute_widget/key_value_attribute.html",
  import.meta.url
);



/**
 * KeyValueAttribute
 * @class attribute_widget.KeyValueAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @constructor
 */
class KeyValueAttribute extends AbstractAttribute {
static   TYPE = "KeyValueAttribute";

  constructor(id, name, subjectEntity) {
    var that = this;

    AbstractAttribute.call(this, id, name, subjectEntity);

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
    var _value = new Value(
      id + "[value]",
      "Attribute Type",
      this,
      this.getRootSubjectEntity()
    );

    /**
     * jQuery object of the DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(keyValueAttributeHtml)());

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
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      iwc.registerOnDataReceivedCallback(attributeDeleteCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      iwc.unregisterOnDataReceivedCallback(attributeDeleteCallback);
    };

    _$node.find(".key").append(_key.get$node());
    _$node.find(".value").append(_value.get$node());
    _$node.find(".ui-icon-close").click(function () {
      var operation = new AttributeDeleteOperation(
        that.getEntityId(),
        that.getSubjectEntityId(),
        that.getRootSubjectEntity().getEntityId(),
        KeyValueAttribute.TYPE
      );
      propagateAttributeDeleteOperation(operation, CONFIG.WIDGET.NAME.MAIN);
    });

    if (iwc) {
      that.registerCallbacks();
    }
  }
}

export default KeyValueAttribute;
