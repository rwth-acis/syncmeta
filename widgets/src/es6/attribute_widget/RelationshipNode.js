import "jquery";
import "jquery-ui";
import _ from "lodash-es";
import AbstractNode from "./AbstractNode";
import KeySelectionValueSelectionValueListAttribute from "./KeySelectionValueSelectionValueListAttribute";
import loadHTML from "../html.template.loader";
const relationshipNodeHtml = await loadHTML(
  "../../../html/templates/attribute_widget/relationship_node.html",
  import.meta.url
);

RelationshipNode.TYPE = "Relationship";

RelationshipNode.prototype = new AbstractNode();
RelationshipNode.prototype.constructor = RelationshipNode;
/**
 * RelationshipNode
 * @class attribute_widget.RelationshipNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @constructor
 */
function RelationshipNode(id, left, top, width, height) {
  var that = this;
  AbstractNode.call(this, id, RelationshipNode.TYPE, left, top, width, height);

  /**
   * jQuery object of node template
   * @type {jQuery}
   * @private
   */
  var $template = $(_.template(relationshipNodeHtml)({ type: "Relationship" }));

  /**
   * jQuery object of DOM node representing the node
   * @type {jQuery}
   * @private
   */
  var _$node = AbstractNode.prototype.get$node.call(this).append($template);

  /**
   * jQuery object of DOM node representing the attributes
   * @type {jQuery}
   * @private
   */
  var _$attributeNode = _$node.find(".attributes");

  /**
   * Attributes of node
   * @type {Object}
   * @private
   */
  var _attributes = this.getAttributes();

  this.addAttribute(
    new KeySelectionValueSelectionValueListAttribute(
      "[attributes]",
      "Attributes",
      this,
      {
        string: "String",
        boolean: "Boolean",
        integer: "Integer",
        file: "File",
      },
      { hidden: "Hide", top: "Top", center: "Center", bottom: "Bottom" }
    )
  );

  this.registerYType = function () {
    AbstractNode.prototype.registerYType.call(this);
    const nodesMap = y.getMap("nodes");
    var ymap = nodesMap.get(that.getEntityId());
    var attrs = _attributes["[attributes]"].getAttributes();
    for (var attributeKey in attrs) {
      if (attrs.hasOwnProperty(attributeKey)) {
        var keyVal = attrs[attributeKey].getKey();
        var ytext = ymap.get(keyVal.getEntityId());
        keyVal.registerYType(ytext);
      }
    }
  };

  _$node.find(".label").append(this.getLabel().get$node());

  for (var attributeKey in _attributes) {
    if (_attributes.hasOwnProperty(attributeKey)) {
      _$attributeNode.append(_attributes[attributeKey].get$node());
    }
  }
}

export default RelationshipNode;
