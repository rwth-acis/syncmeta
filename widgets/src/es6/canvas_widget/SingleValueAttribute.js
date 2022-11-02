import $ from "jquery-ui";
import jsPlumb from "jsplumb";
import _ from "lodash";
import Util from "Util";
import AbstractAttribute from "canvas_widget/AbstractAttribute";
import Value from "canvas_widget/Value";
import singleValueAttributeHtml from "text!templates/canvas_widget/single_value_attribute.html";

SingleValueAttribute.prototype = new AbstractAttribute();
SingleValueAttribute.prototype.constructor = SingleValueAttribute;
/**
 * SingleValueAttribute
 * @class canvas_widget.SingleValueAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
function SingleValueAttribute(id, name, subjectEntity) {
  var that = this;
  AbstractAttribute.call(this, id, name, subjectEntity);

  /***
   * Value object of value
   * @type {canvas_widget.Value}
   * @private
   */
  var _value = new Value(id, name, this, this.getRootSubjectEntity());

  /**
   * jQuery object of DOM node representing the node
   * @type {jQuery}
   * @private
   */
  var _$node = $(_.template(singleValueAttributeHtml)());

  /**
   * Set Value object of value
   * @param {canvas_widget.Value} value
   */
  this.setValue = function (value) {
    _value = value;
  };

  /**
   * Get Value object of value
   * @returns {canvas_widget.Value}
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
   * Get JSON representation of the attribute
   * @returns {Object}
   */
  this.toJSON = function () {
    var json = AbstractAttribute.prototype.toJSON.call(this);
    json.value = _value.toJSON();
    return json;
  };

  /**
   * Set attribute value by its JSON representation
   * @param json
   */
  this.setValueFromJSON = function (json) {
    _value.setValueFromJSON(json.value);
  };

  this.registerYType = function () {
    _value.registerYType();
  };

  _$node.find(".name").text(this.getName());
  _$node.find(".value").append(_value.get$node());
}

export default SingleValueAttribute;
