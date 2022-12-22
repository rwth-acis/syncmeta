import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import AbstractAttribute from "./AbstractAttribute";
import MultiLineValue from "./MultiLineValue";
import loadHTML from "../html.template.loader";

const singleMultiLineValueAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/single_multi_line_value_attribute.html",
  import.meta.url
);

/**
 * SingleMultiLineValueAttribute
 * @class canvas_widget.SingleMultiLineValueAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
class SingleMultiLineValueAttribute extends AbstractAttribute {
  constructor(id, name, subjectEntity, y) {
    super(id, name, subjectEntity);

    /***
     * Value object of value
     * @type {canvas_widget.MultiLineValue}
     * @private
     */
    var _value = new MultiLineValue(
      id,
      name,
      this,
      this.getRootSubjectEntity(),
      y
    );

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(singleMultiLineValueAttributeHtml)());

    /**
     * Set Value object of value
     * @param {canvas_widget.MultiLineValue} value
     */
    this.setValue = function (value) {
      _value = value;
    };

    /**
     * Get Value object of value
     * @returns {canvas_widget.MultiLineValue}
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

    _$node.find(".name").text(this.getName());
    _$node.find(".value").append(_value.get$node());
  }
}

export default SingleMultiLineValueAttribute;
