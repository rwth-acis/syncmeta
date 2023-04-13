import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import AbstractValue from "./AbstractValue";

/**
 * Value
 * @class attribute_widget.Value
 * @extends attribute_widget.AbstractValue
 * @memberof attribute_widget
 * @constructor
 * @param {string} id Entity identifier
 * @param {string} name Name of attribute
 * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {attribute_widget.AbstractNode|attribute_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
 */
export class MultiValue extends AbstractValue {
  /**
   * YText
   * @type {YText}
   * @private
   */
  _ytext = null;
  /**
   * Value
   * @type {string}
   * @private
   */
  _value = "";
  /**
   * jQuery object of DOM node representing the node
   * @type {jQuery}
   * @private
   */
  _$node = null;

  _id = null;

  constructor(id, name, subjectEntity, rootSubjectEntity) {
    super(id, name, subjectEntity, rootSubjectEntity);
    this._id = id;
    this._$node = $(_.template(`<ul></ul>`)());
  }

  /**
   * Set value
   * @param {string} value
   */
  setValue(value) {
    this._value = value;
    const json = this.deserialize(this._value);
    for (const value of Object.values(json)) {
      this._$node.append($(`<li>${value}</li>`));
    }
  }

  /**
   * Get value
   * @returns {string}
   */
  getValue() {
    return this._value;
  }

  /**
   * Get jQuery object of DOM node representing the value
   * @returns {jQuery}
   */
  get$node() {
    return this._$node;
  }

  /**
   * Set value by its JSON representation
   * @param json
   */
  setValueFromJSON(json) {
    if (json === null || json === undefined) {
      return;
    }
    this.setValue(json?.value);
  }

  getYText = function () {
    return this._ytext;
  };

  registerYType(ytext) {
    if (!ytext) {
      throw new Error("YText is null");
    }
    this._ytext = ytext;

    this._ytext.observe((event) => {
      this._value = _ytext.toString().trim();
      const editorContents = this.deserialize(this._value); // { "editor-1": "Hello", "editor-2": "World" }
      this.setValue(editorContents);
    });
  }

  deserialize(jsonString) {
    if (!jsonString || jsonString === "") {
      return {};
    }
    return JSON.parse(jsonString);
  }
  toJSON() {
    const json = AbstractValue.prototype.toJSON.call(this);
    json.value = this._ytext?.toString().trim() || "";
    return json;
  }
}
