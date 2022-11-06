import "jquery-ui";
import _ from "lodash-es";
import AbstractAttribute from "./AbstractAttribute";
import MultiLineValue from "./MultiLineValue";
import loadHTML from "../html.template.loader";
const singleMultiLineValueAttributeHtml = await loadHTML(
  "../../../html/templates/attribute_widget/single_value_attribute.html",
  import.meta.url
);

SingleMultiLineValueAttribute.prototype = new AbstractAttribute();
SingleMultiLineValueAttribute.prototype.constructor =
  SingleMultiLineValueAttribute;
/**
 * SingleMultiLineValueAttribute
 * @class attribute_widget.SingleMultiLineValueAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
function SingleMultiLineValueAttribute(id, name, subjectEntity) {
  AbstractAttribute.call(this, id, name, subjectEntity);

  /***
   * Value object of value
   * @type {attribute_widget.MultiLineValue}
   * @private
   */
  var _value = new MultiLineValue(id, name, this, this.getRootSubjectEntity());

  /**
   * jQuery object of DOM node representing the node
   * @type {jQuery}
   * @private
   */
  var _$node = $(_.template(singleMultiLineValueAttributeHtml)({ id: id }));

  /**
   * Set Value object of value
   * @param {attribute_widget.MultiLineValue} value
   */
  this.setValue = function (value) {
    _value = value;
  };

  /**
   * Get Value object of value
   * @returns {attribute_widget.MultiLineValue}
   */
  this.getValue = function () {
    return _value;
  };

  /**
   * jQuery object of DOM node representing the attribute
   * @type {jQuery}
   * @private
   */
  this.get$node = function () {
    return _$node;
  };

  /**
   * Set attribute value by its JSON representation
   * @param json
   */
  this.setValueFromJSON = function (json) {
    _value.setValueFromJSON(json.value);
  };

  _$node.find(".name").text(this.getName());
  _$node.find(".value").append(_value.get$node());
}

export default SingleMultiLineValueAttribute;
