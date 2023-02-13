import { CONFIG } from "../config";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import IWCW from "../lib/IWCWrapper";
import AbstractValue from "./AbstractValue";
import AbstractAttribute from "./AbstractAttribute";
import ActivityOperation from "../operations/non_ot/ActivityOperation";
import ValueChangeOperation from "../operations/ot/ValueChangeOperation";
import "../lib/jquery/jquery.autoGrowInput";
import { Text as YText } from "yjs";

const valueHtml = await loadHTML(
  "../../templates/canvas_widget/value.html",
  import.meta.url
);

/**
 * Value
 * @class canvas_widget.Value
 * @extends canvas_widget.AbstractValue
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {canvas_widget.AbstractNode|canvas_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
 */
class Value extends AbstractValue {
  value = "";
  constructor(id, name, subjectEntity, rootSubjectEntity, y) {
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN, y);
    var _ytext = null;
    y = y || window.y;
    if (y && id.indexOf("undefined") == -1) {
      const yMap = rootSubjectEntity.getYMap();
      if (!yMap) {
        throw new Error("yMap is undefined");
      }
      if (yMap?.has(id)) {
        _ytext = rootSubjectEntity.getYMap().get(id);
        if (!(_ytext instanceof YText)) {
          _ytext = new YText();
          rootSubjectEntity.getYMap().set(id, _ytext);
        }
      } else {
        _ytext = new YText();
        rootSubjectEntity.getYMap().set(id, _ytext);
      }
    }
    super(id, name, subjectEntity, rootSubjectEntity);
    var that = this;
    /**
     * Value
     * @type {string}
     * @private
     */
    var _value = "";
    this.value = _value;
    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(valueHtml)({ name: name }));

    /**
     * Get chain of entities the attribute is assigned to
     * @returns {string[]}
     */
    var getEntityIdChain = function () {
      var chain = [that.getEntityId()],
        entity = that;
      while (entity instanceof AbstractAttribute) {
        chain.unshift(entity.getSubjectEntity().getEntityId());
        entity = entity.getSubjectEntity();
      }
      return chain;
    };

    /**
     * Set value
     * @param {string} value
     */
    this.setValue = function (value) {
      _value = value;
      _$node.val(value).trigger("blur");

      if (_ytext) {
        if (value !== _ytext.toString()) {
          if (_ytext.toString().length > 0)
            _ytext.delete(0, _ytext.toString().length);
          _ytext.insert(0, value);
        }
      }
      this.value = _ytext.toString();
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
     * Get JSON representation of the edge
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractValue.prototype.toJSON.call(this);
      json.value = _value;
      return json;
    };

    /**
     * Set value by its JSON representation
     * @param json
     */
    this.setValueFromJSON = function (json) {
      this.setValue(json.value);
    };

    this.registerYType = function () {
      _$node.on("input", function () {
        if (_ytext) {
          if (_$node.val() !== _ytext.toString()) {
            if (_ytext.toString().length > 0)
              _ytext.delete(0, _ytext.toString().length);
            _ytext.insert(0, _$node.val());
          }
        }
      });
      // _ytext.bind(_$node[0]);
      if (that.getValue() !== _ytext.toString()) {
        if (_ytext.toString().length > 0)
          _ytext.delete(0, _ytext.toString().length - 1);
        _ytext.insert(0, that.getValue());
      }
      _ytext.observe(function (event) {
        _value = _ytext.toString().replace(/\n/g, "");
        that.setValue(_value);
      });

      _ytext.observe(
        _.debounce(function (event) {
          event.keysChanged.forEach((key) => {
            if (key !== "delete") {
              const userMap = y.getMap("users");
              var jabberId = userMap.get(
                event.object._content[event.index].id[0]
              );
              if (jabberId === _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]) {
                $("#save").click();
                const activityMap = y.getMap("activity");
                activityMap.set(
                  ActivityOperation.TYPE,
                  new ActivityOperation(
                    "ValueChangeActivity",
                    that.getEntityId(),
                    jabberId,
                    ValueChangeOperation.getOperationDescription(
                      that.getSubjectEntity().getName(),
                      that.getRootSubjectEntity().getType(),
                      that
                        .getRootSubjectEntity()
                        .getLabel()
                        .getValue()
                        .getValue()
                    ),
                    {
                      value: _value,
                      subjectEntityName: that.getSubjectEntity().getName(),
                      rootSubjectEntityType: that
                        .getRootSubjectEntity()
                        .getType(),
                      rootSubjectEntityId: that
                        .getRootSubjectEntity()
                        .getEntityId(),
                    }
                  ).toJSON()
                );
              } else {
                //I don't know who deleted here, so everyone saves  the current state for now
                $("#save").click();
              }
            }
          });
        }, 500)
      );
    };

    this.getYText = function () {
      return _ytext;
    };

    //automatically determines the size of input
    _$node
      .autoGrowInput({
        comfortZone: 10,
        minWidth: 40,
        maxWidth: 1000,
      })
      .trigger("blur");
  }
}

export default Value;
