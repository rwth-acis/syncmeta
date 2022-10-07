define([
  "jqueryui",
  "jsplumb",
  "lodash",
  "iwcw",
  "canvas_widget/AbstractValue",
  "canvas_widget/AbstractAttribute",
  "operations/ot/ValueChangeOperation",
  "operations/non_ot/ActivityOperation",
  "text!templates/canvas_widget/multi_line_value.html",
], /** @lends MultiLineValue */ function (
  $,
  jsPlumb,
  _,
  IWCW,
  AbstractValue,
  AbstractAttribute,
  ValueChangeOperation,
  ActivityOperation,
  multiLineValueHtml
) {
  MultiLineValue.prototype = new AbstractValue();
  MultiLineValue.prototype.constructor = MultiLineValue;
  /**
   * MultiLineValue
   * @class canvas_widget.MultiLineValue
   * @extends canvas_widget.AbstractValue
   * @memberof canvas_widget
   * @constructor
   * @param {string} id Entity identifier
   * @param {string} name Name of attribute
   * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
   * @param {canvas_widget.AbstractNode|canvas_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
   */
  function MultiLineValue(id, name, subjectEntity, rootSubjectEntity) {
    var that = this;

    var _ytext = null;
    if (window.hasOwnProperty("y")) {
      if (rootSubjectEntity.getYMap().has(id) != -1)
        _ytext = rootSubjectEntity.getYMap().get(id);
      else _ytext = rootSubjectEntity.getYMap().set(id, new Y.Text());
    }

    AbstractValue.call(this, id, name, subjectEntity, rootSubjectEntity);

    /**
     * MultiLineValue
     * @type {string}
     * @private
     */
    var _value = "";

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(multiLineValueHtml)({ value: _value }));

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

    /**
     * Propagate a Value Change Operation to the remote users and the local widgets
     * @param {operations.ot.ValueChangeOperation} operation
     */
    var propagateValueChangeOperation = function (operation) {
      operation.setEntityIdChain(getEntityIdChain());
      operation.setRemote(false);
      that.setValue(operation.getValue());
      operation.setRemote(true);
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
            value: _value,
            subjectEntityName: that.getSubjectEntity().getName(),
            rootSubjectEntityType: that.getRootSubjectEntity().getType(),
            rootSubjectEntityId: that.getRootSubjectEntity().getEntityId(),
          }
        ).toNonOTOperation()
      );

      /*if(that.getRootSubjectEntity().getYMap()){
                that.getRootSubjectEntity().getYMap().set(that.getEntityId(),operation.toJSON());
            }*/
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
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.getOTOperation()
      );
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
      }
    };

    /**
     * Set value
     * @param {string} value
     */
    this.setValue = function (value) {
      _value = value;
      _$node.text(value);
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
      _iwcw.registerOnDataReceivedCallback(localValueChangeCallback);
      //_iwcw.registerOnHistoryChangedCallback(historyValueChangeCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      _iwcw.unregisterOnDataReceivedCallback(localValueChangeCallback);
      //_iwcw.unregisterOnHistoryChangedCallback(historyValueChangeCallback);
    };

    this.registerYType = function () {
      _ytext.bind(_$node[0]);

      if (that.getValue() !== _ytext.toString()) {
        if (_ytext.toString().length > 0)
          _ytext.delete(0, _ytext.toString().length - 1);
        _ytext.insert(0, that.getValue());
      }

      _ytext.observe(function (event) {
        _value = _ytext.toString();

        //TODO i can not find out who triggered the delete :-(. Therefore do this only for non delete event types
        if (event.type !== "delete") {
          const userMap = y.getMap("users");
          var jabberId = userMap.get(event.object._content[event.index].id[0]);
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
                that.getRootSubjectEntity().getLabel().getValue().getValue()
              ),
              {
                value: "",
                subjectEntityName: that.getSubjectEntity().getName(),
                rootSubjectEntityType: that.getRootSubjectEntity().getType(),
                rootSubjectEntityId: that.getRootSubjectEntity().getEntityId(),
              }
            )
          );
        }
      });
    };

    if (_iwcw) {
      that.registerCallbacks();
    }
  }

  return MultiLineValue;
});
