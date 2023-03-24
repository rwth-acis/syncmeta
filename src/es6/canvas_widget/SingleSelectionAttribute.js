import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import AbstractAttribute from "./AbstractAttribute";
import { SelectionValue } from "./Manager";
import loadHTML from "../html.template.loader";

const singleSelectionAttributeHtml = await loadHTML(
  "../../templates/canvas_widget/single_selection_attribute.html",
  import.meta.url
);

/**
 * SingleSelectionAttribute
 * @class canvas_widget.SingleSelectionAttribute
 * @extends canvas_widget.AbstractAttribute
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options as key value object
 */

class SingleSelectionAttribute extends AbstractAttribute {
  constructor(id, name, subjectEntity, options, useAttributeHtml) {
    super(id, name, subjectEntity);
    useAttributeHtml =
      typeof useAttributeHtml !== "undefinded" ? useAttributeHtml : false;
    var that = this;
    /***
     * Value object of value
     * @type {canvas_widget.SelectionValue}
     * @private
     */
    var _value = new SelectionValue(
      id,
      name,
      this,
      this.getRootSubjectEntity(),
      options,
      useAttributeHtml
    );

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(singleSelectionAttributeHtml)());

    /**
     * Set Value object of value
     * @param {canvas_widget.SelectionValue} value
     */
    this.setValue = function (value) {
      _value = value;
      _$node.val(value);
    };

    /**
     * Get Value object of value
     * @return {canvas_widget.SelectionValue} value
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
     * Get the options object for the Attribute
     * @returns {Object}
     */
    this.getOptionValue = function () {
      return options.hasOwnProperty(_value.getValue())
        ? options[_value.getValue()]
        : null;
    };

    /**
     * Get JSON representation of the attribute
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractAttribute.prototype.toJSON.call(this);
      json.value = _value.toJSON();
      json.option = that.getOptionValue();
      return json;
    };

    this.getOptions = function () {
      return options;
    };

    /**
     * Set attribute value by its JSON representation
     * @param {Object} json
     */
    this.setValueFromJSON = function (json) {
      _value.setValueFromJSON(json.value);
    };

    _$node.find(".name").text(this.getName());
    _$node.find(".value").append(_value.get$node());
  }
}

export default SingleSelectionAttribute;
