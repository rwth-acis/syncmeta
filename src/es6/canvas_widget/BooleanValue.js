import { CONFIG } from "../config";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import IWCW from "../lib/IWCWrapper";
import AbstractValue from "./AbstractValue";
import AbstractAttribute from "./AbstractAttribute";
import ValueChangeOperation from "../operations/ot/ValueChangeOperation";
import ActivityOperation from "../operations/non_ot/ActivityOperation";
import { EntityManagerInstance } from "./Manager";
import loadHTML from "../html.template.loader";

let booleanValueHtml = await loadHTML(
  "../../templates/canvas_widget/boolean_value.html",
  import.meta.url
);
const attributeBooleanValueHtml = await loadHTML(
  "../../templates/attribute_widget/boolean_value.html",
  import.meta.url
);

/**
 * BooleanValue
 * @class canvas_widget.BooleanValue
 * @extends canvas_widget.AbstractValue
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {canvas_widget.AbstractNode|canvas_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
 */
class BooleanValue extends AbstractValue {
  constructor(id, name, subjectEntity, rootSubjectEntity, useAttributeHtml) {
    if (useAttributeHtml) booleanValueHtml = attributeBooleanValueHtml;

    super(id, name, subjectEntity, rootSubjectEntity);
    var that = this;
    /**
     * Value
     * @type {boolean}
     * @private
     */
    var _value = false;

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(booleanValueHtml)({ value: _value }));

    /**
     * Inter widget communication wrapper
     * @type {Object}
     * @private
     */
    y = y || window.y;
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN, y);

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
     * Apply a Value Change Operation
     * @param {operations.ot.ValueChangeOperation} operation
     */
    var processValueChangeOperation = function (operation) {
      that.setValue(operation.getValue());
    };

    var init = function () {
      _$node.off();
    };

    /**
     * Set value
     * @param {boolean} value
     */
    this.setValue = function (value) {
      _value = value;
      if (useAttributeHtml) _$node.prop("checked", value);
      else _$node.text(value);
    };

    /**
     * Get value
     * @returns {boolean}
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
      that
        .getRootSubjectEntity()
        .getYMap()
        .observe(function (event) {
          const array = Array.from(event.changes.keys.entries());
          array.forEach(function ([key, change]) {
            if (change.action !== "update" || key !== that.getEntityId()) {
              return;
            }
            const map = event.currentTarget.get(key);
            const json = map;

            var operation = new ValueChangeOperation(
              json.entityId,
              json.value,
              json.type,
              json.position,
              json.jabberId
            );
            _iwcw.sendLocalOTOperation(
              CONFIG.WIDGET.NAME.GUIDANCE,
              operation.getOTOperation()
            );
            processValueChangeOperation(operation);

            //Only the local user Propagates the activity
            if (
              _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] ===
              operation.getJabberId()
            ) {
              EntityManagerInstance.saveState();
              const activityMap = y.getMap("activity");
              activityMap.set(
                ActivityOperation.TYPE,
                new ActivityOperation(
                  "ValueChangeActivity",
                  that.getEntityId(),
                  _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
                  ValueChangeOperation.getOperationDescription(
                    that.getSubjectEntity().getName(),
                    that.getRootSubjectEntity().getType(),
                    that.getRootSubjectEntity().getLabel().getValue().getValue()
                  ),
                  {
                    value: operation.getValue(),
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
              //the remote users propagtes the change to their local attribute widget
              //TODO(PENDING): can be replace with yjs as well
              _iwcw.sendLocalOTOperation(
                CONFIG.WIDGET.NAME.ATTRIBUTE,
                operation.getOTOperation()
              );
            }
          });
        });

      window.onbeforeunload = function () {
        that.getRootSubjectEntity().getYMap().unobserve();
      };
    };

    init();
  }
}

export default BooleanValue;
