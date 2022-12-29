import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import IWCW from "../lib/IWCWrapper";

import AbstractAttribute from "./AbstractAttribute";
import Value from "./Value";
import SelectionValue from "./SelectionValue";
import loadHTML from "../html.template.loader";
import { CONFIG } from "../config";
import { AttributeDeleteOperation } from "../operations/ot/EntityOperation";
const keySelectionValueAttributeHtml = await loadHTML(
  "../../templates/attribute_widget/key_value_attribute.html",
  import.meta.url
);

/**
 * KeySelectionValueAttribute
 * @class attribute_widget.KeySelectionValueAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 * @constructor
 */
class KeySelectionValueAttribute extends AbstractAttribute {
  static TYPE = "KeySelectionValueAttribute";
  constructor(id, name, subjectEntity, options) {
    super(id, name, subjectEntity);
    var that = this;

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

    /**
     * jQuery object of the DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(keySelectionValueAttributeHtml)({ id: id }));

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
      if (
        operation instanceof AttributeDeleteOperation &&
        operation.getEntityId() === that.getEntityId()
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
      _iwc.registerOnDataReceivedCallback(attributeDeleteCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      _iwc.unregisterOnDataReceivedCallback(attributeDeleteCallback);

      _value.unregisterCallbacks();
    };

    _$node.find(".key").append(_key.get$node());
    _$node.find(".attribute_value").append(_value.get$node());
    _$node.find(".btn-danger").click(function () {
      var operation = new AttributeDeleteOperation(
        that.getEntityId(),
        that.getSubjectEntityId(),
        that.getRootSubjectEntity().getEntityId(),
        KeySelectionValueAttribute.TYPE
      );
      propagateAttributeDeleteOperation(operation, CONFIG.WIDGET.NAME.MAIN);
    });

    if (_iwc) {
      that.registerCallbacks();
    }
  }
}

export default KeySelectionValueAttribute;
