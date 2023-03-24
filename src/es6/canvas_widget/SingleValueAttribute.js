import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import AbstractAttribute from "./AbstractAttribute";
import { Value } from "./Manager";
import loadHTML from "../html.template.loader";

const canvasSingleValueAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/single_value_attribute.html",
  import.meta.url
);

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
class SingleValueAttribute extends AbstractAttribute {
  value;
  constructor(id, name, subjectEntity, y) {
    y = y || window.y;
    if (!y) {
      throw new Error("y is undefined");
    }
    super(id, name, subjectEntity);
    var that = this;

    /***
     * Value object of value
     * @type {canvas_widget.Value}
     * @private
     */
    var _value = new Value(id, name, this, this.getRootSubjectEntity(), y);
    this.value = _value;

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(canvasSingleValueAttributeHtml)());

    /**
     * Set Value object of value
     * @param {canvas_widget.Value} value
     */
    this.setValue = function (value) {
      _value = value;
      this.value = value;
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
}

export default SingleValueAttribute;
