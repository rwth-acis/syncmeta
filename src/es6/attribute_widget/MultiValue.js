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
        `<div>
          <ul class="p-0"></ul>
          <div class="d-flex justify-content-between">
            <button type="button" class="btn btn-success save">Save</button>
            <button type="button" class="btn btn-primary add"><i class="bi bi-plus-circle-fill"></i></button>
          </div>
         </div>`
      )()
    );
    this._$node.find(".add").on("click", () => {
      this.createEditor();
    });
    this._$node.find(".save").on("click", () => {
      // temporarily show a content saved message
      this._$node.find(".save").text("Saved");
      this._$node.find(".save").prop("disabled", true);
      // adjust the class to btn-info
      this._$node.find(".save").removeClass("btn-success");
      this._$node.find(".save").addClass("btn-info");
      setTimeout(() => {
        this._$node.find(".save").text("Save");
        this._$node.find(".save").prop("disabled", false);
        this._$node.find(".save").removeClass("btn-info");
        this._$node.find(".save").addClass("btn-success");
      }, 1000);
      const value = this.serialize();
      this.setValue(value);
    });
  }

  createEditor() {
    const editorCount = Object.keys(this._$editorRefs).length;
    const editorId = sanitizeValue(
      "editor" + this._id + editorCount
    ).toLowerCase();
    const editorContainer = $(
      _.template(quillEditorHtml)({ id: editorId })
    ).get(0);
    editorContainer.classList.add("flex-fill");

    const _$editorRef = new Quill(editorContainer, {
      theme: "snow",
      modules: {
        toolbar: false, // Snow includes toolbar by default
      },
      cursors: false,
      placeholder: this.name,
    });

    const $editorNode = $(_.template(`<li class="input-group mb-3"></li>`)());
    $editorNode
      .append(editorContainer)
      .append(
        `<button class="btn btn-danger"> <i class="bi bi-trash"></i> </button>`
      );
    $editorNode.find("button").on("click", () => {
      this.deleteEditor(editorId);
    });
    this._$node.find("ul").append($editorNode);

    this._$editorRefs[editorId] = _$editorRef;
    this._ytext.delete(0, this._ytext.length);
    this._ytext.insert(0, this.serialize());
  }

  deleteEditor(editorId) {
    delete this._$editorRefs[editorId];
    this._$node.find(`#${editorId}`).parent().remove();
    this._ytext.delete(0, this._ytext.length);
    this._ytext.insert(0, this.serialize());
  }

  /**
   * Set value
   * @param {string} value
   */
  setValue(value) {
    this._value = value;
    if (!this._ytext) {
      return;
    }
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
    this._value = this._ytext.toString().trim();
    const editors = this.deserialize(this._value);
    Object.entries(editors).forEach(([key, value]) => {
      if (!(key in this._$editorRefs)) {
        this.createEditor();
      }
      this._$editorRefs[key].setText(value);
    });

    this._ytext.observe((event) => {
      this._value = this._ytext.toString().trim();
      const editorContents = this.deserialize(this._value); // { "editor-1": "Hello", "editor-2": "World" }
      Object.entries(editorContents).forEach(([key, value]) => {
        if (!(key in this._$editorRefs)) {
          this.createEditor();
        }
        this._$editorRefs[key].setText(value);
      });
    });
  }
  serialize() {
    const quillContents = {};
    for (const [key, _editor] of Object.entries(this._$editorRefs)) {
      const text = _editor.getText().trim();
      quillContents[key] = text;
    }
    return JSON.stringify(quillContents);
  }
  deserialize(jsonString) {
    if (jsonString === "" || jsonString === null || jsonString === undefined) {
      return {};
    }
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
    .replace(/ /g, "")
    .replace("[", "")
    .replace("]", "");
}
