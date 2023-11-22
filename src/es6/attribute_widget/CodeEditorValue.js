import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import IWCW from "../lib/IWCWrapper";
import { CONFIG, getWidgetTagName } from "../config";
import AbstractValue from "./AbstractValue";
import ValueChangeOperation from "../operations/ot/ValueChangeOperation";
import loadHTML from "../html.template.loader";
import Quill from "quill/dist/quill";
import { QuillBinding } from "y-quill";

const quillEditorModalHtml = await loadHTML(
  "../../templates/attribute_widget/editor_modal.html",
  import.meta.url
);

const codeEditorValueHtml = await loadHTML(
  "../../templates/attribute_widget/code_edtior_value.html",
  import.meta.url
);
// import "ace-builds/src-min/ace";

/**
 * CodeEditorValue
 * @class attribute_widget.CodeEditorValue
 * @extends attribute_widget.AbstractValue
 * @memberof attribute_widget
 * @constructor
 * @param {string} id Entity identifier
 * @param {string} name Name of attribute
 * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {attribute_widget.AbstractNode|attribute_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
 */
class CodeEditorValue extends AbstractValue {
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

    var editor = null;

    var init = false;

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(codeEditorValueHtml);

    var bindQuillEditor = function (ytext) {
      if (init) {
        return;
      }
      init = true;
      _ytext = ytext;
      new QuillBinding(_ytext, editor);

      initData(ytext, _value);
    };

    var createYText = function () {
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(rootSubjectEntity.getEntityId());
      if (ymap) {
        var ytext = ymap.get(subjectEntity.getEntityId());
        bindQuillEditor(ytext);
      }
    };

    const tagname = getWidgetTagName(CONFIG.WIDGET.NAME.ATTRIBUTE);
    const editorId = "editor-" + rootSubjectEntity.getEntityId();

    if (editor) {
      this.modal.show();
      // $("#wrapper").hide();
    } else {
      var tpl = $(
        _.template(quillEditorModalHtml)({
          id: editorId,
          title: name,
        })
      );
      this.modal = new bootstrap.Modal(tpl.get(0));

      $(tagname).find(".main-wrapper").append(tpl);
      // $("#wrapper").hide();

      const domElem = tpl.get(0).querySelector("#" + editorId);
      if (!domElem) {
        console.error("domElem not found", domElem);
      }
      // editor language is html
      editor = new Quill(domElem, {
        theme: "snow",
        modules: {
          toolbar: false, // Snow includes toolbar by default
        },
        placeholder: "Paste your SVG code here",

        syntax: true,
      });
      // editor.getSession().setMode("ace/mode/svg");
    }

    // listen to close button
    tpl.find(".btn-close").click(() => {
      this.modal.hide();
    });

    _$node.click(() => {
      createYText();
      this.modal.show();
    });

    /**
     * Inter widget communication wrapper
     * @type {Object}
     * @private
     */
    var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

    /**
           * Propagate a Value Change Operation to the remote users and the local widgets
           * @param {operations.ot.ValueChangeOperation} operation
  
           */
    var propagateValueChangeOperation = function (operation) {
      //processValueChangeOperation(operation);
      iwc.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.MAIN,
        operation.getOTOperation()
      );
    };

    /**
     * Propagate a Value Change to the remote users and the local widgets
     * @param type Type of the update (CONFIG.OPERATION.TYPE.INSERT,DELETE)
     * @param value Char that was inserted or deleted
     * @param position Position the change took place
     */
    var propagateValueChange = function (type, value, position) {
      var operation = new ValueChangeOperation(
        that.getEntityId(),
        value,
        type,
        position
      );
      propagateValueChangeOperation(operation);
    };

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

    var initData = function (ytext, data) {
      if (data) {
        if (data !== ytext.toString()) {
          if (ytext.toString().length > 0)
            ytext.delete(0, ytext.toString().length);
          ytext.insert(0, data);
        }
      } else {
        if (that.getValue() !== ytext.toString()) {
          if (ytext.toString().length > 0)
            ytext.delete(0, ytext.toString().length);
          ytext.insert(0, that.getValue());
        }
      }
    };

    this.getYText = function () {
      return _ytext;
    };

    //init();
  }
}

export default CodeEditorValue;
