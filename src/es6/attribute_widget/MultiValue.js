import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import AbstractValue from "./AbstractValue";
import loadHTML from "../html.template.loader";
import Quill from "quill/dist/quill";

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
export class Value extends AbstractValue {
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
  /**
   * References to the Quill editors
   * each editor is a Quill instance
   * each editor
   * @private
   */
  _$editorRefs = {};

  _id = null;

  constructor(id, name, subjectEntity, rootSubjectEntity) {
    super(id, name, subjectEntity, rootSubjectEntity);
    this._id = id;
    this._$node = $(
      _.template(
        `<ul></ul> <br/>
         <button type="button" class="btn btn-success"><i class="bi bi-plus-circle-fill"></i></button>`
      )()
    );
    this._$node.find("button").on("click", () => {
      this.createEditor();
    });
  }

  createEditor() {
    const editorCount = Object.keys(this._$editorRefs).length;
    const editorId = sanitizeValue(
      "editor-" + this._id + "-" + editorCount
    ).toLowerCase();
    const editorContainer = $(
      _.template(quillEditorHtml)({ id: editorId })
    ).get(0);

    const _$editorRef = new Quill(editorContainer, {
      theme: "snow",
      modules: {
        toolbar: false, // Snow includes toolbar by default
      },
      cursors: false,
      placeholder: this.name,
    });
    this._$editorRefs.push(_$editorRef);
    this._ytext.delete(0, this._ytext.length);
    this._ytext.insert(0, this.serialize());

    const $editorNode = $(
      _.template(
        `<li class="input-group">  <button class="btn btn-danger"> <i class="bi bi-trash"></i> </button></li>`
      )()
    );
    $editorNode.find(".input-group").prepend(editorContainer);

    $editorNode.find("button").on("click", () => {
      this.deleteEditor(editorId);
    });
    this._$node.find("ul").append(editorContainer);
  }

  deleteEditor(editorId) {
    this._$editorRefs = this._$editorRefs.filter(
      (editorRef) => editorRef.id !== editorId
    );
    this._$node.find(`#${editorId}`).remove();
    this._ytext.delete(0, this._ytext.length);
    this._ytext.insert(0, this.serialize());
  }

  /**
   * Set value
   * @param {string} value
   */
  setValue(value) {
    this._value = value;
    this._ytext.delete(0, this._ytext.length);
    this._ytext.insert(0, this.serialize());
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
      Object.entries(editorContents).forEach(([key, value]) => {
        this._$editorRefs[key].setText(value);
      });
    });

    this._$editorRefs.forEach((editorRef) => {
      // observe changes to the editor (user input) and update the YText
      editorRef.on("text-change", (delta, oldDelta, source) => {
        if (source === "user") {
          this._value = this.serialize();
          this._ytext.delete(0, this._ytext.length);
          this._ytext.insert(0, this._value);
        }
      });
    });
  }
  serialize() {
    const quillContents = {};
    for (const _editor of this._$editorRefs) {
      const text = _editor.getText();
      quillContents[_editor.id] = text;
    }
    return JSON.stringify(quillContents);
  }
  deserialize(jsonString) {
    return JSON.parse(jsonString);
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
