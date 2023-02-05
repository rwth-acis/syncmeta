import { CONFIG } from "../../config";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import IWCW from "../../lib/IWCWrapper";

import AbstractAttribute from "../AbstractAttribute";
import ConditionPredicateAttribute from "./ConditionPredicateAttribute";
import loadHTML from "../../html.template.loader";
import {
  AttributeAddOperation,
  AttributeDeleteOperation,
} from "../../operations/ot/EntityOperation";
import { eventWasTriggeredByMe } from "../../yeventChecker";

const listHtml = await loadHTML(
  "../../../templates/canvas_widget/list_attribute.html",
  import.meta.url
);

/**
 * ConditionListAttribute
 * @class canvas_widget.ConditionListAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 * @param {Object} options2 Selection options
 */
class ConditionListAttribute extends AbstractAttribute {
  static TYPE = "ConditionListAttribute";
  constructor(id, name, subjectEntity, options, options2, y) {
    y = y || window.y;
    super(id, name, subjectEntity);
    var that = this;

    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options = options;

    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options2 = options2;

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
    var _$node = $(_.template(listHtml)());

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN, y);

    /**
     * Apply an Attribute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     * @param {new Y.Text()} ytext
     */
    var processAttributeAddOperation = function (operation) {
      var attribute = new ConditionPredicateAttribute(
        operation.getEntityId(),
        "Attribute",
        that,
        _options,
        _options2
      );
      attribute.registerYMap();
      that.addAttribute(attribute);
      _$node.find(".list").append(attribute.get$node());
    };

    /**
     * Propagate an Attribute Add Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var propagateAttributeAddOperation = function (operation) {
      processAttributeAddOperation(operation);
    };

    /**
     * Apply an Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var processAttributeDeleteOperation = function (operation) {
      var attribute = that.getAttribute(operation.getEntityId());
      if (attribute) {
        that.deleteAttribute(attribute.getEntityId());
        attribute.get$node().remove();
      }
    };

    /**
     * Propagate an Attribute Delete Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var propagateAttributeDeleteOperation = function (operation) {
      processAttributeDeleteOperation(operation);
      var ymap = that.getRootSubjectEntity().getYMap();
      ymap.delete(operation.getEntityId() + "[val]");
    };

    /**
     * Callback for a remote Attrbute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var remoteAttributeAddCallback = function (operation) {
      if (
        operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        processAttributeAddOperation(operation);
      }
    };

    /**
     * Callback for a remote Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var remoteAttributeDeleteCallback = function (operation) {
      if (
        operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        processAttributeDeleteOperation(operation);
      }
    };

    /**
     * Callback for a local Attribute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var localAttributeAddCallback = function (operation) {
      if (
        operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        propagateAttributeAddOperation(operation);
      }
    };

    /**
     * Callback for a local Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var localAttributeDeleteCallback = function (operation) {
      if (
        operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
          that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()
      ) {
        propagateAttributeDeleteOperation(operation);
      }
    };

    /**
     * Add attribute to attribute list
     * @param {canvas_widget.AbstractAttribute} attribute
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
     * @returns {canvas_widget.AbstractAttribute}
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

    this.setOptions = function (options) {
      _options = options;
    };

    /**
     * Get JSON representation of the attribute (list)
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.type = ConditionListAttribute.TYPE;
      var attr = {};
      _.forEach(this.getAttributes(), function (val, key) {
        attr[key] = val.toJSON();
      });
      json.list = attr;
      return json;
    };

    /**
     * Set attribute list by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      _.forEach(json.list, function (val, key) {
        var attribute = new ConditionPredicateAttribute(
          key,
          key,
          that,
          _options,
          _options2
        );
        attribute.setValueFromJSON(json.list[key]);
        that.addAttribute(attribute);
        _$node.find(".list").append(attribute.get$node());
      });
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      _iwcw.registerOnDataReceivedCallback(localAttributeAddCallback);
      _iwcw.registerOnDataReceivedCallback(localAttributeDeleteCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      _iwcw.unregisterOnDataReceivedCallback(localAttributeAddCallback);
      _iwcw.unregisterOnDataReceivedCallback(localAttributeDeleteCallback);
    };

    _$node.find(".name").text(this.getName());

    for (var attributeId in _list) {
      if (_list.hasOwnProperty(attributeId)) {
        _$node.find(".list").append(_list[attributeId].get$node());
      }
    }

    this.registerYMap = function () {
      var ymap = that.getRootSubjectEntity().getYMap();
      var attrs = that.getAttributes();
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          attrs[key].registerYMap();
        }
      }

      ymap.observe(function (event) {
        const array = Array.from(event.changes.keys.entries());
        array.forEach(([key, change]) => {
          if (key.indexOf("[value]") != -1) {
            var operation;
            var data = event.currentTarget.get(key);
            switch (change.action) {
              case "add": {
                if (eventWasTriggeredByMe(event)) return;
                const jabberId = event.currentTarget.get("jabberId");
                if (jabberId === _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID])
                  return;
                operation = new AttributeAddOperation(
                  key.replace(/\[\w*\]/g, ""),
                  that.getEntityId(),
                  that.getRootSubjectEntity().getEntityId(),
                  that.constructor.name
                );
                remoteAttributeAddCallback(operation);

                break;
              }
              case "delete": {
                operation = new AttributeDeleteOperation(
                  key.replace(/\[\w*\]/g, ""),
                  that.getEntityId(),
                  that.getRootSubjectEntity().getEntityId(),
                  that.constructor.name
                );
                remoteAttributeDeleteCallback(operation);
                break;
              }
            }
          } else if (key.indexOf("updateConditionOption") != -1) {
            that.setOptions(event.value);
          }
        });
      });
    };

    if (_iwcw) {
      that.registerCallbacks();
    }
  }
}

export default ConditionListAttribute;
