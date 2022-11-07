import { CONFIG } from "../../config";
import "jquery";
import "jquery-ui";
import _ from "lodash-es";
import IWCW from "../../lib/IWCWrapper";
import AttributeAddOperation from "../../operations/ot/AttributeAddOperation";
import AttributeDeleteOperation from "../../operations/ot/AttributeDeleteOperation";
import AbstractAttribute from "../AbstractAttribute";
import RenamingAttribute from "./RenamingAttribute";
import loadHTML from "../html.template.loader";

const listHtml = await loadHTML(
  "../../../html/templates/canvas_widget/list_attribute.html",
  import.meta.url
);

RenamingListAttribute.TYPE = "RenamingListAttribute";

RenamingListAttribute.prototype = new AbstractAttribute();
RenamingListAttribute.prototype.constructor = RenamingListAttribute;
/**
 * RenamingListAttribute
 * @class canvas_widget.RenamingListAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 */
function RenamingListAttribute(id, name, subjectEntity, options) {
  var that = this;

  AbstractAttribute.call(this, id, name, subjectEntity);

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
  var _$node = $(_.template(listHtml)());

  /**
   * Inter widget communication wrapper
   * @type {Object}
   */
  var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);

  /**
   * Apply an Attribute Add Operation
   * @param {operations.ot.AttributeAddOperation} operation
   * @param {new Y.Text()} ytext
   */
  var processAttributeAddOperation = function (operation) {
    var attribute = new RenamingAttribute(
      operation.getEntityId(),
      "Attribute",
      that,
      _options
    );
    that.addAttribute(attribute);
    attribute.registerYMap();
    _$node.find(".list").append(attribute.get$node());
    return attribute;
  };

  /**
   * Propagate an Attribute Add Operation to the remote users and the local widgets
   * @param {operations.ot.AttributeAddOperation} operation
   */
  this.propagateAttributeAddOperation = function (operation) {
    return processAttributeAddOperation(operation);
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
      subjectEntity.showAttributes();
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
    json.type = RenamingListAttribute.TYPE;
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
      var attribute = new RenamingAttribute(key, key, that, _options);
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

  if (_iwcw) {
    that.registerCallbacks();
  }
  this.registerYMap = function () {
    var ymap = that.getRootSubjectEntity().getYMap();
    var attrs = that.getAttributes();
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        var attr = attrs[key];
        attr.registerYMap();
      }
    }

    ymap.observe(function (event) {
      if (event.name.indexOf("[val]") != -1) {
        var operation;
        var data = event.value;
        switch (event.type) {
          case "add": {
            var yUserId = event.object.map[event.name][0];
            if (yUserId === y.clientID) return;
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

export default RenamingListAttribute;
