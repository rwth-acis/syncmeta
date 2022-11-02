import $ from "jquery-ui";
import _ from "lodash";
import AbstractNode from "./AbstractNode";
import BooleanAttribute from "./BooleanAttribute";
import IntegerAttribute from "./IntegerAttribute";
import FileAttribute from "./FileAttribute";
import SingleValueAttribute from "./SingleValueAttribute";
import SingleSelectionAttribute from "./SingleSelectionAttribute";
import SingleMultiLineValueAttribute from "./SingleMultiLineValueAttribute";
const modelAttributesNodeHtml = await loadHTML(
  "../../../html/templates/canvas_widget/model_attributes_node.html",
  import.meta.url
);

ModelAttributesNode.TYPE = "ModelAttributesNode";

ModelAttributesNode.prototype = new AbstractNode();
ModelAttributesNode.prototype.constructor = ModelAttributesNode;
/**
 * Abstract Class Node
 * @class canvas_widget.ModelAttributesNode
 * @extends canvas_widget.AbstractNode
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {object} [attr] model attributes
 */
function ModelAttributesNode(id, attr) {
  var that = this;
  AbstractNode.call(this, id, ModelAttributesNode.TYPE, 0, 0, 0, 0, 0);

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
  var _$node = AbstractNode.prototype.get$node
    .call(this)
    .append(_$template)
    .addClass("class");

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

  /**
   * Get JSON representation of the node
   * @returns {Object}
   */
  this.toJSON = function () {
    var json = AbstractNode.prototype.toJSON.call(this);
    json.type = ModelAttributesNode.TYPE;
    return json;
  };

  if (attr) {
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

  this.getLabel().getValue().setValue("Model Attributes");

  _$node.find(".label").text("Model Attributes");
  _$node.hide();

  for (var attributeKey in _attributes) {
    if (_attributes.hasOwnProperty(attributeKey)) {
      _$attributeNode.append(_attributes[attributeKey].get$node());
    }
  }

  this.registerYMap = function () {
    AbstractNode.prototype.registerYMap.call(this);
    var attrs = this.getAttributes();
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        var attr = attrs[key];
        if (
          attr instanceof SingleValueAttribute ||
          attr instanceof SingleMultiLineValueAttribute
        ) {
          attr.getValue().registerYType();
        } else if (
          !(attr instanceof FileAttribute) &&
          !(attr instanceof SingleValueAttribute) &&
          !(attr instanceof SingleMultiLineValueAttribute)
        ) {
          attr.getValue().registerYType();
        }
      }
    }
  };
}

export default ModelAttributesNode;
