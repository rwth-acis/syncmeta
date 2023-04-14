import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import AbstractValue from "./AbstractValue";
import { Map as YMap, YMapEvent, YTextEvent } from "yjs";

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

  _id = null;

  constructor(id, name, subjectEntity, rootSubjectEntity, y = null) {
    super(id, name, subjectEntity, rootSubjectEntity);
    this._id = id;
    this._$node = $(_.template(`<ul></ul>`)());
    y = y || window.y;
    if (!y) throw new Error("y is undefined");

    const yMap = rootSubjectEntity.getYMap();
    if (!yMap) {
      throw new Error("yMap of rootSubjectEntity is undefined");
    }
    y.transact(() => {
      if (!yMap?.has(id) || !(yMap.get(id) instanceof YMap)) {
        this._ymap = new YMap();
        yMap.set(id, this._ymap);
      } else {
        this._ymap = yMap.get(id);
      }
      yMap.set("modifiedBy", window.y.clientID);
    });
  }

  /**
   * Set value
   * @param {string} value
   */
  setValue(value) {
    if (!value) {
      return;
    }
    this._value = value;
    for (const [key, val] of Object.entries(value)) {
      // clear the list
      this._$node.empty();
      // reconstruct the list
      this._$node.append(
        $(_.template(`<li><%= key %>: <%= value %></li>`)({ key, value: val }))
      );
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

  registerYType() {
    if (!this._ymap) {
      throw new Error("YMap is null");
    }

    this._ymap.observeDeep(([event]) => {
      if (event instanceof YTextEvent) {
        // case where a value in one of the YText is updated
        const editorId = event.path[0];
        const value = event.target.toString().trim();
        // update the value
        this._value[editorId] = value;
        // update the list item
        this._$node
          .find(`li:contains(${editorId})`)
          .text(`${editorId}: ${value}`);
      } else if (event instanceof YMapEvent) {
        // case where a value is added, deleted or updated
        Array.from(event.changes.keys.entries()).forEach(
          ([key, { action }]) => {
            const value = event.target.get(key);
            // update the value
            this._value[key] = value;
            switch (action) {
              case "add":
                // add the new list item
                this._$node.append(
                  $(
                    _.template(`<li><%= key %>: <%= value %></li>`)({
                      key,
                      value,
                    })
                  )
                );
                break;
              case "delete":
                this._$node.find(`li:contains(${key})`).remove();
                break;

              case "update":
                this._$node
                  .find(`li:contains(${key})`)
                  .text(`${key}: ${value}`);
                break;
              default:
                break;
            }
          }
        );
      }
    });
  }

  toJSON() {
    const json = AbstractValue.prototype.toJSON.call(this);
    json.value = {};
    for (const [key, ytext] of this._ymap) {
      json.value[key] = ytext.toString().trim();
    }
    return json;
  }
}
