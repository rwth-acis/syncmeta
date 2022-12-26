import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import IWCW from "../lib/IWCWrapper";
import AbstractValue from "./AbstractValue";
import ValueChangeOperation from "../operations/ot/ValueChangeOperation";
import loadHTML from "../html.template.loader";

const booleanValueHtml = await loadHTML(
  "../../templates/attribute_widget/boolean_value.html",
  import.meta.url
);
import { CONFIG } from "../config";


/**
 * BooleanValue
 * @class attribute_widget.BooleanValue
 * @extends attribute_widget.AbstractValue
 * @memberof attribute_widget
 * @param {string} id Entity identifier
 * @param {string} name Name of attribute
 * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {attribute_widget.AbstractNode|attribute_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
 * @param {Object} options Selection options
 * @constructor
 */
class BooleanValue extends AbstractValue {
  constructor(id, name, subjectEntity, rootSubjectEntity, options) {
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
    var _$node = $(
      _.template(booleanValueHtml)({
        name: name,
        options: options,
        value: _value,
      })
    );

    /**
     * Inter widget communication wrapper
     * @type {Object}
     * @private
     */
    var _iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

    /**
     * Apply a Value Change Operation
     * @param {operations.ot.ValueChangeOperation} operation
     */
    var processValueChangeOperation = function (operation) {
      that.setValue(operation.getValue());
    };

    /**
     * Propagate a Value Change to the remote users and the local widgets
     * @param type Type of the update (CONFIG.OPERATION.TYPE.INSERT,DELETE)
     * @param value Char that was inserted or deleted
     * @param position Position the change took place
     */
    var propagateValueChange = function (type, value) {
      var operation = new ValueChangeOperation(
        that.getEntityId(),
        value,
        type,
        null,
        _iwc.getUser()[CONFIG.NS.PERSON.JABBERID]
      );
      propagateValueChangeOperation(operation);
    };
    /**
     * Propagate a Value Change Operation to the remote users and the local widgets
     * @param {operations.ot.ValueChangeOperation} operation
     */
    var propagateValueChangeOperation = function (operation) {
      processValueChangeOperation(operation);
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(rootSubjectEntity.getEntityId());
      if (ymap) {
        var json = operation.toJSON();
        json.userId = _iwc.getUser()[CONFIG.NS.PERSON.JABBERID];
        ymap.set(that.getEntityId(), json);
      }
    };

    /**
     * Callback for a Value Change Operation
     * @param {operations.ot.ValueChangeOperation} operation
     */
    var valueChangeCallback = function (operation) {
      if (
        operation instanceof ValueChangeOperation &&
        operation.getEntityId() === that.getEntityId()
      ) {
        processValueChangeOperation(operation);
      }
    };

    var init = function () {
      _$node.off();
      _$node.change(function () {
        propagateValueChange(CONFIG.OPERATION.TYPE.UPDATE, this.checked, 0);
      });
    };

    /**
     * Set value
     * @param {boolean} value
     */
    this.setValue = function (value) {
      _value = value;
      _$node.prop("checked", value);
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
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      _iwc.registerOnDataReceivedCallback(valueChangeCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      _iwc.unregisterOnDataReceivedCallback(valueChangeCallback);
    };

    this.setValueFromJSON = function (json) {
      this.setValue(json.value);
    };

    init();

    if (_iwc) {
      that.registerCallbacks();
    }
  }
}

export default BooleanValue;
