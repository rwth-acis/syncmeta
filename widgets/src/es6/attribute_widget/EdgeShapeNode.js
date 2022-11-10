import "jquery";
import "jquery-ui";
import _ from "lodash-es";
import { AbstractNode } from "./EntityManager";
import SingleSelectionAttribute from "./SingleSelectionAttribute";
import SingleValueAttribute from "./SingleValueAttribute";
import SingleColorValueAttribute from "./SingleColorValueAttribute";
import BooleanAttribute from "./BooleanAttribute";
import loadHTML from "../html.template.loader";
const edgeShapeNodeHtml = await loadHTML(
  "../../templates/attribute_widget/edge_shape_node.html",
  import.meta.url
);

/**
 * Abstract Class Node
 * @class attribute_widget.EdgeShapeNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 */
class EdgeShapeNode extends AbstractNode {
  static TYPE = "Edge Shape";

  constructor(id, left, top, width, height) {
    super(id, EdgeShapeNode.TYPE, left, top, width, height);

    var that = this;

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(_.template(edgeShapeNodeHtml)());

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
        this.getEntityId() + "[arrow]",
        "Arrow",
        this,
        {
          bidirassociation: "---",
          unidirassociation: "-->",
          generalisation: "--▷",
          diamond: "-◁▷",
        }
      )
    );
    this.addAttribute(
      new SingleSelectionAttribute(
        this.getEntityId() + "[shape]",
        "Shape",
        this,
        { straight: "Straight", curved: "Curved", segmented: "Segmented" }
      )
    );
    this.addAttribute(
      new SingleColorValueAttribute(
        this.getEntityId() + "[color]",
        "Color",
        this
      )
    );
    this.addAttribute(
      new SingleValueAttribute(
        this.getEntityId() + "[overlay]",
        "Overlay Text",
        this
      )
    );
    this.addAttribute(
      new SingleSelectionAttribute(
        this.getEntityId() + "[overlayPosition]",
        "Overlay Position",
        this,
        { hidden: "Hide", top: "Top", center: "Center", bottom: "Bottom" }
      )
    );
    this.addAttribute(
      new BooleanAttribute(
        this.getEntityId() + "[overlayRotate]",
        "Autoflip Overlay",
        this
      )
    );

    _$node.find(".label").append(this.getLabel().get$node());

    this.registerYType = function () {
      AbstractNode.prototype.registerYType.call(this);
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(that.getEntityId());
      var colorVal = that
        .getAttribute(that.getEntityId() + "[color]")
        .getValue();
      var ytextColor = ymap.get(colorVal.getEntityId());
      colorVal.registerYType(ytextColor);

      var customShapeVal = that
        .getAttribute(that.getEntityId() + "[overlay]")
        .getValue();
      var ytextCustomShape = ymap.get(customShapeVal.getEntityId());
      customShapeVal.registerYType(ytextCustomShape);
    };

    for (var attributeKey in attributes) {
      if (attributes.hasOwnProperty(attributeKey)) {
        $attributeNode.append(attributes[attributeKey].get$node());
      }
    }
  }
}

export default EdgeShapeNode;
