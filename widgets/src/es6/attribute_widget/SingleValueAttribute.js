import $ from "jquery-ui";
import _ from "lodash-es";
import AbstractAttribute from "./AbstractAttribute";
import Value from "./Value";
const singleValueAttributeHtml = await loadHTML(
  "../../../html/templates/attribute_widget/single_value_attribute.html",
  import.meta.url
);

SingleValueAttribute.prototype = new AbstractAttribute();
SingleValueAttribute.prototype.constructor = SingleValueAttribute;
/**
 * SingleValueAttribute
 * @class attribute_widget.SingleValueAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
function SingleValueAttribute(id, name, subjectEntity) {
  var that = this;

  AbstractAttribute.call(this, id, name, subjectEntity);

  /***
   * Value object of value
   * @type {attribute_widget.Value}
   * @private
   */
  var _value = new Value(id, name, this, this.getRootSubjectEntity());

  /**
   * jQuery object of DOM node representing the node
   * @type {jQuery}
   * @private
   */
  var _$node = $(_.template(singleValueAttributeHtml)({ id: id }));

  /**
   * Set Value object of value
   * @param {attribute_widget.Value} value
   */
  this.setValue = function (value) {
    _value = value;
  };

  /**
   * Get Value object of value
   * @returns {attribute_widget.Value}
   */
  this.getValue = function () {
    return _value;
  };

  /**
   * jQuery object of DOM node representing the attribute
   * @type {jQuery}
   * @public
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

  // check if view only mode is enabled for the property browser
  // because then the input fields should be disabled
  if (window.hasOwnProperty("y")) {
    const widgetConfigMap = y.getMap("widgetConfig");
    if (widgetConfigMap.get("view_only_property_browser")) {
      _$node.find(".val").attr("disabled", "true");
    }
  }
}

export default SingleValueAttribute;
