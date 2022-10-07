define([
  "iwcw",
  "operations/ot/NodeAddOperation",
  "operations/ot/EdgeAddOperation",
  "operations/non_ot/EntitySelectOperation",
  "attribute_widget/ModelAttributesNode",
  "attribute_widget/EntityManager",
], /** @lends AttributeWrapper */ function (
  IWCW,
  NodeAddOperation,
  EdgeAddOperation,
  EntitySelectOperation,
  ModelAttributesNode,
  EntityManager
) {
  /**
   * AttributeWrapper
   * @class attribute_widget.AttributeWrapper
   * @memberof attribute_widget
   * @constructor
   * @param {jQuery} $node jquery Selector of wrapper node
   */
  function AttributeWrapper($node) {
    var that = this;

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = $node;

    /**
     * Entity currently selected
     * @type {attribute_widget.AbstractNode|attribute_widget/AbstractEdge}
     * @private
     */
    var _selectedEntity = null;

    /**
     * Model attributes
     * @type {attribute_widget.ModelAttributesNode}
     * @private
     */
    var _modelAttributesNode = null;

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

    //var _nodes = {};

    /**
     * Callback for a Entity Select Operation
     * @param {operations.non_ot.EntitySelectOperation} operation
     */
    var entitySelectCallback = function (operation) {
      if (
        operation instanceof EntitySelectOperation &&
        operation.getSelectedEntityId() === null
      ) {
        that.select(_modelAttributesNode);
        if ($node.is(":hidden")) $node.show();
        $(".ace-container").hide();
      }
    };

    /**
     * Callback for an Node Add Operation
     * @param {operations.ot.NodeAddOperation} operation
     */
    var nodeAddCallback = function (operation) {
      if (operation instanceof NodeAddOperation) {
        var node, type, viewType;

        if (
          operation.getViewId() === EntityManager.getViewId() ||
          EntityManager.getLayer() === CONFIG.LAYER.META
        ) {
          type = operation.getType();
        } else {
          if (!operation.getViewId()) {
            type = operation.getType();
          } else {
            type = operation.getOriginType();
          }
          if (EntityManager.getViewId()) {
            viewType = EntityManager.getNodeType(type).VIEWTYPE;
            if (viewType) {
              type = viewType;
            }
          }
        }

        var json = operation.getJSON();
        if (json) {
          node = EntityManager.createNodeFromJSON(
            type,
            operation.getEntityId(),
            operation.getLeft(),
            operation.getTop(),
            operation.getWidth(),
            operation.getHeight(),
            operation.getContainment(),
            operation.getJSON()
          );
        } else {
          node = EntityManager.createNode(
            type,
            operation.getEntityId(),
            operation.getLeft(),
            operation.getTop(),
            operation.getWidth(),
            operation.getHeight(),
            operation.getContainment()
          );
        }
        node.addToWrapper(that);
      }
    };

    /**
     * Callback for an Edge Add Operation
     * @param {operations.ot.EdgeAddOperation} operation
     */
    var edgeAddCallback = function (operation) {
      if (operation instanceof EdgeAddOperation) {
        var edge, type, viewType;

        if (
          operation.getViewId() === EntityManager.getViewId() ||
          EntityManager.getLayer() === CONFIG.LAYER.META
        ) {
          type = operation.getType();
        } else {
          if (!operation.getViewId()) {
            type = operation.getType();
          } else {
            type = operation.getOriginType();
          }
          if (EntityManager.getViewId()) {
            viewType = EntityManager.getEdgeType(type).VIEWTYPE;
            if (viewType) {
              type = viewType;
            }
          }
        }
        var json = operation.getJSON();
        if (json) {
          edge = EntityManager.createEdgeFromJSON(
            type,
            operation.getEntityId(),
            operation.getSource(),
            operation.getTarget(),
            json
          );
        } else {
          edge = EntityManager.createEdge(
            type,
            operation.getEntityId(),
            EntityManager.findNode(operation.getSource()),
            EntityManager.findNode(operation.getTarget())
          );
        }
        edge.addToWrapper(that);
      }
    };

    /**
     * Get jQuery object of DOM node representing the node
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    /**
     * Set model attributes
     * @param node {attribute_widget.ModelAttributesNode}
     */
    this.setModelAttributesNode = function (node) {
      _modelAttributesNode = node;
    };

    /**
     * Get model Attributes
     * @returns {attribute_widget.ModelAttributesNode}
     */
    this.getModelAttributesNode = function () {
      return _modelAttributesNode;
    };

    /**
     * Select an entity
     * @param {attribute_widget.AbstractNode|attribute_widget.AbstractEdge} entity
     */
    this.select = function (entity) {
      if (_selectedEntity != entity) {
        if (_selectedEntity) _selectedEntity.unselect();
        if (entity) entity.select();
        _selectedEntity = entity;
      }
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      iwc.registerOnDataReceivedCallback(entitySelectCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      iwc.unregisterOnDataReceivedCallback(entitySelectCallback);
    };

    if (iwc) {
      that.registerCallbacks();
    }

    if (y) {
      const nodesMap = y.getMap("nodes");
      nodesMap.observe(function (event) {
        switch (event.type) {
          case "add": {
            nodesMap.get(event.name).observe(function (nodeEvent) {
              switch (nodeEvent.name) {
                case "jabberId": {
                  var map = nodeEvent.object;
                  nodeAddCallback(
                    new NodeAddOperation(
                      map.get("id"),
                      map.get("type"),
                      map.get("left"),
                      map.get("top"),
                      map.get("width"),
                      map.get("height"),
                      map.get("zIndex"),
                      map.get("containment"),
                      map.get("json"),
                      null,
                      null,
                      nodeEvent.value
                    )
                  );
                  break;
                }
                default:
                  if (
                    nodeEvent.name.search(/\w*\[(\w|\s)*\]/g) != -1 &&
                    nodeEvent.type === "add"
                  ) {
                    var node = EntityManager.findNode(
                      nodeEvent.object.get("id")
                    );
                    //Check for label
                    if (node.getLabel().getEntityId() === nodeEvent.name)
                      node
                        .getLabel()
                        .getValue()
                        .registerYType(nodeEvent.object.get(nodeEvent.name));
                    else {
                      var attrs = null;

                      if (EntityManager.getLayer() === CONFIG.LAYER.META) {
                        attrs = node.getAttribute("[attributes]");
                        if (!attrs) attrs = node.getAttributes();
                        else attrs = attrs.getAttributes();
                        var attrId = nodeEvent.name.replace(/\[\w*\]/g, "");
                        if (attrs.hasOwnProperty(attrId)) {
                          var attr = attrs[attrId];
                          if (attr.hasOwnProperty("getKey")) {
                            if (nodeEvent.name.indexOf("ref") != -1)
                              attr.getRef().registerYType(nodeEvent.value);
                            else if (
                              attr.getKey().hasOwnProperty("registerYType") &&
                              nodeEvent.name.indexOf("value") === -1
                            )
                              attr
                                .getKey()
                                .registerYType(
                                  nodeEvent.object.get(nodeEvent.name)
                                );
                          } else if (attr.hasOwnProperty("getValue")) {
                            if (attr.getValue().hasOwnProperty("registerYType"))
                              attr
                                .getValue()
                                .registerYType(
                                  nodeEvent.object.get(nodeEvent.name)
                                );
                          }
                        } else if (attrs.hasOwnProperty(nodeEvent.name)) {
                          var attr = attrs[nodeEvent.name];
                          if (attr.getValue().hasOwnProperty("registerYType"))
                            attr
                              .getValue()
                              .registerYType(
                                nodeEvent.object.get(nodeEvent.name)
                              );
                        }
                      } else {
                        attrs = node.getAttributes();
                        for (var attrKey in attrs) {
                          if (attrs.hasOwnProperty(attrKey)) {
                            var attr = attrs[attrKey];
                            if (
                              attr.getEntityId() === nodeEvent.name &&
                              attr.getValue().hasOwnProperty("registerYType")
                            ) {
                              attr
                                .getValue()
                                .registerYType(
                                  nodeEvent.object.get(nodeEvent.name)
                                );
                              break;
                            }
                          }
                        }
                      }
                    }
                  }
              }
            });
            break;
          }
        }
      });
      const edgesMap = y.getMap("edges");
      edgesMap.observe(function (event) {
        switch (event.type) {
          case "add":
            {
              edgesMap.get(event.name).observe(function (edgeEvent) {
                switch (edgeEvent.name) {
                  case "jabberId": {
                    var map = edgeEvent.object;
                    edgeAddCallback(
                      new EdgeAddOperation(
                        map.get("id"),
                        map.get("type"),
                        map.get("source"),
                        map.get("target"),
                        null,
                        null,
                        null,
                        edgeEvent.value
                      )
                    );
                    break;
                  }
                  default: {
                    if (
                      edgeEvent.name.search(/\w*\[(\w|\s)*\]/g) != -1 &&
                      edgeEvent.type === "add"
                    ) {
                      var edge = EntityManager.findEdge(
                        edgeEvent.object.get("id")
                      );
                      var attrs = edge.getAttributes();
                      if (edge.getLabel().getEntityId() === edgeEvent.name)
                        edge
                          .getLabel()
                          .getValue()
                          .registerYType(edgeEvent.object.get(edgeEvent.name));
                      else {
                        var attrs = edge.getAttributes();
                        for (var attrKey in attrs) {
                          if (attrs.hasOwnProperty(attrKey)) {
                            if (
                              attrs[attrKey].getEntityId() === edgeEvent.name
                            ) {
                              var attr = attrs[attrKey];
                              if (
                                attr.getValue().hasOwnProperty("registerYType")
                              )
                                attr
                                  .getValue()
                                  .registerYType(
                                    edgeEvent.object.get(edgeEvent.name)
                                  );
                            }
                          }
                        }
                      }
                    }
                  }
                }
              });
            }
            break;
        }
      });
    }
    this.select(_modelAttributesNode);
  }

  return AttributeWrapper;
});
