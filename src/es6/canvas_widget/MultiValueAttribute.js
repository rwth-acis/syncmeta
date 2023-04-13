import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import AbstractAttribute from "./AbstractAttribute";
import { Value } from "./Manager";
import loadHTML from "../html.template.loader";

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
   * @type {canvas_widget.Value}
   * @private
   */
  _values = [];
  /**
   * jQuery object of DOM node representing the node
   * @type {jQuery}
   * @private
   */
  _$node = null;

  constructor(id, name, subjectEntity) {
    super(id, name, subjectEntity);

    this._values.push(new Value(id, name, this, this.getRootSubjectEntity()));

    this._$node = $(_.template(multiValueAttributeHtml)({ id: id }));

    this._$node.find(".name").text(this.getName());
    this._values.forEach((value) => {
      this._$node.find(".canvas_value_list").append(value.get$node());
    });

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
    this._values = value;
  }

  /**
   * Get Value object of value
   * @returns {canvas_widget.Value}
   */
  getValue() {
    return null;
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
    this._values.forEach((value) => {
      value.setValueFromJSON(json?.value);
    });
  }
}
