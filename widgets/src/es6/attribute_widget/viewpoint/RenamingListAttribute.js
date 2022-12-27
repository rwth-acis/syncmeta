import { CONFIG } from "../../config";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import IWCW from "../../lib/IWCWrapper";

import AbstractAttribute from "../AbstractAttribute";
import RenamingAttribute from "./RenamingAttribute";
import loadHTML from "../../html.template.loader";
import {
  AttributeAddOperation,
  AttributeDeleteOperation,
} from "../../operations/ot/EntityOperation";
const listAttributeHtml = await loadHTML(
  "../../../templates/attribute_widget/list_attribute.html",
  import.meta.url
);

/**
 * Abstract Attribute
 * @class attribute_widget.RenamingListAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options
 */
class RenamingListAttribute extends AbstractAttribute {
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
    var _$node = $(_.template(listAttributeHtml)());
    //remove the plus icon
    _$node.find(".ui-icon-plus").parent().remove();

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
        attribute = new RenamingAttribute(
          operation.getEntityId(),
          "Attribute",
          that,
          _options
        );
        that.addAttribute(attribute);
        _$node.find(".list").append(attribute.get$node());
      } else
        attribute = that.getAttribute(operation.getEntityId());
      //this is strange if i call processAttributeAddOperation for first time ytext is undefined, but it shouldn't
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(subjectEntity.getEntityId());
      setTimeout(function () {
        var ytext = ymap.get(attribute.getKey().getEntityId());
        attribute.getKey().registerYType(ytext);
        var ytext2 = ymap.get(attribute.getRef().getEntityId());
        attribute.getRef().registerYType(ytext2);
      }, 200);
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
      if (operation instanceof AttributeDeleteOperation &&
        operation.getRootSubjectEntityId() ===
        that.getRootSubjectEntity().getEntityId() &&
        operation.getSubjectEntityId() === that.getEntityId()) {
        processAttributeDeleteOperation(operation);
      }
    };

    /**
     * Propagate an Attribute Add Operation to the remote users and the local widgets
     * @param {operations.ot.AttributeDeleteOperation} operation
     */
    this.propagateAttributeAddOperation = function (operation) {
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
        subjectEntity.showAttributes();
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
        var attribute = new RenamingAttribute(key, "Attribute", that, _options);
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

    const nodesMap = y.getMap("nodes");
    nodesMap.get(subjectEntity.getEntityId()).observe(function (event) {
      if (event.name.indexOf("[val]") != -1) {
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
      }
    });
  }
}

export default RenamingListAttribute;
