import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "jquery-ui";
import _ from "lodash-es";
import AbstractAttribute from "./AbstractAttribute";
import ColorValue from "./ColorValue";
import loadHTML from "../html.template.loader";
const singleColorValueAttributeHtml = await loadHTML(
  "../../templates/attribute_widget/single_value_attribute.html",
  import.meta.url
);

/**
 * SingleColorValueAttribute
 * @class attribute_widget.SingleColorValueAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
class SingleColorValueAttribute extends AbstractAttribute {
  constructor(id, name, subjectEntity) {
    super(id, name, subjectEntity);

    /***
     * Value object of value
     * @type {attribute_widget.ColorValue}
     * @private
     */
    var _value = new ColorValue(id, name, this, this.getRootSubjectEntity());

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(singleColorValueAttributeHtml)({ id: id }));

    /**
     * Set Value object of value
     * @param {attribute_widget.ColorValue} value
     */
    this.setValue = function (value) {
      _value = value;
    };

    /**
     * Get Value object of value
     * @returns {attribute_widget.ColorValue}
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
}

export default SingleColorValueAttribute;
