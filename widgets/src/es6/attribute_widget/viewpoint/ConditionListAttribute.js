import { CONFIG } from "../../config";
import $ from "jquery-ui";
import _ from "lodash-es";
import IWCW from "../../lib/IWCWrapper";
import Util from "../../Util";
import AttributeAddOperation from "../../operations/ot/AttributeAddOperation";
import AttributeDeleteOperation from "../../operations/ot/AttributeDeleteOperation";
import AbstractAttribute from "../AbstractAttribute";
import ConditionPredicateAttribute from "./ConditionPredicateAttribute";
import loadHTML from "../../html.template.loader";
const listAttributeHtml = await loadHTML(
  "../../../html/templates/attribute_widget/list_attribute.html",
  import.meta.url
);

ConditionListAttribute.prototype = new AbstractAttribute();
ConditionListAttribute.prototype.constructor = ConditionListAttribute;
/**
 * Abstract Attribute
 * @class attribute_widget.ConditionListAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 * @param {Object} options2 Selection options
 */
function ConditionListAttribute(id, name, subjectEntity, options, options2) {
  var that = this;

  AbstractAttribute.call(this, id, name, subjectEntity);

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
  var _$node = $(_.template(listAttributeHtml)());

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
    var attribute;
    if (!that.getAttributes().hasOwnProperty(operation.getEntityId())) {
      attribute = new ConditionPredicateAttribute(
        operation.getEntityId(),
        "Attribute",
        that,
        _options,
        _options2
      );
      that.addAttribute(attribute);
      _$node.find(".list").append(attribute.get$node());
    } else attribute = that.getAttribute(operation.getEntityId());
    //this is strange if i call processAttributeAddOperation for first time ytext is undefined, but it shouldn't
    const nodesMap = y.getMap("nodes");
    var ymap = nodesMap.get(subjectEntity.getEntityId());
    setTimeout(function () {
      var ytext = ymap.get(attribute.getKey().getEntityId());
      attribute.getKey().registerYType(ytext);
    }, 200);
    _$node.find(".list .operator2").show();
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

  this.setOptions = function (options) {
    _options = options;
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
    var operation = new AttributeAddOperation(
      id,
      that.getEntityId(),
      that.getRootSubjectEntity().getEntityId(),
      ConditionPredicateAttribute.TYPE
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
            event.name.replace(/\[\w*\]/g, ""),
            that.getEntityId(),
            that.getRootSubjectEntity().getEntityId(),
            that.constructor.name
          );
          attributeDeleteCallback(operation);
          break;
        }
      }
    } else if (event.name.indexOf("updateConditionOption") != -1) {
      that.setOptions(event.value);
    }
  });
}
export default ConditionListAttribute;
