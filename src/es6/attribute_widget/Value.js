import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import AbstractValue from "./AbstractValue";
import loadHTML from "../html.template.loader";
import { QuillBinding } from "y-quill";
import Quill from "quill/dist/quill";
import { Text as YText } from "yjs";

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
  quillBinding;
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

    let editorId = sanitizeValue("editor-" + id);
    editorId = editorId.toLowerCase();
    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(quillEditorHtml)({ id: editorId }));

    var _$editorRef = new Quill(_$node.get(0), {
      theme: "snow",
      modules: {
        toolbar: false, // Snow includes toolbar by default
      },
      cursors: false,
      placeholder: name,
    });

    /**
     * Set value
     * @param {string} value
     */
    this.setValue = function (value) {
      _value = value;
    };

    this.setEditorValue = function (value) {
      if (_$editorRef.getText() !== value) _$editorRef.setText(value);
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
      if (json === null || json === undefined) {
        return;
      }
      this.setValue(json?.value);
    };

    this.getYText = function () {
      return _ytext;
    };

    this.registerYType = (ytext) => {
      if (!ytext) {
        throw new Error("YText not found");
      }
      if (!(ytext instanceof YText)) {
        throw new Error("YText is not a Yjs YText");
      }
      if (_ytext) {
        console.warn("ytext already registered");
        return;
      }
      _ytext = ytext;
      this.quillBinding = new QuillBinding(
        _ytext,
        _$editorRef,
        window.yjsConnection.websocketProvider.awareness
      );
      //loging
      window.syncmetaLog.initializedYTexts += 1;
      if (window.syncmetaLog.hasOwnProperty(this.getEntityId()))
        window.syncmetaLog.objects[this.getEntityId()] += 1;
      else window.syncmetaLog.objects[this.getEntityId()] = 0;
    };

    window.onbeforeunload = () => {
      if (_ytext) {
        _ytext.unobserve();
      }
    };
  }
}

/**
 * transforms value such that spaces are removed, html tags are sanitized and [] are replaced by ()
 * @param {*} value
 * @returns sanitized value
 */
function sanitizeValue(value) {
  return value
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/ /g, "-")
    .replace("[", "(")
    .replace("]", ")");
}

export default Value;
