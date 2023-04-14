import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import AbstractValue from "./AbstractValue";
import loadHTML from "../html.template.loader";
import Quill from "quill/dist/quill";
import { QuillBinding } from "y-quill";
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
export class MultiValue extends AbstractValue {
  /**
   * YMap
   * @type {YMap}
   * @private
   */
  _ymap = null;
  /**
   * Value
   * @type {string}
   * @private
   */
  _value = {};
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
          <div class="d-flex ms-auto">
            <button type="button" class="btn btn-primary add"><i class="bi bi-plus-circle-fill"></i></button>
          </div>
         </div>`
      )()
    );
    this._$node.find(".add").on("click", () => {
      this.createEditor();
    });
  }

  createEditor(key = null) {
    const editorCount = Object.keys(this._$editorRefs).length;
    const editorId = key
      ? key
      : sanitizeValue("editor" + this._id + editorCount).toLowerCase();
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

    let ytext = this._ymap.get(editorId);
    if (!ytext || !(ytext instanceof YText)) {
      ytext = new YText();
      this._ymap.set(editorId, ytext);
    }
    new QuillBinding(ytext, _$editorRef);
  }

  deleteEditor(editorId) {
    delete this._$editorRefs[editorId];
    this._$node.find(`#${editorId}`).parent().remove();
    this._ymap.delete(editorId);
  }

  /**
   * Set value
   * @param {string} value
   */
  setValue(value) {
    this._value = value;
    for (const [key, val] of Object.entries(value)) {
      if (!(key in this._$editorRefs)) {
        this.createEditor(key);
      }
      this._$editorRefs[key].setText(val);
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

  registerYType(ymap) {
    if (!ymap) {
      throw new Error("YMap is null");
    }
    this._ymap = ymap;

    ymap.forEach((ytext, key) => {
      if (!(key in this._$editorRefs)) {
        this.createEditor(key);
      }
      const editorRef = this._$editorRefs[key];
      new QuillBinding(ytext, editorRef);
      if (this._value[key]) {
        editorRef.setText();
      }
      window.syncmetaLog.initializedYTexts += 1;
      if (window.syncmetaLog.hasOwnProperty(this.getEntityId()))
        window.syncmetaLog.objects[this.getEntityId()] += 1;
      else window.syncmetaLog.objects[this.getEntityId()] = 0;
    });
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
