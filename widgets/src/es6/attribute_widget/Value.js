import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import AbstractValue from "./AbstractValue";
import loadHTML from "../html.template.loader";
import { QuillBinding } from "y-quill";

const quillEditorHtml = await loadHTML(
  "../../templates/attribute_widget/quill_editor.html",
  import.meta.url
);

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
class Value extends AbstractValue {
  constructor(id, name, subjectEntity, rootSubjectEntity) {
    super(id, name, subjectEntity, rootSubjectEntity);
    var that = this;

    var _ytext = null;

    /**
     * Value
     * @type {string}
     * @private
     */
    var _value = "";

    let editorId = name.replace(/ /g, "-");
    editorId = editorId.toLowerCase();
    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(quillEditorHtml)({ id: editorId }));

    var _$editorRef;

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
      setTimeout(() => {
        _ytext = ytext;

        // if (!$editor) {
        //   throw new Error("Editor not found " + editorId);
        // }
        const domElem = _$node.get(0);
        _$editorRef = new Quill(domElem, {
          theme: "snow",
          modules: {
            toolbar: false, // Snowincludes toolbar by default
          },
          placeholder: name,
        });
        if (!_ytext) {
          throw new Error("YText not found");
        }
        new QuillBinding(_ytext, _$editorRef);
        _ytext?.observe(function () {
          _value = _ytext.toString();
        });

        //loging
        window.syncmetaLog.initializedYTexts += 1;
        if (window.syncmetaLog.hasOwnProperty(this.getEntityId()))
          window.syncmetaLog.objects[this.getEntityId()] += 1;
        else window.syncmetaLog.objects[this.getEntityId()] = 0;
      }, 1000);
    };
  }
}

export default Value;
