import { CONFIG } from "../config";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import IWCW from "../lib/IWCWrapper";
import Util from "../Util";

import AbstractAttribute from "./AbstractAttribute";
import KeyValueAttribute from "./KeyValueAttribute";
import loadHTML from "../html.template.loader";
import { AttributeAddOperation } from "../operations/ot/EntityOperation";
const keyValueListAttributeHtml = await loadHTML(
  "../../templates/attribute_widget/list_attribute.html",
  import.meta.url
);


/**
 * Abstract Attribute
 * @class attribute_widget.KeyValueListAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
class KeyValueListAttribute extends AbstractAttribute{
  constructor(id, name, subjectEntity) {
    
    super( id, name, subjectEntity);
    var that = this;


    /**
     * List of attributes
     * @type {Object}
     * @private
     */
    var _list = {};

    /**
     * jQuery object of DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(keyValueListAttributeHtml)());

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

    /**
     * Apply an Attribute Add Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var processAttributeAddOperation = function (operation) {
      var attribute = new KeyValueAttribute(
        operation.getEntityId(),
        "Attribute",
        that
      );
      that.addAttribute(attribute);
      _$node.find(".list").append(attribute.get$node());
    };

    /**
     * Propagate an Attribute Add Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var propagateAttributeAddOperation = function (operation) {
      iwc.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.MAIN,
        operation.getOTOperation()
      );
    };

    /**
     * Callback for an Attribute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var attributeAddCallback = function (operation) {
      if (operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
        that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()) {
        processAttributeAddOperation(operation);
      }
    };

    /**
     * Add attribute to attribute list
     * @param {attribute_widget.AbstractAttribute} attribute
     */
    this.addAttribute = function (attribute) {
      var id = attribute.getEntityId();
      if (!_list.hasOwnProperty(id)) {
        _list[id] = attribute;
      }
    };

    /**
     * Get attribute of attribute list by its entity id
     * @param id
     * @returns {attribute_widget.AbstractAttribute}
     */
    this.getAttribute = function (id) {
      if (_list.hasOwnProperty(id)) {
        return _list[id];
      }
      return null;
    };

    /**
     * Delete attribute from attribute list by its entity id
     * @param {string} id
     */
    this.deleteAttribute = function (id) {
      if (_list.hasOwnProperty(id)) {
        delete _list[id];
      }
    };

    /**
     * Get attribute list
     * @returns {Object}
     */
    this.getAttributes = function () {
      return _list;
    };

    /**
     * Set attribute list
     * @param {Object} list
     */
    this.setAttributes = function (list) {
      _list = list;
    };

    /**
     * Get jQuery object of the DOM node representing the attribute (list)
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Set attribute list by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _.forEach(json.list, function (val, key) {
        var attribute = new KeyValueAttribute(key, key, that);
        attribute.setValueFromJSON(json.list[key]);
        // if ((attr = that.getAttribute(attribute.getEntityId()))) {
        //   that.deleteAttribute(attr.getEntityId());
        //   attr.get$node().remove();
        // }
        that.addAttribute(attribute);
        _$node.find(".list").append(attribute.get$node());
      });
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      iwc.registerOnDataReceivedCallback(attributeAddCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      iwc.unregisterOnDataReceivedCallback(attributeAddCallback);
    };

    _$node.find(".attribute_name").text(this.getName());
    for (var attrId in _list) {
      if (_list.hasOwnProperty(attrId)) {
        _$node.find(".list").append(_list[attrId].get$node());
      }
    }
    _$node.find(".btn-success").click(function () {
      var id = Util.generateRandomId();
      var operation = new AttributeAddOperation(
        id,
        that.getEntityId(),
        that.getRootSubjectEntity().getEntityId(),
        KeyValueAttribute.TYPE
      );
      propagateAttributeAddOperation(operation, CONFIG.WIDGET.NAME.MAIN);
    });

    if (iwc) {
      that.registerCallbacks();
    }
  }
}

export default KeyValueListAttribute;
