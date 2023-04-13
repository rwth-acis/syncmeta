import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import AbstractAttribute from "./AbstractAttribute";
import Value from "./Value";
import loadHTML from "../html.template.loader";

const singleValueAttributeHtml = await loadHTML(
  "../../templates/attribute_widget/multi_value_attribute.html",
  import.meta.url
);

/**
 * MultiValueAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
export class MultiValueAttribute extends AbstractAttribute {
  /***
   * Value object of value
   * @type {attribute_widget.Value}
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

    this._$node = $(_.template(singleValueAttributeHtml)({ id: id }));

    this._$node.find("attribute_name").text(this.getName());
    this._values.forEach((value) => {
      const newEntry = $(
        _.template(`
                    <li class="attribute_key_value_attribute input-group mb-3">
                      <div class="attribute_value">
                      </div>
                      <button type="button" class="btn btn-danger">
                        <i class="bi bi-trash-fill"></i>
                      </button>
                    </li>
                    <hr />
                  `)()
      );
      newEntry.find(".attribute_value").append(value.get$node());
      this._$node.find(".attribute_value_list").append(newEntry);
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
   * @param {attribute_widget.Value} value
   */
  setValues(value) {
    this._values = value;
  }

  /**
   * Get Value object of value
   * @returns {attribute_widget.Value}
   */
  getValues() {
    return this._values;
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
