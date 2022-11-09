import { CONFIG } from "../config";
import "jquery";
import "jquery-ui";
import _ from "lodash-es";
import IWCW from "../lib/IWCWrapper";
import Util from "../Util";

import AbstractAttribute from "./AbstractAttribute";
import SingleValueAttribute from "./ListSingleValueAttribute";
import loadHTML from "../html.template.loader";
import {
  AttributeAddOperation,
  AttributeDeleteOperation,
} from "../operations/ot/EntityOperation";
const singleValueListAttributeHtml = await loadHTML(
  "../../templates/attribute_widget/list_attribute.html",
  import.meta.url
);

SingleValueListAttribute.prototype = new AbstractAttribute();
SingleValueListAttribute.prototype.constructor = SingleValueListAttribute;
/**
 * Abstract Attribute
 * @class attribute_widget.SingleValueListAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
function SingleValueListAttribute(id, name, subjectEntity) {
  var that = this;

  AbstractAttribute.call(this, id, name, subjectEntity);

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
  var _$node = $(_.template(singleValueListAttributeHtml)());

  /**
   * Inter widget communication wrapper
   * @type {Object}
   */
  var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

  /**
   * Apply an Attribute Add Operation
   * @param {operations.ot.AttributeAddOperation} operation
   */
  var processAttributeAddOperation = function (operation) {
    var attribute = new SingleValueAttribute(
      operation.getEntityId() + "[value]",
      "Attribute",
      that
    );
    const nodesMap = y.getMap("nodes");
    var ymap = nodesMap.get(subjectEntity.getEntityId());
    //this is strange if i call processAttributeAddOperation for this time ytext is undefined, but it shouldn't
    setTimeout(function () {
      var ytext = ymap.get(attribute.getValue().getEntityId());
      attribute.getValue().registerYType(ytext);
    }, 200);
    that.addAttribute(attribute);
    if (
      _$node
        .find(".list")
        .find(
          "#" + attribute.getEntityId().replace("[", "\\[").replace("]", "\\]")
        ).length === 0
    )
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
      var attribute = new SingleValueAttribute(key, key, that);
      attribute.setValueFromJSON(json.list[key]);
      if ((attr = that.getAttribute(attribute.getEntityId()))) {
        that.deleteAttribute(attr.getEntityId());
        attr.get$node().remove();
      }
      that.addAttribute(attribute);
      _$node.find(".list").append(attribute.get$node());
    });
  };

  _$node.find(".name").text(this.getName());
  for (var attrId in _list) {
    if (_list.hasOwnProperty(attrId)) {
      _$node.find(".list").append(_list[attrId].get$node());
    }
  }
  _$node.find(".ui-icon-plus").click(function () {
    var id = Util.generateRandomId();
    const userMap = y.getMap("users");
    var operation = new AttributeAddOperation(
      id,
      that.getEntityId(),
      that.getRootSubjectEntity().getEntityId(),
      SingleValueAttribute.TYPE,
      userMap.get(y.clientID)
    );
    propagateAttributeAddOperation(operation);
  });
  const nodesMap = y.getMap("nodes");

  nodesMap.get(subjectEntity.getEntityId()).observe(function (event) {
    if (event.name.indexOf("[value]") != -1) {
      switch (event.type) {
        case "add": {
          operation = new AttributeAddOperation(
            event.name.replace(/\[\w*\]/g, ""),
            that.getEntityId(),
            that.getRootSubjectEntity().getEntityId(),
            that.constructor.name
          );
          attributeAddCallback(operation);
          break;
        }
        case "delete": {
          operation = new AttributeDeleteOperation(
            event.name,
            that.getEntityId(),
            that.getRootSubjectEntity().getEntityId(),
            that.constructor.name
          );
          attributeDeleteCallback(operation);
          break;
        }
      }
    }
  });
}

export default SingleValueListAttribute;
