define(['jqueryui',
    'operations/ot/NodeAddOperation',
    'operations/ot/EdgeAddOperation',
    'operations/ot/NodeDeleteOperation',
    'operations/ot/EdgeDeleteOperation',
    'operations/ot/NodeMoveOperation',
    'operations/ot/NodeMoveZOperation',
    'operations/ot/NodeResizeOperation'
], function($, NodeAddOperation, EdgeAddOperation, NodeDeleteOperation, EdgeDeleteOperation, NodeMoveOperation, NodeMoveZOperation, NodeResizeOperation) {
    function HistoryManager() {
        
        var bufferSize = 20;
        
        var _canvas = null;
        
        var $undo = $('#undo');

        var $redo = $('#redo');

        var propagateHistoryOperationFromJson = function(json) {
            var EntityManager = require('canvas_widget/EntityManager');
            var operation = null, data = null, entity;
            switch (json.TYPE) {
                case NodeDeleteOperation.TYPE: {
                    entity = EntityManager.findNode(json.id);
                    if (entity) {
                        operation = new NodeDeleteOperation(json.id, json.type, json.left, json.top, json.width, json.height, json.zIndex, json.json);
                        y.share.nodes.get(json.id).then(function(ymap) {
                            data = operation.toJSON();
                            data.historyFlag = true;
                            ymap.set(NodeDeleteOperation.TYPE, data);
                        });
                    }
                    break;
                }
                case NodeAddOperation.TYPE: {
                    operation = new NodeAddOperation(json.id, json.type, json.left, json.top, json.width, json.height, json.zIndex, json.json);
                    data = operation.toJSON();
                    data.historyFlag = true;
                    _canvas.createNode(json.type, json.left, json.top, json.width, json.height, json.zIndex, json.json, json.id);
                    break;
                }
                case EdgeAddOperation.TYPE: {
                    operation = new EdgeAddOperation(json.id, json.type, json.source, json.target, json.json);
                    data = operation.toJSON();
                    data.historyFlag = true;
                    _canvas.createEdge(json.type, json.source, json.target, json.json, json.id);
                    break;
                }
                case EdgeDeleteOperation.TYPE: {
                    entity = EntityManager.findEdge(json.id);
                    if (entity) {
                        operation = new EdgeDeleteOperation(json.id, json.type, json.source, json.target, json.json);
                        y.share.edges.get(json.id).then(function(ymap) {
                            data = operation.toJSON();
                            data.historyFlag = true;
                            ymap.set(EdgeDeleteOperation.TYPE, data);
                        });
                    }
                    break;
                }
                case NodeMoveOperation.TYPE: {
                    entity = EntityManager.findNode(json.id);
                    if (entity) {
                        operation = new NodeMoveOperation(json.id, json.offsetX, json.offsetY);
                        y.share.nodes.get(json.id).then(function(ymap) {
                            data = operation.toJSON();
                            data.historyFlag = true;
                            ymap.set(NodeMoveOperation.TYPE, data);
                        });
                    }
                    break;
                }
                case NodeMoveZOperation.TYPE: {
                    entity = EntityManager.findNode(json.id);
                    if (entity) {
                        operation = new NodeMoveZOperation(json.id, json.offsetZ);
                        y.share.nodes.get(json.id).then(function(ymap) {
                            data = operation.toJSON();
                            data.historyFlag = true;
                            ymap.set(NodeMoveZOperation.TYPE, data);
                        });
                    }
                    break;
                }
                case NodeResizeOperation.TYPE: {
                    entity = EntityManager.findNode(json.id);
                    if (entity) {
                        operation = new NodeResizeOperation(json.id, json.offsetX, json.offsetY);
                        y.share.nodes.get(json.id).then(function(ymap) {
                            data = operation.toJSON();
                            data.historyFlag = true;
                            ymap.set(NodeResizeOperation.TYPE, data);
                        });
                    }
                    break;
                }
            }
            return operation;
        };

        return {
            init:function(canvas){
              _canvas = canvas;  
            },
            add: function(operation) {
                if (operation.hasOwnProperty('inverse')) {
                    var inverseOp = operation.inverse();
                    var json = inverseOp.toJSON();
                    json.TYPE = inverseOp.constructor.name;
                    y.share.undo.push([json]);
                    $undo.prop('disabled', false);
                }
                if (y.share.undo.length >bufferSize && y.share.undo.length - bufferSize >= bufferSize) {
                    y.share.undo.delete(0, y.share.undo.length - bufferSize);
                }
                if (y.share.redo.length > bufferSize && y.share.redo.length -bufferSize >= bufferSize) {
                    y.share.redo.delete(0, y.share.redo.length - bufferSize);
                }

            },
            undo: function() {
                if (y.share.undo.length > 0) {
                    var jsonOp = y.share.undo.get(y.share.undo.length - 1);
                    y.share.undo.delete(y.share.undo.length - 1);
                    if (y.share.undo.length === 0) {
                        $undo.prop('disabled', true);
                    }
                    var operation = propagateHistoryOperationFromJson(jsonOp);
                    if (!operation) {
                        this.undo();
                        return;
                    }
                    var inverseOp = operation.inverse();
                    var json = inverseOp.toJSON();
                    json.TYPE = inverseOp.constructor.name;

                    if (y.share.redo.length === 0)
                        $redo.prop('disabled', false);
                    y.share.redo.push([json]);
                }
                else {
                    $undo.prop('disabled', true);
                }
            },
            redo: function() {
                if (y.share.redo.length > 0) {
                    var jsonOp = y.share.redo.get(y.share.redo.length - 1);
                    y.share.redo.delete(y.share.redo.length - 1);
                    if (y.share.redo.length === 0) {
                        $redo.prop('disabled', true);
                    }
                    var operation = propagateHistoryOperationFromJson(jsonOp);
                    if (!operation) {
                        this.redo();
                        return;
                    }
                    var inverseOp = operation.inverse();
                    var json = inverseOp.toJSON();
                    json.TYPE = inverseOp.constructor.name;

                    if (y.share.undo.length === 0)
                        $undo.prop('disabled', false);
                    y.share.undo.push([json]);

                }
                else {
                    $redo.prop('disabled', true);
                }
            }
        }
    }
    return new HistoryManager();
});