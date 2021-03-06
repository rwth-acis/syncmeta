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

        var latestOp = null;    
        var undo = [];
        var redo = [];
            
        var $undo = $('#undo');

        var $redo = $('#redo');

        var propagateHistoryOperationFromJson = function(json) {
            var EntityManager = require('canvas_widget/EntityManager');
            var operation = null, data = null, entity;
            switch (json.TYPE) {
                case NodeDeleteOperation.TYPE: {
                    entity = EntityManager.findNode(json.id);
                    if (entity) {
                        entity.triggerDeletion(true);
                        operation =  new NodeDeleteOperation(json.id, json.type, json.left, json.top, json.width, json.height, json.zIndex, json.json);

                    }
                    break;
                }
                case NodeAddOperation.TYPE: {
                    _canvas.createNode(json.type, json.left, json.top, json.width, json.height, json.zIndex, json.json, json.id, true);
                    operation = new NodeAddOperation(json.id, json.type, json.left, json.top, json.width, json.height, json.zIndex, json.json);
                    break;
                }
                case EdgeAddOperation.TYPE: {
                    _canvas.createEdge(json.type, json.source, json.target, json.json, json.id, true);
                    operation = new EdgeAddOperation(json.id, json.type, json.source, json.target, json.json);
                    break;
                }
                case EdgeDeleteOperation.TYPE: {
                    entity = EntityManager.findEdge(json.id);
                    if (entity) {
                        entity.triggerDeletion(true);
                        operation = new EdgeDeleteOperation(json.id, json.type, json.source, json.target, json.json);    
                    }
                    break;
                }
                case NodeMoveOperation.TYPE: {
                    entity = EntityManager.findNode(json.id);
                    if (entity) {
                        operation = new NodeMoveOperation(json.id, json.offsetX, json.offsetY);
                        var ymap = y.share.nodes.get(json.id);
                        data = operation.toJSON();
                        data.historyFlag = true;
                        ymap.set(NodeMoveOperation.TYPE, data);
                    }
                    break;
                }
                case NodeMoveZOperation.TYPE: {
                    entity = EntityManager.findNode(json.id);
                    if (entity) {
                        operation = new NodeMoveZOperation(json.id, json.offsetZ);
                        var ymap = y.share.nodes.get(json.id)
                        data = operation.toJSON();
                        data.historyFlag = true;
                        ymap.set(NodeMoveZOperation.TYPE, data);
                        
                    }
                    break;
                }
                case NodeResizeOperation.TYPE: {
                    entity = EntityManager.findNode(json.id);
                    if (entity) {
                        operation = new NodeResizeOperation(json.id, json.offsetX, json.offsetY);
                        var ymap = y.share.nodes.get(json.id);
                        data = operation.toJSON();
                        data.historyFlag = true;
                        ymap.set(NodeResizeOperation.TYPE, data);
                        
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
                    undo.push(json);
                    redo = [];
                    $undo.prop('disabled', false);
                    $redo.prop('disabled', true);
                }
                if (undo.length >bufferSize) {
                    undo.shift();
                }
            },
            undo: function() {
                if (undo.length > 0) {
                    var jsonOp = undo.pop();
                    if (undo.length === 0) {
                        $undo.prop('disabled', true);
                    }
                    var operation = propagateHistoryOperationFromJson(jsonOp);
                    if (!operation) {
                        this.undo();
                        return;
                    } else latestOp = operation;
                    
                    var inverseOp = operation.inverse();
                    var json = inverseOp.toJSON();
                    json.TYPE = inverseOp.constructor.name;

                    if (redo.length === 0)
                        $redo.prop('disabled', false);
                    redo.push(json);
                }
                else {
                    $undo.prop('disabled', true);
                }
            },
            redo: function() {
                if (redo.length > 0) {
                    var jsonOp = redo.pop();
                    if (redo.length === 0) {
                        $redo.prop('disabled', true);
                    }
                    var operation = propagateHistoryOperationFromJson(jsonOp);
                    if (!operation) {
                        this.redo();
                        return;
                    }
                    else latestOp = operation;
                    var inverseOp = operation.inverse();
                    var json = inverseOp.toJSON();
                    json.TYPE = inverseOp.constructor.name;

                    if (undo.length === 0)
                        $undo.prop('disabled', false);
                    undo.push(json);
                }
                else {
                    $redo.prop('disabled', true);
                }
            },
            clean: function(entityId){
                var entityIdFilter = function(value, idx){
                    if(value.id === entityId)
                        return false;
                    else return true;
                };
                undo = undo.filter(entityIdFilter);
                redo = redo.filter(entityIdFilter);
                if (undo.length === 0) {
                    $undo.prop('disabled', true);
                }
                if (redo.length === 0) {
                    $redo.prop('disabled', true);
                }
                    
            },
            getLatestOperation: function(){
                return latestOp;
            },
            getUndoList : function(){
                return undo;
            },
            getRedoList: function(){
                return redo;
            }
        }
    }
    return new HistoryManager();
});