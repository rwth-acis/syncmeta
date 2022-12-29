import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import AbstractAttribute from "./AbstractAttribute";
import FileValue from "./FileValue";

import loadHTML from "../html.template.loader";

const fileAttributeHtml = await loadHTML(
  "../../templates/attribute_widget/file_attribute.html",
  import.meta.url
);

/**
 * FileAttribute
 * @class attribute_widget.FileAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options as key value object
 */
class FileAttribute extends AbstractAttribute {
  constructor(id, name, subjectEntity, options) {
    super(id, name, subjectEntity);

    /***
     * Value object of value
     * @type {attribute_widget.FileValue}
     * @private
     */
    var _value = new FileValue(
      id,
      name,
      this,
      this.getRootSubjectEntity(),
      options
    );

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(fileAttributeHtml)());

    /**
     * Set Value object of value
     * @param {attribute_widget.FileValue} value
     */
    this.setValue = function (value) {
      _value = value;
    };

    /**
     * Get Value object of value
     * @return {attribute_widget.FileValue} value
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
     * @param {Object} json
     */
    this.setValueFromJSON = function (json) {
      _value.setValueFromJSON(json.value);
    };

    _$node.find(".name").text(this.getName());
    _$node.find(".attribute_value").append(_value.get$node());
  }
}

export default FileAttribute;
