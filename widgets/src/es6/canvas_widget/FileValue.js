import $ from "jquery-ui";
import _ from "lodash";
import IWCW from "../lib/IWCWrapper";
import AbstractValue from "./AbstractValue";
import AbstractAttribute from "./AbstractAttribute";
import ValueChangeOperation from "../operations/ot/ValueChangeOperation";
import ActivityOperation from "../operations/non_ot/ActivityOperation";
const fileValueHtml = await loadHTML(
  "../../../html/templates/canvas_widget/file_value.html",
  import.meta.url
);
const attributeFileValueHtml = await loadHTML(
  "../../../html/templates/attribute_widget/file_value.html",
  import.meta.url
);

FileValue.prototype = new AbstractValue();
FileValue.prototype.constructor = FileValue;
/**
 * FileValue
 * @class canvas_widget.FileValue
 * @extends canvas_widget.AbstractValue
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier
 * @param {string} name Name of attribute
 * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {canvas_widget.AbstractNode|canvas_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
 */
function FileValue(
  id,
  name,
  subjectEntity,
  rootSubjectEntity,
  useAttributeHtml
) {
  var that = this;

  if (useAttributeHtml) fileValueHtml = attributeFileValueHtml;

  AbstractValue.call(this, id, name, subjectEntity, rootSubjectEntity);

  /**
   * Value
   * @type {string}
   * @private
   */
  var _value = "";

  /**
   * jQuery object of DOM node representing the node
   * @type {jQuery}
   * @private
   */
  var _$node;

  if (useAttributeHtml) _$node = $(_.template(fileValueHtml)({ name: name }));
  else _$node = $(_.template(fileValueHtml)({ value: _value }));

  var _$selectFile = _$node.find(".select_file");

  var _$manageFile = _$node.find(".manage_file");

  /**
   * Inter widget communication wrapper
   * @type {Object}
   * @private
   */
  var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);

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

  var uploadFile = function (name, type, data) {
    var resourceSpace = new openapp.oo.Resource(openapp.param.space());

    resourceSpace.create({
      relation: openapp.ns.role + "data",
      type: "my:ns:file",
      representation: {
        name: name,
        type: type,
        data: data,
      },
      callback: function (d) {
        if (d.uri) {
          propagateValueChange(CONFIG.OPERATION.TYPE.UPDATE, d.uri, 0);
        }
      },
    });
  };

  /**
   * Apply a Value Change Operation
   * @param {operations.ot.ValueChangeOperation} operation
   */
  var processValueChangeOperation = function (operation) {
    that.setValue(operation.getValue());
  };

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
   * Propagate a Value Change Operation to the remote users and the local widgets
   * @param {operations.ot.ValueChangeOperation} operation
   */
  var propagateValueChangeOperation = function (operation) {
    operation.setEntityIdChain(getEntityIdChain());
    processValueChangeOperation(operation);
    if (_iwcw.sendRemoteOTOperation(operation)) {
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.getOTOperation()
      );
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
            rootSubjectEntityType: that.getRootSubjectEntity().getType(),
            rootSubjectEntityId: that.getRootSubjectEntity().getEntityId(),
          }
        )
      );
    }
  };

  /**
   * Callback for a remote Value Change Operation
   * @param {operations.ot.ValueChangeOperation} operation
   */
  var remoteValueChangeCallback = function (operation) {
    if (
      operation instanceof ValueChangeOperation &&
      operation.getEntityId() === that.getEntityId()
    ) {
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.GUIDANCE,
        operation.getOTOperation()
      );
      processValueChangeOperation(operation);
    }
  };

  /**
   * Callback for a local Value Change Operation
   * @param {operations.ot.ValueChangeOperation} operation
   */
  var localValueChangeCallback = function (operation) {
    if (
      operation instanceof ValueChangeOperation &&
      operation.getEntityId() === that.getEntityId()
    ) {
      propagateValueChangeOperation(operation);
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.GUIDANCE,
        operation.getOTOperation()
      );
    }
  };

  /**
   * Callback for an undone resp. redone Value Change Operation
   * @param {operations.ot.ValueChangeOperation} operation
   */
  var historyValueChangeCallback = function (operation) {
    if (
      operation instanceof ValueChangeOperation &&
      operation.getEntityId() === that.getEntityId()
    ) {
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.getOTOperation()
      );
      processValueChangeOperation(operation);
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.GUIDANCE,
        operation.getOTOperation()
      );
    }
  };

  var init = function () {
    if (!useAttributeHtml) return;

    _$selectFile.find("#file_object").change(function () {
      var files = $(this)[0].files,
        file;

      if (!files || files.length === 0) return;
      file = files[0];
      if (file.size > 1048576) {
        alert("Chosen file is too large. Maximum size: 1MB");
      }
    });

    _$selectFile.find("#file_submit").click(function () {
      var fileReader,
        files = _$selectFile.find("#file_object")[0].files,
        file;

      if (!files || files.length === 0) return;
      file = files[0];

      fileReader = new FileReader();
      fileReader.onload = function (e) {
        uploadFile(file.name, file.type, e.target.result);
      };
      fileReader.readAsDataURL(file);
    });

    _$manageFile.find("#file_delete").click(function () {
      //openapp.resource.del(_value);
      propagateValueChange(CONFIG.OPERATION.TYPE.UPDATE, "", 0);
    });

    _$selectFile.show();
    _$manageFile.hide();
  };

  /**
   * Set value
   * @param {string} value
   */
  this.setValue = function (value) {
    _value = value;
    if (_value === "") {
      _$node.text("");
    } else {
      $.get(_value + "/:representation").done(function (data) {
        _$node.text(data.name);
      });
    }
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

  /**
   * Register inter widget communication callbacks
   */
  this.registerCallbacks = function () {
    //_iwcw.registerOnRemoteDataReceivedCallback(remoteValueChangeCallback);
    _iwcw.registerOnDataReceivedCallback(localValueChangeCallback);
    //_iwcw.registerOnHistoryChangedCallback(historyValueChangeCallback);
  };

  /**
   * Unregister inter widget communication callbacks
   */
  this.unregisterCallbacks = function () {
    //_iwcw.unregisterOnRemoteDataReceivedCallback(remoteValueChangeCallback);
    _iwcw.unregisterOnDataReceivedCallback(localValueChangeCallback);
    //_iwcw.unregisterOnHistoryChangedCallback(historyValueChangeCallback);
  };

  if (_iwcw) {
    that.registerCallbacks();
  }

  init();
}

export default FileValue;
