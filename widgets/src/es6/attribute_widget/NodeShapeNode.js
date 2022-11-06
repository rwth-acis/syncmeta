import "jquery";
import "jquery-ui";
import _ from "lodash-es";
import AbstractNode from "./AbstractNode";
import BooleanAttribute from "./BooleanAttribute";
import SingleSelectionAttribute from "./SingleSelectionAttribute";
import SingleValueAttribute from "./SingleValueAttribute";
import IntegerAttribute from "./IntegerAttribute";
import SingleColorValueAttribute from "./SingleColorValueAttribute";
import SingleCodeEditorValueAttribute from "./SingleCodeEditorValueAttribute";
import loadHTML from "../html.template.loader";
const nodeShapeNodeHtml = await loadHTML(
  "../../../html/templates/attribute_widget/node_shape_node.html",
  import.meta.url
);

NodeShapeNode.TYPE = "Node Shape";

NodeShapeNode.prototype = new AbstractNode();
NodeShapeNode.prototype.constructor = NodeShapeNode;
/**
 * Abstract Class Node
 * @class attribute_widget.NodeShapeNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {boolean} containment Height of node
 */
function NodeShapeNode(id, left, top, width, height, containment) {
  var that = this;

  AbstractNode.call(
    this,
    id,
    NodeShapeNode.TYPE,
    left,
    top,
    width,
    height,
    containment
  );

  /**
   * jQuery object of node template
   * @type {jQuery}
   * @private
   */
  var _$template = $(_.template(nodeShapeNodeHtml)());

  /**
   * jQuery object of DOM node representing the node
   * @type {jQuery}
   * @private
   */
  var _$node = AbstractNode.prototype.get$node.call(this).append(_$template);

  /**
   * jQuery object of DOM node representing the attributes
   * @type {jQuery}
   * @private
   */
  var $attributeNode = _$node.find(".attributes");

  /**
   * Attributes of node
   * @type {Object}
   * @private
   */
  var attributes = this.getAttributes();

  this.addAttribute(
    new SingleSelectionAttribute(
      this.getEntityId() + "[shape]",
      "Shape",
      this,
      {
        circle: "Circle",
        diamond: "Diamond",
        rectangle: "Rectangle",
        rounded_rectangle: "Rounded Rectangle",
        triangle: "Triangle",
      }
    )
  );
  this.addAttribute(
    new SingleColorValueAttribute(this.getEntityId() + "[color]", "Color", this)
  );
  this.addAttribute(
    new IntegerAttribute(
      this.getEntityId() + "[defaultWidth]",
      "Default Width",
      this
    )
  );
  this.addAttribute(
    new IntegerAttribute(
      this.getEntityId() + "[defaultHeight]",
      "Default Height",
      this
    )
  );
  this.addAttribute(
    new BooleanAttribute(
      this.getEntityId() + "[containment]",
      "Containment",
      this
    )
  );
  this.addAttribute(
    new SingleCodeEditorValueAttribute(
      this.getEntityId() + "[customShape]",
      "Custom Shape",
      this
    )
  );
  this.addAttribute(
    new SingleValueAttribute(
      this.getEntityId() + "[customAnchors]",
      "Custom Anchors",
      this
    )
  );

  _$node.find(".label").append(this.getLabel().get$node());

  this.registerYType = function () {
    AbstractNode.prototype.registerYType.call(this);
    const nodesMap = y.getMap("nodes");
    var ymap = nodesMap.get(that.getEntityId());

    var colorVal = that.getAttribute(that.getEntityId() + "[color]").getValue();
    var ytextColor = ymap.get(colorVal.getEntityId());
    colorVal.registerYType(ytextColor);

    var customAnchorVal = that
      .getAttribute(that.getEntityId() + "[customAnchors]")
      .getValue();
    var ytextCustomAnchor = ymap.get(customAnchorVal.getEntityId());
    customAnchorVal.registerYType(ytextCustomAnchor);
  };

  for (var attributeKey in attributes) {
    if (attributes.hasOwnProperty(attributeKey)) {
      $attributeNode.append(attributes[attributeKey].get$node());
    }
  }
}

export default NodeShapeNode;
