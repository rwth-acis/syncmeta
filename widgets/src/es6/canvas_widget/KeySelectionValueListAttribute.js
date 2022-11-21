import { CONFIG } from "../config";
import "jquery";
import "jquery-ui";
import _ from "lodash-es";
import IWCW from "../lib/IWCWrapper";

import AbstractAttribute from "./AbstractAttribute";
import KeySelectionValueAttribute from "./KeySelectionValueAttribute";
import loadHTML from "../html.template.loader";
import {
  AttributeAddOperation,
  AttributeDeleteOperation,
} from "../operations/ot/EntityOperation";

const keySelectionValueListAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/list_attribute.html",
  import.meta.url
);


/**
 * KeySelectionValueListAttribute
 * @class canvas_widget.KeySelectionValueListAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 */
class KeySelectionValueListAttribute  extends AbstractAttribute {
  static TYPE = "KeySelectionValueListAttribute"
  constructor(id, name, subjectEntity, options) {
    super( id, name, subjectEntity);
    var that = this;

    

    /**
     * Selection options
     * @type {Object}
     * @private
     */
    var _options = options;

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
    var _$node = $(_.template(keySelectionValueListAttributeHtml)());

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);

    /**
     * Apply an Attribute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var processAttributeAddOperation = function (operation) {
      var attribute = new KeySelectionValueAttribute(
        operation.getEntityId(),
        "Attribute",
        that,
        _options
      );
      attribute.registerYMap();
      that.addAttribute(attribute);
      if (_$node.find(".list").find("#" + attribute.getEntityId()).length == 0)
        _$node.find(".list").append(attribute.get$node());
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
     * Propagate an Attribute Add Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var propagateAttributeAddOperation = function (operation) {
      processAttributeAddOperation(operation);
    };

    /**
     * Propagate an Attribute Delete Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var propagateAttributeDeleteOperation = function (operation) {
      processAttributeDeleteOperation(operation);
      var ymap = that.getRootSubjectEntity().getYMap();
      ymap.delete(operation.getEntityId() + "[key]");
    };

    /**
     * Callback for a remote Attrbute Add Operation
     * @param {operations.ot.AttributeAddOperation} operation
     */
    var remoteAttributeAddCallback = function (operation) {
      if (operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
        that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()) {
        processAttributeAddOperation(operation);
      }
    };

    /**
     * Callback for a remote Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var remoteAttributeDeleteCallback = function (operation) {
      if (operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
        that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()) {
        processAttributeDeleteOperation(operation);
      }
    };

    var localAttributeAddCallback = function (operation) {
      if (operation instanceof AttributeAddOperation &&
        operation.getRootSubjectEntityId() ===
        that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()) {
        propagateAttributeAddOperation(operation);
      }
    };
    /**
     * Callback for a local Attribute Delete Operation
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    var localAttributeDeleteCallback = function (operation) {
      if (operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
        that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()) {
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

    /**
     * Get JSON representation of the attribute (list)
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.type = KeySelectionValueListAttribute.TYPE;
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
        var attribute = new KeySelectionValueAttribute(key, key, that, _options);
        attribute.setValueFromJSON(json.list[key]);
        that.addAttribute(attribute);
        if (_$node.find(".list").find("#" + attribute.getEntityId()).length == 0)
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

    if (_iwcw) {
      that.registerCallbacks();
    }

    this.registerYMap = function () {
      var ymap = that.getRootSubjectEntity().getYMap();
      var attrs = that.getAttributes();
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          var attr = attrs[key];
          attr.getKey().registerYType();
          attr.getValue().registerYType();
        }
      }

      ymap.observe(function (event) {
        if (event.name.indexOf("[key]") != -1) {
          var operation;
          var data = event.value;
          switch (event.type) {
            case "add": {
              var yUserId = event.object.map[event.name][0];
              if (yUserId === y.clientID)
                return;
              operation = new AttributeAddOperation(
                event.name.replace(/\[\w*\]/g, ""),
                that.getEntityId(),
                that.getRootSubjectEntity().getEntityId(),
                that.constructor.name
              );
              remoteAttributeAddCallback(operation);

              break;
            }
            case "delete": {
              operation = new AttributeDeleteOperation(
                event.name.replace(/\[\w*\]/g, ""),
                that.getEntityId(),
                that.getRootSubjectEntity().getEntityId(),
                that.constructor.name
              );
              remoteAttributeDeleteCallback(operation);
              break;
            }
          }
        }
      });
    };
  }
}

export default KeySelectionValueListAttribute;
