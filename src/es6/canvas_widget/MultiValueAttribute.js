import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import AbstractAttribute from "./AbstractAttribute";
import { Value } from "./Manager";
import loadHTML from "../html.template.loader";
import { MultiValue } from "./MultiValue";

const multiValueAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/multi_value_attribute.html",
  import.meta.url
);

/**
 * MultiValueAttribute
 * @memberof canvas_widget
 * @extends canvas_widget.AbstractAttribute
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
export class MultiValueAttribute extends AbstractAttribute {
  /***
   * Value object of value
   * @type {canvas_widget.MultiValue}
   * @private
   */
  _value = null;
  /**
   * jQuery object of DOM node representing the node
   * @type {jQuery}
   * @private
   */
  _$node = null;

  constructor(id, name, subjectEntity) {
    super(id, name, subjectEntity);

    this._value = new MultiValue(id, name, this, this.getRootSubjectEntity());

    this._$node = $(_.template(multiValueAttributeHtml)({ id: id }));

    this._$node.find(".name").text(this.getName());

    this._$node.find(".value").append(this._value.get$node());

    // check if view only mode is enabled for the property browser
    // because then the input fields should be disabled
    if (window.hasOwnProperty("y")) {
      const widgetConfigMap = y.getMap("widgetConfig");
      if (widgetConfigMap.get("view_only_property_browser")) {
        this._$node.find(".val").attr("disabled", "true");
      }
    }
  }

  /**
   * Set Value object of value
   * @param {canvas_widget.Value} value
   */
  setValue(value) {
    this._value = value;
  }

  /**
   * Get Value object of value
   * @returns {canvas_widget.Value}
   */
  getValue() {
    return this._value;
  }

  /**
   * jQuery object of DOM node representing the attribute
   * @type {jQuery}
   * @public
   */
  get$node() {
    return this._$node;
  }

  /**
   * Set attribute value by its JSON representation
   * @param json
   */
  setValueFromJSON(json) {
    this._value.setValueFromJSON(json?.value);
  }

  /**
   * Get attribute value as JSON
   */
  toJSON() {
    const json = AbstractAttribute.prototype.toJSON.call(this);
    json.value = this._value.toJSON();
    return json;
  }
  registerYType() {
    _value.registerYType();
  }
}
