import "jquery";
import "jquery-ui";
import _ from "lodash-es";
import AbstractNode from "./AbstractNode";
import BooleanAttribute from "./BooleanAttribute";
import IntegerAttribute from "./IntegerAttribute";
import FileAttribute from "./FileAttribute";
import SingleValueAttribute from "./SingleValueAttribute";
import SingleSelectionAttribute from "./SingleSelectionAttribute";
import SingleMultiLineValueAttribute from "./SingleMultiLineValueAttribute";
import loadHTML from "../html.template.loader";
const modelAttributesNodeHtml = await loadHTML(
  "../../../html/templates/attribute_widget/model_attributes_node.html",
  import.meta.url
);

ModelAttributesNode.TYPE = "ModelAttributesNode";

ModelAttributesNode.prototype = new AbstractNode();
ModelAttributesNode.prototype.constructor = ModelAttributesNode;
/**
 * Abstract Class Node
 * @class attribute_widget.ModelAttributesNode
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractNode
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {object} [attr] model attributes
 */
function ModelAttributesNode(id, attr) {
  AbstractNode.call(this, id, ModelAttributesNode.TYPE, 0, 0, 0, 0);

  /**
   * jQuery object of node template
   * @type {jQuery}
   * @private
   */
  var _$template = $(_.template(modelAttributesNodeHtml)());

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
  var _$attributeNode = _$node.find(".attributes");

  /**
   * Attributes of node
   * @type {Object}
   * @private
   */
  var attributes = this.getAttributes();

  if (attr) {
    if (_.size(attr) === 0) {
      _$node.children().hide();
    }
    for (var attrKey in attr) {
      if (attr.hasOwnProperty(attrKey)) {
        switch (attr[attrKey].value) {
          case "boolean":
            this.addAttribute(
              new BooleanAttribute(
                this.getEntityId() +
                  "[" +
                  attr[attrKey].key.toLowerCase() +
                  "]",
                attr[attrKey].key,
                this
              )
            );
            break;
          case "string":
            this.addAttribute(
              new SingleValueAttribute(
                this.getEntityId() +
                  "[" +
                  attr[attrKey].key.toLowerCase() +
                  "]",
                attr[attrKey].key,
                this
              )
            );
            break;
          case "integer":
            this.addAttribute(
              new IntegerAttribute(
                this.getEntityId() +
                  "[" +
                  attr[attrKey].key.toLowerCase() +
                  "]",
                attr[attrKey].key,
                this
              )
            );
            break;
          case "file":
            this.addAttribute(
              new FileAttribute(
                this.getEntityId() +
                  "[" +
                  attr[attrKey].key.toLowerCase() +
                  "]",
                attr[attrKey].key,
                this
              )
            );
            break;
          default:
            if (attr[attrKey].options) {
              this.addAttribute(
                new SingleSelectionAttribute(
                  this.getEntityId() +
                    "[" +
                    attr[attrKey].key.toLowerCase() +
                    "]",
                  attr[attrKey].key,
                  this,
                  attr[attrKey].options
                )
              );
            }
            break;
        }
      }
    }
  } else {
    this.addAttribute(
      new SingleValueAttribute(this.getEntityId() + "[name]", "Name", this)
    );
    this.addAttribute(
      new SingleMultiLineValueAttribute(
        this.getEntityId() + "[description]",
        "Description",
        this
      )
    );
  }

  this.registerYType = function () {
    var attrs = this.getAttributes();
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        var val = attrs[key].getValue();
        if (
          val.constructor.name === "Value" ||
          val.constructor.name === "MultiLineValue"
        ) {
          const nodesMap = y.getMap("nodes");
          var ymap = nodesMap.get(this.getEntityId());
          var ytext = ymap.get(val.getEntityId());
          val.registerYType(ytext);
        }
      }
    }
  };

  _$node.find(".label").hide();

  for (var attributeKey in attributes) {
    if (attributes.hasOwnProperty(attributeKey)) {
      _$attributeNode.append(attributes[attributeKey].get$node());
    }
  }
}

export default ModelAttributesNode;
