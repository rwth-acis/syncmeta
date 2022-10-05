define([
  "require",
  "jqueryui",
  "jsplumb",
  "lodash",
  "Util",
  "iwcw",
  "operations/ot/NodeDeleteOperation",
  "operations/ot/NodeMoveOperation",
  "operations/ot/NodeMoveZOperation",
  "operations/ot/NodeResizeOperation",
  "operations/non_ot/ActivityOperation",
  "canvas_widget/AbstractEntity",
  "canvas_widget/SingleValueAttribute",
  "canvas_widget/HistoryManager",
  "text!templates/canvas_widget/abstract_node.html",
  "text!templates/canvas_widget/awareness_trace.html",
  "jquery.transformable-PATCHED",
], /** @lends AbstractNode */ function (
  require,
  $,
  jsPlumb,
  _,
  Util,
  IWCW,
  NodeDeleteOperation,
  NodeMoveOperation,
  NodeMoveZOperation,
  NodeResizeOperation,
  ActivityOperation,
  AbstractEntity,
  SingleValueAttribute,
  HistoryManager,
  abstractNodeHtml,
  awarenessTraceHtml
) {
  AbstractNode.prototype = new AbstractEntity();
  AbstractNode.prototype.constructor = AbstractNode;
  /**
   * AbstractNode
   * @class canvas_widget.AbstractNode
   * @extends canvas_widget.AbstractEntity
   * @memberof canvas_widget
   * @constructor
   * @param {string} id Entity identifier of node
   * @param {string} type Type of node
   * @param {number} left x-coordinate of node position
   * @param {number} top y-coordinate of node position
   * @param {number} width Width of node
   * @param {number} height Height of node
   * @param {boolean} containment containment
   * @param {number} zIndex Position of node on z-axis
   */
  function AbstractNode(
    id,
    type,
    left,
    top,
    width,
    height,
    zIndex,
    containment,
    json
  ) {
    var that = this;

    /**
     * Inter widget communication wrapper
     * @type {Object}
     * @private
     */
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);
    /**y-map instances which belongs to the node
     * @type {Y.Map}
     * @private
     * */
    var _ymap = null;
    if (window.hasOwnProperty("y")) {
      const nodesMap = y.getMap("nodes");
      if (nodesMap.has(id)) {
        _ymap = nodesMap.get(id);
      } else {
        _ymap = nodesMap.set(id, new Y.Map());
        _ymap.set("left", left);
        _ymap.set("top", top);
        _ymap.set("width", width);
        _ymap.set("height", height);
        _ymap.set("zIndex", zIndex);
        _ymap.set("containment", containment);
        _ymap.set("type", type);
        _ymap.set("id", id);
        if (json) _ymap.set("json", json);
        _ymap.set("jabberId", _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
      }
    }
    this.getYMap = function () {
      return _ymap;
    };
    AbstractEntity.call(this, id);

    /**
     * Type of node
     * @type {string}
     * @private
     */
    var _type = type;

    /**
     * Label of edge
     * @type {canvas_widget.SingleValueAttribute}
     * @private
     */
    var _label = new SingleValueAttribute(id + "[label]", "Label", this);

    /**
     * Appearance information of edge
     * @type {{left: number, top: number, width: number, height: number}}
     * @private
     */
    var _appearance = {
      left: left,
      top: top,
      width: width,
      height: height,
      containment: containment,
    };

    /**
     * Position of node on z-axis
     * @type {number}
     * @private
     */
    var _zIndex = zIndex;

    /**
     * Type of node
     * @containment {boolean}
     * @private
     */
    var _containment = containment;

    /**
     * Canvas the node is drawn on
     * @type {canvas_widget.AbstractCanvas}
     * @private
     */
    var _canvas = null;

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(abstractNodeHtml)({ id: id }));

    var _$awarenessTrace = $(
      _.template(awarenessTraceHtml)({ id: id + "_awareness" })
    );

    var _awarenessTimer = setInterval(function () {
      var opacity = _$awarenessTrace.css("opacity");
      opacity -= 0.1;
      if (opacity < 0) opacity = 0;
      _$awarenessTrace.css({
        opacity: opacity,
      });
    }, 3000);

    /**
     * Attributes of node
     * @type {Object}
     * @private
     */
    var _attributes = {};

    /**
     * Stores if node is selected
     * @type {boolean}
     * @private
     */
    var _isSelected = false;

    /**
     * Callback to generate list of context menu items
     * @type {function}
     */
    var _contextMenuItemCallback = function () {
      return {};
    };

    /**
     * Set of ingoing edges
     * @type {Object}
     * @private
     */
    var _ingoingEdges = {};

    /**
     * Set of outgoing edges
     * @type {Object}
     * @private
     */
    var _outgoingEdges = {};

    /**
     * Set of nodes with an edge to the node
     * @type {Object}
     * @private
     */
    var _ingoingNeighbors = {};

    /**
     * Set of nodes with an edge from the node
     * @type {Object}
     * @private
     */
    var _outgoingNeighbors = {};

    var _relatedGhostEdges = [];

    /**
     * Apply a Node Move Operation
     * @param {operations.ot.NodeMoveOperation} operation
     */
    var processNodeMoveOperation = function (operation) {
      _canvas.hideGuidanceBox();
      that.move(operation.getOffsetX(), operation.getOffsetY(), 0);
      _canvas.showGuidanceBox();
    };

    /**
     * Apply a Node Move Z Operation
     * @param {operations.ot.NodeMoveZOperation} operation
     */
    var processNodeMoveZOperation = function (operation) {
      that.move(0, 0, operation.getOffsetZ());
    };

    /**
     * Propagate a Node Move Operation to the remote users and the local widgets
     * @param {operations.ot.NodeMoveOperation} operation
     */
    this.propagateNodeMoveOperation = function (operation) {
      operation.setJabberId(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
      processNodeMoveOperation(operation);
      HistoryManager.add(operation);
      $("#save").click();

      hideTraceAwareness();
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.HEATMAP,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.GUIDANCE,
        operation.getOTOperation()
      );
      const activityMap = y.getMap("activity");
      activityMap.set(
        ActivityOperation.TYPE,
        new ActivityOperation(
          "NodeMoveActivity",
          operation.getEntityId(),
          operation.getJabberId(),
          NodeMoveOperation.getOperationDescription(
            that.getType(),
            that.getLabel().getValue().getValue()
          ),
          { nodeType: that.getType() }
        )
      );

      if (_ymap) {
        _ymap.set(NodeMoveOperation.TYPE, operation.toJSON());
      }
    };

    /**
     * Propagate a Node Move Z Operation to the remote users and the local widgets
     * @param {operations.ot.NodeMoveZOperation} operation
     */
    this.propagateNodeMoveZOperation = function (operation) {
      var jabberId = _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID];
      operation.setJabberId(jabberId);
      processNodeMoveZOperation(operation);
      HistoryManager.add(operation);
      hideTraceAwareness();
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.GUIDANCE,
        operation.getOTOperation()
      );
      const activityMap = y.getMap("activity");
      activityMap.set(
        ActivityOperation.TYPE,
        new ActivityOperation(
          "NodeMoveActivity",
          operation.getEntityId(),
          jabberId,
          NodeMoveOperation.getOperationDescription(
            that.getType(),
            that.getLabel().getValue().getValue()
          ),
          { nodeType: that.getType() }
        )
      );

      if (_ymap) _ymap.set(NodeMoveZOperation.TYPE, operation.toJSON());
    };

    /**
     * Apply a Node Resize Operation
     * @param {operations.ot.NodeResizeOperation} operation
     */
    var processNodeResizeOperation = function (operation) {
      _canvas.hideGuidanceBox();
      that.resize(operation.getOffsetX(), operation.getOffsetY());
      _canvas.showGuidanceBox();
    };

    /**
     * Propagate a Node Resize Operation to the remote users and the local widgets
     * @param {operations.ot.NodeResizeOperation} operation
     */
    this.propagateNodeResizeOperation = function (operation) {
      operation.setJabberId(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
      processNodeResizeOperation(operation);
      HistoryManager.add(operation);
      $("#save").click();
      hideTraceAwareness();
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.HEATMAP,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.GUIDANCE,
        operation.getOTOperation()
      );
      const activityMap = y.getMap("activity");
      activityMap.set(
        ActivityOperation.TYPE,
        new ActivityOperation(
          "NodeResizeActivity",
          operation.getEntityId(),
          operation.getJabberId(),
          NodeResizeOperation.getOperationDescription(
            that.getType(),
            that.getLabel().getValue().getValue()
          ),
          { nodeType: that.getType() }
        )
      );

      if (_ymap) _ymap.set("NodeResizeOperation", operation.toJSON());
    };

    /**
     * Apply a Node Delete Operation
     * @param {operations.ot.NodeDeleteOperation} operation
     */
    var processNodeDeleteOperation = function (operation) {
      var edges = that.getEdges(),
        edgeId,
        edge;

      for (edgeId in edges) {
        if (edges.hasOwnProperty(edgeId)) {
          edge = edges[edgeId];
          edge.remove();
        }
      }

      for (var i = 0; i < _relatedGhostEdges.length; i++) {
        if (typeof _relatedGhostEdges[i].remove == "function")
          _relatedGhostEdges[i].remove();
      }
      if (_ymap) {
        _ymap = null;
      }
      that.remove();
    };

    /**
     * Propagate a Node Delete Operation to the remote users and the local widgets
     * @param {operations.ot.NodeDeleteOperation} operation
     */
    var propagateNodeDeleteOperation = function (operation) {
      processNodeDeleteOperation(operation);
      $("#save").click();
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.GUIDANCE,
        operation.getOTOperation()
      );
      _iwcw.sendLocalOTOperation(
        CONFIG.WIDGET.NAME.HEATMAP,
        operation.getOTOperation()
      );
      const activityMap = y.getMap("activity");
      activityMap.set(
        ActivityOperation.TYPE,
        new ActivityOperation(
          "NodeDeleteActivity",
          operation.getEntityId(),
          _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
          NodeDeleteOperation.getOperationDescription(
            that.getType(),
            that.getLabel().getValue().getValue()
          ),
          {}
        )
      );
    };

    var refreshTraceAwareness = function (color) {
      _$awarenessTrace.css({
        opacity: 1,
        fill: color,
      });
    };

    var hideTraceAwareness = function () {
      _$awarenessTrace.css({
        opacity: 0,
      });
    };

    /**
     * Callback for a remote Node Move Operation
     * @param {operations.ot.NodeMoveOperation} operation
     */
    var remoteNodeMoveCallback = function (operation) {
      if (
        operation instanceof NodeMoveOperation &&
        operation.getEntityId() === that.getEntityId()
      ) {
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.ATTRIBUTE,
          operation.getOTOperation()
        );
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.HEATMAP,
          operation.getOTOperation()
        );
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.GUIDANCE,
          operation.getOTOperation()
        );
        const userMap = y.getMap("users");
        if (userMap.get(y.clientID) !== operation.getJabberId()) {
          const userList = y.getMap("userList");
          var color = Util.getColor(
            userList.get(operation.getJabberId()).globalId
          );
          refreshTraceAwareness(color);
        }

        processNodeMoveOperation(operation);
      }
    };

    /**
     * Callback for a remote Node Move Z Operation
     * @param {operations.ot.NodeMoveZOperation} operation
     */
    var remoteNodeMoveZCallback = function (operation) {
      if (
        operation instanceof NodeMoveZOperation &&
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
        const userMap = y.getMap("users");
        if (userMap.get(y.clientID) !== operation.getJabberId()) {
          const userList = y.getMap("userList");
          var color = Util.getColor(
            userList.get(operation.getJabberId()).globalId
          );
          refreshTraceAwareness(color);
        }
        processNodeMoveZOperation(operation);
      }
    };

    /**
     * Callback for a remote Node Resize Operation
     * @param {operations.ot.NodeResizeOperation} operation
     */
    var remoteNodeResizeCallback = function (operation) {
      if (
        operation instanceof NodeResizeOperation &&
        operation.getEntityId() === that.getEntityId()
      ) {
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.ATTRIBUTE,
          operation.getOTOperation()
        );
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.HEATMAP,
          operation.getOTOperation()
        );
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.GUIDANCE,
          operation.getOTOperation()
        );
        const userMap = y.getMap("users");
        if (userMap.get(y.clientID) !== operation.getJabberId()) {
          const userList = y.getMap("userList");
          var color = Util.getColor(
            userList.get(operation.getJabberId()).globalId
          );
          refreshTraceAwareness(color);
        }
        processNodeResizeOperation(operation);
      }
    };

    /**
     * Callback for a remote Node Delete Operation
     * @param {operations.ot.NodeDeleteOperation} operation
     */
    this.remoteNodeDeleteCallback = function (operation) {
      if (
        operation instanceof NodeDeleteOperation &&
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
        _iwcw.sendLocalOTOperation(
          CONFIG.WIDGET.NAME.HEATMAP,
          operation.getOTOperation()
        );
        processNodeDeleteOperation(operation);
        HistoryManager.clean(operation.getEntityId());
      }
    };

    this.init = function () {
      //Define Node Rightclick Menu
      $.contextMenu({
        selector: "#" + id,
        zIndex: AbstractEntity.CONTEXT_MENU_Z_INDEX,
        build: function ($trigger, e) {
          var menuItems, offsetClick, offsetCanvas;
          var EntityManager = require("canvas_widget/EntityManager");

          offsetClick = $(e.target).offset();
          offsetCanvas = that.getCanvas().get$node().offset();

          if (
            _canvas.getSelectedEntity() === null ||
            _canvas.getSelectedEntity() === that
          ) {
            menuItems = _.extend(_contextMenuItemCallback(), {
              connectTo: EntityManager.generateConnectToMenu(that),
              sepMove: "---------",
              moveToForeground: {
                name: "Move to Foreground",
                callback: function (/*key, opt*/) {
                  that.propagateNodeMoveZOperation(
                    new NodeMoveZOperation(
                      that.getEntityId(),
                      ++AbstractEntity.maxZIndex - _zIndex
                    )
                  );
                },
              },
              moveToBackground: {
                name: "Move to Background",
                callback: function (/*key, opt*/) {
                  that.propagateNodeMoveZOperation(
                    new NodeMoveZOperation(
                      that.getEntityId(),
                      --AbstractEntity.minZIndex - _zIndex
                    )
                  );
                },
              },
              sepDelete: "---------",
              delete: {
                name: "Delete",
                callback: function (/*key, opt*/) {
                  that.triggerDeletion();
                },
              },
              quit: {
                name: " ",
                disabled: true,
              },
            });

            return {
              items: menuItems,
              events: {
                show: function (/*opt*/) {
                  _canvas.select(that);
                },
              },
            };
          } else {
            _canvas.select(null);
            return false;
          }
        },
      });
    };

    /**
     * Triggers jsPlumb's repaint function and adjusts the angle of the edge labels
     */
    var repaint = function () {
      //var edgeId,
      //    edges = that.getEdges();
      jsPlumb.repaint(_$node);
      /*for(edgeId in edges){
             if(edges.hasOwnProperty(edgeId)){
             edges[edgeId].repaintOverlays();
             edges[edgeId].setZIndex();
             }
             }*/
      _.each(require("canvas_widget/EntityManager").getEdges(), function (e) {
        e.setZIndex();
      });
    };

    /**
     * Anchor options for new connections
     * @type {object}
     */
    var _anchorOptions = ["Perimeter", { shape: "Rectangle", anchorCount: 10 }];

    /**
     * Get options for new connections
     * @returns {Object}
     */
    this.getAnchorOptions = function () {
      return _anchorOptions;
    };

    /**
     * Send NodeDeleteOperation for node
     */
    this.triggerDeletion = function (historyFlag) {
      var edgeId,
        edges = this.getEdges(),
        edge;
      _canvas.select(null);
      for (edgeId in edges) {
        if (edges.hasOwnProperty(edgeId)) {
          edge = edges[edgeId];
          edge.triggerDeletion();
        }
      }
      var operation = new NodeDeleteOperation(
        id,
        that.getType(),
        _appearance.left,
        _appearance.top,
        _appearance.width,
        _appearance.height,
        _zIndex,
        _appearance.containment,
        that.toJSON()
      );
      if (_ymap) {
        propagateNodeDeleteOperation(operation);
        const nodesMap = y.getMap("nodes");
        nodesMap.delete(that.getEntityId());
      } else {
        propagateNodeDeleteOperation(operation);
      }
      if (!historyFlag) HistoryManager.add(operation);
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get callback to generate list of context menu items
     * @returns {object}
     */
    this.getContextMenuItemCallback = function () {
      return _contextMenuItemCallback;
    };

    /**
     * Set callback to generate list of context menu items
     * @param {function} contextMenuItemCallback
     */
    this.setContextMenuItemCallback = function (contextMenuItemCallback) {
      if (typeof contextMenuItemCallback === "function") {
        _contextMenuItemCallback = contextMenuItemCallback;
      }
    };

    /**
     * Get node appearance
     * @returns {{left: number, top: number, width: number, height: number}}
     */
    this.getAppearance = function () {
      return _appearance;
    };

    /**
     * Get position of node on z-axis
     * @return {number}
     */
    this.getZIndex = function () {
      return _zIndex;
    };

    this.refreshTraceAwareness = function (color) {
      refreshTraceAwareness(color);
    };

    /**
     * Adds node to canvas
     * @param {canvas_widget.AbstractCanvas} canvas
     */
    this.addToCanvas = function (canvas) {
      _canvas = canvas;
      canvas.get$canvas().append(_$awarenessTrace);
      canvas.get$canvas().append(_$node);
    };

    /**
     * Get associated canvas
     * @returns {canvas_widget.AbstractCanvas}
     */
    this.getCanvas = function () {
      return _canvas;
    };

    /**
     * Removes node from canvas
     */
    this.removeFromCanvas = function () {
      _$node.remove();
      //destroy the context menu
      $.contextMenu("destroy", "#" + that.getEntityId());
      _canvas = null;
      _$awarenessTrace.remove();
      if (this.hasOwnProperty("unregisterCallbacks"))
        this.unregisterCallbacks();
    };

    /**
     * Add attribute to node
     * @param {canvas_widget.AbstractAttribute} attribute
     */
    this.addAttribute = function (attribute) {
      var id = attribute.getEntityId();
      if (!_attributes.hasOwnProperty(id)) {
        _attributes[id] = attribute;
      }
    };

    /**
     * Get attribute by id
     * @param {String} id Attribute's entity id
     * @returns {canvas_widget.AbstractAttribute}
     */
    this.getAttribute = function (id) {
      if (_attributes.hasOwnProperty(id)) {
        return _attributes[id];
      }
      return null;
    };

    /**
     * Delete attribute by id
     * @param {String} id Attribute's entity id
     */
    this.deleteAttribute = function (id) {
      if (_attributes.hasOwnProperty(id)) {
        delete _attributes[id];
      }
    };

    /**
     * Set node's attributes
     * @param {Object} attributes
     */
    this.setAttributes = function (attributes) {
      _attributes = attributes;
    };

    /**
     * Get node's attributes
     * @returns {Object}
     */
    this.getAttributes = function () {
      return _attributes;
    };

    /**
     * Set edge label
     * @param {canvas_widget.SingleValueAttribute} label
     */
    this.setLabel = function (label) {
      _label = label;
    };

    /**
     * Get edge label
     * @returns {canvas_widget.SingleValueAttribute}
     */
    this.getLabel = function () {
      return _label;
    };

    /**
     * Get edge type
     * @returns {string}
     */
    this.getType = function () {
      return _type;
    };

    /**
     * Get edge type
     * @returns {boolean}
     */
    this.getContainment = function () {
      return _containment;
    };

    /**
     * Get jQuery object of DOM node representing the node
     * @returns {jQuery}
     * @private
     */
    this._get$node = function () {
      return _$node;
    };

    /**
     * Apply position and dimension attributes to the node
     * @private
     */
    this._draw = function () {
      //noinspection JSAccessibilityCheck
      _$awarenessTrace.css({
        left: _appearance.left + _appearance.width / 2,
        top: _appearance.top + _appearance.height / 2,
        width: _appearance.width * 1.2,
        height: _appearance.height * 1.2,
        zIndex: _zIndex - 1,
      });
      _$node.css({
        left: _appearance.left,
        top: _appearance.top,
        width: _appearance.width,
        height: _appearance.height,
        zIndex: _zIndex,
      });
    };

    /**
     * Move the node
     * @param {number} offsetX Offset in x-direction
     * @param {number} offsetY Offset in y-direction
     * @param {number} offsetZ Offset in z-direction
     */
    this.move = function (offsetX, offsetY, offsetZ) {
      _appearance.left += offsetX;
      _appearance.top += offsetY;

      _zIndex += offsetZ;

      if (_ymap) {
        _ymap.set("left", _appearance.left);
        _ymap.set("top", _appearance.top);
        _ymap.set("zIndex", _zIndex);
      }
      this._draw();
      repaint();
    };

    this.moveAbs = function (left, top, zIndex) {
      _appearance.left = left;
      _appearance.top = top;

      if (zIndex) _zIndex = zIndex;

      if (_ymap) {
        _ymap.set("left", _appearance.left);
        _ymap.set("top", _appearance.top);
        if (zIndex) _ymap.set("zIndex", _zIndex);
      }
      this._draw();
      repaint();
    };

    /**
     * Resize the node
     * @param {number} offsetX Offset in x-direction
     * @param {number} offsetY Offset in y-direction
     */
    this.resize = function (offsetX, offsetY) {
      _appearance.width += offsetX;
      _appearance.height += offsetY;
      if (_ymap) {
        _ymap.set("width", _appearance.width);
        _ymap.set("height", _appearance.height);
      }
      this._draw();
      repaint();
    };

    /**
     * Add ingoing edge
     * @param {canvas_widget.AbstractEdge} edge
     */
    this.addIngoingEdge = function (edge) {
      var id = edge.getEntityId();
      var source = edge.getSource();
      var sourceEntityId = source.getEntityId();
      if (!_ingoingEdges.hasOwnProperty(id)) {
        _ingoingEdges[id] = edge;
        if (!_ingoingNeighbors.hasOwnProperty(sourceEntityId)) {
          _ingoingNeighbors[sourceEntityId] = source;
        }
      }
    };

    /**
     * Add outgoing edge
     * @param {canvas_widget.AbstractEdge} edge
     */
    this.addOutgoingEdge = function (edge) {
      var id = edge.getEntityId();
      var target = edge.getTarget();
      var targetEntityId = target.getEntityId();
      if (!_outgoingEdges.hasOwnProperty(id)) {
        _outgoingEdges[id] = edge;
        if (!_outgoingNeighbors.hasOwnProperty(targetEntityId)) {
          _outgoingNeighbors[targetEntityId] = target;
        }
      }
    };

    /**
     * Delete ingoing edge
     * @param {canvas_widget.AbstractEdge} edge
     */
    this.deleteIngoingEdge = function (edge) {
      var id = edge.getEntityId();
      var source = edge.getSource();
      var sourceEntityId = source.getEntityId();
      var isMultiEdge = false;
      if (_ingoingEdges.hasOwnProperty(id)) {
        delete _ingoingEdges[id];
        for (var edgeId in _ingoingEdges) {
          if (
            _ingoingEdges.hasOwnProperty(edgeId) &&
            _ingoingEdges[edgeId].getSource().getEntityId() === sourceEntityId
          ) {
            isMultiEdge = true;
          }
        }
        if (!isMultiEdge) {
          delete _ingoingNeighbors[sourceEntityId];
        }
      }
    };

    /**
     * Delete outgoing edge
     * @param {canvas_widget.AbstractEdge} edge
     */
    this.deleteOutgoingEdge = function (edge) {
      var id = edge.getEntityId();
      var target = edge.getTarget();
      var targetEntityId = target.getEntityId();
      var isMultiEdge = false;
      if (_outgoingEdges.hasOwnProperty(id)) {
        delete _outgoingEdges[id];
        for (var edgeId in _outgoingEdges) {
          if (
            _outgoingEdges.hasOwnProperty(edgeId) &&
            _outgoingEdges[edgeId].getTarget().getEntityId() === targetEntityId
          ) {
            isMultiEdge = true;
          }
        }
        if (!isMultiEdge) {
          delete _outgoingNeighbors[targetEntityId];
        }
      }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get ingoing edges
     * @returns {Object}
     */
    this.getIngoingEdges = function () {
      return _ingoingEdges;
    };

    /**
     * Get outgoing edges
     * @returns {Object}
     */
    this.getOutgoingEdges = function () {
      return _outgoingEdges;
    };

    /**
     * Get all ingoing and outgoing edges
     * @returns {Array}
     */
    this.getEdges = function () {
      return Util.union(_ingoingEdges, _outgoingEdges);
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get neighbors with an edge to the node
     * @returns {Object}
     */
    this.getIngoingNeighbors = function () {
      return _ingoingNeighbors;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get neighbors with an edge from the node
     * @returns {Object}
     */
    this.getOutgoingNeighbors = function () {
      return _outgoingNeighbors;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get neighbors with an edge to or from the node
     * @returns {Object}
     */
    this.getNeighbors = function () {
      return Util.union(_ingoingNeighbors, _outgoingNeighbors);
    };

    /**
     * Lowlight the node
     */
    this.lowlight = function () {
      _$node.addClass("lowlighted");
    };

    /**
     * Unlowlight the node
     */
    this.unlowlight = function () {
      _$node.removeClass("lowlighted");
    };

    /**
     * Select the node
     */
    this.select = function () {
      _isSelected = true;
      this.unhighlight();
      _$node.addClass("selected");
      Util.delay(100).then(function () {
        _.each(require("canvas_widget/EntityManager").getEdges(), function (e) {
          e.setZIndex();
        });
      });
    };

    /**
     * Unselect the node
     */
    this.unselect = function () {
      _isSelected = false;
      //this.highlight(_highlightColor,_highlightUsername);
      _$node.removeClass("selected");
      //tigger save when unselecting an entity
      $("#save").click();
      Util.delay(100).then(function () {
        _.each(require("canvas_widget/EntityManager").getEdges(), function (e) {
          e.setZIndex();
        });
      });
    };

    /**
     * Highlight the node by assigning it the passed color and label it with the passed username
     * @param {String} color
     * @param {String} username
     */
    this.highlight = function (color, username) {
      //unhighlight everything else
      //$('.node:not(.selected)').css({border: "2px solid transparent"});
      //$('.user_highlight').remove();
      if (color && username) {
        _$node.css({ border: "2px solid " + color });
        _$node.append(
          $("<div></div>")
            .addClass("user_highlight")
            .css("color", color)
            .text(username)
        );
        Util.delay(100).then(function () {
          _.each(
            require("canvas_widget/EntityManager").getEdges(),
            function (e) {
              e.setZIndex();
            }
          );
        });
      }
    };

    /**
     * Unhighlight the node
     */
    this.unhighlight = function () {
      _$node.css({ border: "" });
      _$node.find(".user_highlight").remove();
      Util.delay(100).then(function () {
        var EntityManager = null;
        try {
          EntityManager = require("canvas_widget/EntityManager");
          _.each(EntityManager.getEdges(), function (e) {
            e.setZIndex();
          });
        } catch (error) {
          require(["canvas_widget/EntityManager"], function (EntityManager) {
            _.each(EntityManager.getEdges(), function (e) {
              e.setZIndex();
            });
          });
        }
      });
    };

    /**
     * Remove the node
     */
    this.remove = function () {
      clearInterval(_awarenessTimer);
      this.removeFromCanvas();
      require("canvas_widget/EntityManager").deleteNode(this.getEntityId());
    };

    /**
     * Get JSON representation of the node
     * @returns {Object}
     * @private
     */
    this._toJSON = function () {
      var attr = {};
      _.forEach(this.getAttributes(), function (val, key) {
        attr[key] = val.toJSON();
      });
      //noinspection JSAccessibilityCheck
      return {
        label: _label.toJSON(),
        left: _appearance.left,
        top: _appearance.top,
        width: _appearance.width,
        height: _appearance.height,
        zIndex: _zIndex,
        type: _type,
        attributes: attr,
      };
    };

    this.addGhostEdge = function (ghostEdge) {
      _relatedGhostEdges.push(ghostEdge);
    };

    /**
     * Bind events for move tool
     */
    this.bindMoveToolEvents = function () {
      //$canvas.find(".node.ui-draggable").draggable("option","disabled",false);
      var originalPos = {
        left: 0,
        top: 0,
      };

      var lastDragPos = {
        left: 0,
        top: 0,
      };

      //Enable Node Selection
      var drag = false;
      var $sizePreview = $('<div class="size-preview"></div>').hide();
      var clickedNode = _$node.on("click", function () {
        _canvas.select(that);
      });

      if (that.getContainment()) {
        clickedNode.droppable({
          hoverClass: "selected",
          drop: function (event, ui) {
            const EntityManager = require("canvas_widget/EntityManager");

            var containerNode = EntityManager.getNodes()[$(this).attr("id")];
            var childNode = EntityManager.getNodes()[ui.draggable.attr("id")];
            var relations = EntityManager.getRelations();

            var isConnected = false;
            var relationshipType = null;

            _.each(containerNode.getOutgoingEdges(), function (edge) {
              if (edge.getTarget().getEntityId() === childNode.getEntityId()) {
                isConnected = true;
                return false;
              }
            });

            _.each(relations, function (relation, key) {
              _.each(relation, function (r) {
                _.each(r.sourceTypes, function (source) {
                  if (containerNode.getType() === source) {
                    _.each(r.targetTypes, function (target) {
                      if (childNode.getType() === target) {
                        relationshipType = key;
                        return false;
                      }
                    });
                  }
                });
              });
            });

            if (!isConnected && relationshipType) {
              _canvas.createEdge(
                relationshipType,
                $(this).attr("id"),
                ui.draggable.attr("id")
              );
            }

            // // now, the attributes left and top of the node are not related to the top left corner of the
            // // canvas anymore, but instead they are related to the top left corner of the parent element
            // // => move node to correct left and right attribute
            // const EntityManager = require('canvas_widget/EntityManager');
            //
            // const containerLeft = that.getAppearance().left;
            // const containerTop = that.getAppearance().top;
            //
            // const operation = new NodeMoveOperation(ui.draggable.attr("id"), -containerLeft, -containerTop);
            // EntityManager.getNodes()[ui.draggable.attr("id")].propagateNodeMoveOperation(operation);
          },
        });
      }

      clickedNode
        //Enable Node Resizing
        .resizable({
          containment: "parent",
          start: function (ev /*,ui*/) {
            _canvas.hideGuidanceBox();
            $sizePreview.show();
            _$node.css({ opacity: 0.5 });
            _$node.append($sizePreview);
            _$node.resizable("option", "aspectRatio", ev.shiftKey);
            _$node.resizable("option", "grid", ev.ctrlKey ? [20, 20] : "");
          },
          resize: function (ev, ui) {
            _canvas.hideGuidanceBox();
            $sizePreview.text(
              Math.round(ui.size.width) + "x" + Math.round(ui.size.height)
            );
            repaint();
            _$node.resizable("option", "aspectRatio", ev.shiftKey);
            _$node.resizable("option", "grid", ev.ctrlKey ? [20, 20] : "");
          },
          stop: function (ev, ui) {
            $sizePreview.hide();
            _$node.css({ opacity: "" });
            var $target = ui.helper;
            $target.css({
              width: ui.originalSize.width,
              height: ui.originalSize.height,
            });
            var offsetX = ui.size.width - ui.originalSize.width;
            var offsetY = ui.size.height - ui.originalSize.height;
            var operation = new NodeResizeOperation(id, offsetX, offsetY);
            that.propagateNodeResizeOperation(operation);
            _$node.resizable("option", "aspectRatio", false);
            _$node.resizable("option", "grid", "");

            //TODO: check that! Already called in processNodeResizeOperation called by propagateNodeResizeOperation
            //_canvas.showGuidanceBox();
          },
        })

        //Enable Node Dragging
        .draggable({
          containment: "parent",
          start: function (ev, ui) {
            originalPos.top = ui.position.top;
            originalPos.left = ui.position.left;

            lastDragPos.top = ui.position.top;
            lastDragPos.left = ui.position.left;

            //ui.position.top = 0;
            //ui.position.left = 0;
            _canvas.select(that);
            _canvas.hideGuidanceBox();
            _$node.css({ opacity: 0.5 });
            _$node.resizable("disable");
            drag = false;
            _$node.draggable("option", "grid", ev.ctrlKey ? [20, 20] : "");
          },
          drag: function (ev, ui) {
            // ui.position.left = Math.round(ui.position.left  / _canvas.getZoom());
            // ui.position.top = Math.round(ui.position.top / _canvas.getZoom());

            var offsetX = Math.round(
              (ui.position.left - lastDragPos.left) / _canvas.getZoom()
            );
            var offsetY = Math.round(
              (ui.position.top - lastDragPos.top) / _canvas.getZoom()
            );

            function setChildPosition(node) {
              if (node.getContainment()) {
                _.each(node.getOutgoingEdges(), function (edge) {
                  $("#" + edge.getTarget().getEntityId()).offset({
                    top:
                      $("#" + edge.getTarget().getEntityId()).offset().top +
                      offsetY,
                    left:
                      $("#" + edge.getTarget().getEntityId()).offset().left +
                      offsetX,
                  });
                  setChildPosition(edge.getTarget());
                });
              }
            }

            setChildPosition(that);

            lastDragPos.top = ui.position.top;
            lastDragPos.left = ui.position.left;

            if (drag) repaint();
            drag = true;

            _canvas.hideGuidanceBox();
            _$node.draggable("option", "grid", ev.ctrlKey ? [20, 20] : "");
          },
          stop: function (ev, ui) {
            _$node.css({ opacity: "" });
            _$node.resizable("enable");
            var id = _$node.attr("id");
            //_$node.css({top: originalPos.top / _canvas.getZoom(), left: originalPos.left / _canvas.getZoom()});
            var offsetX = Math.round(
              (ui.position.left - originalPos.left) / _canvas.getZoom()
            );
            var offsetY = Math.round(
              (ui.position.top - originalPos.top) / _canvas.getZoom()
            );

            var operation = new NodeMoveOperation(
              that.getEntityId(),
              offsetX,
              offsetY
            );
            that.propagateNodeMoveOperation(operation);

            function propagateChildPosition(node) {
              if (node.getContainment()) {
                _.each(node.getOutgoingEdges(), function (edge) {
                  var operation = new NodeMoveOperation(
                    edge.getTarget().getEntityId(),
                    offsetX,
                    offsetY
                  );
                  edge.getTarget().propagateNodeMoveOperation(operation);
                  propagateChildPosition(edge.getTarget());
                });
              }
            }

            propagateChildPosition(that);

            //Avoid node selection on drag stop
            _$node.draggable("option", "grid", "");
            _canvas.showGuidanceBox();
            $(ev.toElement).one("click", function (ev) {
              ev.stopImmediatePropagation();
            });
          },
        })

        //Enable Node Rightclick menu
        .contextMenu(true)

        .transformable({
          rotatable: false,
          skewable: false,
          scalable: false,
        })

        .find("input")
        .prop("disabled", false)
        .css("pointerEvents", "");

      // view_only is used by the CAE and allows to show a model in the Canvas which is not editable
      // therefore, the nodes should not be draggable and their context menu should be disabled
      const widgetConfigMap = y.getMap("widgetConfig");
      var viewOnly = widgetConfigMap.get("view_only");
      if (viewOnly) {
        _$node.on("click").draggable().draggable("destroy");
        _$node.on("click").contextMenu(false);
      }
    };

    /**
     * Unbind events for move tool
     */
    this.unbindMoveToolEvents = function () {
      //Disable Node Selection
      _$node
        .off("click")

        //$canvas.find(".node.ui-draggable").draggable( "option", "disabled", true);

        //Disable Node Resizing
        .resizable()
        .resizable("destroy")

        //Disable Node Draggin
        .draggable()
        .draggable("destroy")

        //Disable Node Rightclick Menu
        .contextMenu(false)

        .transformable("destroy")

        .find("input")
        .prop("disabled", true)
        .css("pointerEvents", "none");
    };

    /**
     * Bind source node events for edge tool
     */
    this.makeSource = function () {
      _$node.addClass("source");
      jsPlumb.makeSource(_$node, {
        connectorPaintStyle: { strokeStyle: "#aaaaaa", lineWidth: 2 },
        endpoint: "Blank",
        anchor: _anchorOptions,
        //maxConnections:1,
        uniqueEndpoint: false,
        deleteEndpointsOnDetach: true,
        onMaxConnections: function (info /*, originalEvent*/) {
          console.log(
            "element is ",
            info.element,
            "maxConnections is",
            info.maxConnections
          );
        },
      });
    };

    /**
     * Bind target node events for edge tool
     */
    this.makeTarget = function () {
      _$node.addClass("target");
      jsPlumb.makeTarget(_$node, {
        isTarget: false,
        endpoint: "Blank",
        anchor: _anchorOptions,
        uniqueEndpoint: false,
        //maxConnections:1,
        deleteEndpointsOnDetach: true,
        onMaxConnections: function (info /*, originalEvent*/) {
          console.log(
            "user tried to drop connection",
            info.connection,
            "on element",
            info.element,
            "with max connections",
            info.maxConnections
          );
        },
      });
    };

    /**
     * Unbind events for edge tool
     */
    this.unbindEdgeToolEvents = function () {
      _$node.removeClass("source target");
      jsPlumb.unmakeSource(_$node);
      jsPlumb.unmakeTarget(_$node);
    };

    that.init();

    this._registerYMap = function () {
      _ymap.observe(function (event) {
        var yUserId = event.object.map[event.name][0];

        if (
          y.clientID !== yUserId ||
          (event.value && event.value.historyFlag)
        ) {
          var operation;
          var data = event.value;
          const userMap = y.getMap("users");
          var jabberId = userMap.get(yUserId);
          switch (event.name) {
            case NodeMoveOperation.TYPE: {
              operation = new NodeMoveOperation(
                data.id,
                data.offsetX,
                data.offsetY,
                jabberId
              );
              remoteNodeMoveCallback(operation);
              break;
            }
            case NodeMoveZOperation.TYPE: {
              operation = new NodeMoveZOperation(
                data.id,
                data.offsetZ,
                jabberId
              );
              remoteNodeMoveZCallback(operation);
              break;
            }
            case NodeResizeOperation.TYPE: {
              operation = new NodeResizeOperation(
                data.id,
                data.offsetX,
                data.offsetY,
                jabberId
              );
              remoteNodeResizeCallback(operation);
              break;
            }
          }
        }
      });
    };
  }

  /**
   * Apply position and dimension attributes to the node
   */
  AbstractNode.prototype.draw = function () {
    return this._draw();
  };

  /**
   * Get jQuery object of DOM node representing the node
   * @returns {jQuery}
   */
  AbstractNode.prototype.get$node = function () {
    return this._get$node();
  };

  /**
   * Get JSON representation of the node
   * @returns {{label: Object, left: number, top: number, width: number, height: number, type: string, attributes: Object}}
   */
  AbstractNode.prototype.toJSON = function () {
    return this._toJSON();
  };

  /**
   * hide the node and all associated edges
   */
  AbstractNode.prototype.hide = function () {
    this.get$node().hide();
    jsPlumb.hide(this.get$node());
  };

  /**
   * show the node and all associated edges
   */
  AbstractNode.prototype.show = function () {
    this.get$node().show();
    jsPlumb.show(this.get$node()[0]);
    jsPlumb.repaint(this.get$node()[0]);
  };

  AbstractNode.prototype.registerYMap = function () {
    this._registerYMap();
  };

  return AbstractNode;
});
