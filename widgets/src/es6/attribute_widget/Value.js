import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "jquery-ui";
import _ from "lodash-es";
import AbstractValue from "./AbstractValue";
import loadHTML from "../html.template.loader";
const valueHtml = await loadHTML(
  "../../templates/attribute_widget/value.html",
  import.meta.url
);

Value.prototype = new AbstractValue();
Value.prototype.constructor = Value;
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
function Value(id, name, subjectEntity, rootSubjectEntity) {
  var that = this;

  var _ytext = null;

  AbstractValue.prototype.constructor.call(
    this,
    id,
    name,
    subjectEntity,
    rootSubjectEntity
  );

  /**
   * Value
   * @type {string}
   * @private
   */
  var _value = "";

  /**
   * jQuery object of DOM node representing the node
   * @type {jQuery}
   * @private
   */
  var _$node = $(_.template(valueHtml)({ name: name }));

  /**
   * Set value
   * @param {string} value
   */
  this.setValue = function (value) {
    _value = value;
    _$node.val(value);
  };

  /**
   * Get value
   * @returns {string}
   */
  this.getValue = function () {
    return _value;
  };

  /**
   * Get jQuery object of DOM node representing the value
   * @returns {jQuery}
   */
  this.get$node = function () {
    return _$node;
  };

  /**
   * Set value by its JSON representation
   * @param json
   */
  this.setValueFromJSON = function (json) {
    this.setValue(json.value);
  };

  this.getYText = function () {
    return _ytext;
  };

  this.registerYType = function (ytext) {
    _ytext = ytext;
    // _ytext.bind(_$node[0]);

    _ytext.observe(function (event) {
      _value = _ytext.toString();
    });

    //loging
    window.syncmetaLog.initializedYTexts += 1;
    if (window.syncmetaLog.hasOwnProperty(this.getEntityId()))
      window.syncmetaLog.objects[this.getEntityId()] += 1;
    else window.syncmetaLog.objects[this.getEntityId()] = 0;
  };
}

export default Value;
