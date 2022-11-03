import _ from "lodash";
import BooleanAttribute from "./BooleanAttribute";
import IntegerAttribute from "./IntegerAttribute";
import FileAttribute from "./FileAttribute";
import SingleSelectionAttribute from "./SingleSelectionAttribute";
import SingleValueAttribute from "./SingleValueAttribute";
import AbstractEdge from "./AbstractEdge";

//noinspection JSUnusedLocalSymbols
/**
 * makeEdge
 * @class attribute_widget.makeEdge
 * @memberof attribute_widget
 * @constructor
 * @param {string} type Type of edge
 * @param arrowType
 * @param shapeType
 * @param color
 * @param overlay
 * @param overlayPosition
 * @param overlayRotate
 * @param attributes
 * @returns {Edge}
 */
function makeEdge(
  type,
  arrowType,
  shapeType,
  color,
  overlay,
  overlayPosition,
  overlayRotate,
  attributes
) {
  Edge.prototype = new AbstractEdge();
  Edge.prototype.constructor = Edge;
  /**
   * Edge
   * @class attribute_widget.Edge
   * @extends attribute_widget.AbstractEdge
   * @param {string} id Entity identifier of edge
   * @param {attribute_widget.AbstractNode} source Source node
   * @param {attribute_widget.AbstractNode} target Target node
   * @constructor
   */
  function Edge(id, source, target) {
    var that = this;

    AbstractEdge.call(this, type, id, source, target);

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractEdge.prototype.get$node.call(this);

    var init = function () {
      var attribute,
        attributeId,
        attrObj = {};
      for (attributeId in attributes) {
        if (attributes.hasOwnProperty(attributeId)) {
          attribute = attributes[attributeId];
          if (
            attribute.hasOwnProperty("position") &&
            attribute.position === "hide"
          )
            continue;
          switch (attribute.value) {
            case "boolean":
              attrObj[attributeId] = new BooleanAttribute(
                id + "[" + attribute.key.toLowerCase() + "]",
                attribute.key,
                that
              );
              break;
            case "string":
              attrObj[attributeId] = new SingleValueAttribute(
                id + "[" + attribute.key.toLowerCase() + "]",
                attribute.key,
                that
              );
              break;
            case "integer":
              attrObj[attributeId] = new IntegerAttribute(
                id + "[" + attribute.key.toLowerCase() + "]",
                attribute.key,
                that
              );
              break;
            case "file":
              attrObj[attributeId] = new FileAttribute(
                id + "[" + attribute.key.toLowerCase() + "]",
                attribute.key,
                that
              );
              break;
            default:
              if (attribute.options) {
                attrObj[attributeId] = new SingleSelectionAttribute(
                  id + "[" + attribute.key.toLowerCase() + "]",
                  attribute.key,
                  that,
                  attribute.options
                );
              }
          }
        }
      }
      that.setAttributes(attrObj);

      var $attributeNode = _$node.find(".attributes");
      for (var attributeKey in attrObj) {
        if (attrObj.hasOwnProperty(attributeKey)) {
          $attributeNode.append(attrObj[attributeKey].get$node());
        }
      }
    };

    this.registerYType = function () {
      AbstractEdge.prototype.registerYType.call(this);
      const edgeMap = y.getMap("edges");
      var ymap = edgeMap.get(that.getEntityId());
      var attr = that.getAttributes();
      for (var key in attr) {
        if (attr.hasOwnProperty(key)) {
          var val = attr[key].getValue();
          if (val.hasOwnProperty("registerYType")) {
            var ytext = ymap.get(val.getEntityId());
            val.registerYType(ytext);
          }
        }
      }
    };

    init();
  }

  Edge.prototype.applyAttributeRenaming = function (renamingAttributes) {
    var renAttr,
      $attr,
      attributes = this.getAttributes();
    for (var attrKey in attributes) {
      if (attributes.hasOwnProperty(attrKey)) {
        renAttr = renamingAttributes[attrKey];
        $attr = attributes[attrKey].get$node();
        if (renAttr) {
          if (renAttr.position === "hide") {
            $attr.hide();
          } else {
            $attr.find(".name").text(renAttr.key);
            if ($attr.is(":hidden")) {
              $attr.show();
            }
          }
        } else {
          $attr.hide();
        }
      }
    }
  };

  Edge.getType = function () {
    return type;
  };
  Edge.getAttributes = function () {
    return attributes;
  };
  return Edge;
}

export default makeEdge;
