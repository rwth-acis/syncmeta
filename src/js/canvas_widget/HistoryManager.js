define(['jqueryui',
    'operations/ot/NodeAddOperation',
    'operations/ot/EdgeAddOperation',
    'operations/ot/NodeDeleteOperation',
    'operations/ot/EdgeDeleteOperation',
    'operations/ot/NodeMoveOperation',
    'operations/ot/NodeMoveZOperation',
    'operations/ot/NodeResizeOperation'
],function ($,NodeAddOperation, EdgeAddOperation,NodeDeleteOperation,EdgeDeleteOperation,NodeMoveOperation,NodeMoveZOperation,NodeResizeOperation) {
    function HistoryManager(){

        var $undo= $('#undo');

        var $redo=$('#redo');

        var propagateHistoryOperationFromJson = function(json){
            var operation = null;
            switch(json.TYPE){
                case NodeDeleteOperation.TYPE:{
                    y.share.nodes.get(json.id).then(function(ymap){
                        operation = new NodeDeleteOperation(json.id,json.type, json.left,json.top, json.width, json.height,json.zIndex,json.json);
                        ymap.set(NodeDeleteOperation.TYPE, operation.toJSON());
                    });
                    break;
                }
                case NodeAddOperation.TYPE:{
                    operation =  new NodeAddOperation(json.id,json.type, json.left,json.top, json.width, json.height,json.zIndex,json.json);
                    y.share.canvas.set(NodeAddOperation.TYPE,operation.toJSON());
                    break;
                }
                case EdgeAddOperation.TYPE:{
                    operation =  new EdgeAddOperation(json.id,json.type,json.source,json.target,json.json);
                    y.share.canvas.set(EdgeAddOperation.TYPE,operation.toJSON());
                    break;
                }
                case EdgeDeleteOperation.TYPE:{
                    operation = new EdgeDeleteOperation(json.id, json.type, json.source, json.target, json.json);
                    y.share.edges.get(json.id).then(function (ymap) {
                        ymap.set(EdgeDeleteOperation.TYPE, operation.toJSON());
                    });
                    break;
                }
                case NodeMoveOperation.TYPE:{
                    operation =  new NodeMoveOperation(json.id,json.offsetX,json.offsetY);
                    y.share.node.get(json.id).then(function(ymap){
                        ymap.set(NodeMoveOperation.TYPE,operation.toJSON());
                    });
                    break;
                }
                case NodeMoveZOperation.TYPE:{
                    operation =  new NodeMoveZOperation(json.id,json.offsetZ);
                    y.share.node.get(json.id).then(function(ymap){
                        ymap.set(NodeMoveZOperation.TYPE,operation.toJSON());
                    });
                    break;
                }
                case NodeResizeOperation.TYPE:{
                    operation =  new NodeResizeOperation(json.id,json.offsetX,json.offsetY);
                    y.share.nodes.get(json.id).then(function(ymap){
                        ymap.set(NodeResizeOperation.TYPE, operation.toJSON());
                    });
                    break;
                }
            }
            return operation;
        };

        return {
            add:function(operation){
                if(operation.hasOwnProperty('inverse')) {
                    var inverseOp = operation.inverse();
                    var json = inverseOp.toJSON();
                    json.TYPE =  inverseOp.constructor.name;
                    y.share.undo.push([json]);
                    $undo.prop('disabled',false);
                }
            },
            undo:function(){
                if(y.share.undo.length>0){
                    var jsonOp = y.share.undo.get(y.share.undo.length-1);
                    y.share.undo.delete(y.share.undo.length-1);
                    var operation = propagateHistoryOperationFromJson(jsonOp);
                    var inverseOp = operation.inverse();
                    var json = inverseOp.toJSON();
                    json.TYPE =  inverseOp.constructor.name;

                    if(y.share.redo.length===0)
                        $redo.prop('disabled',false);
                    y.share.redo.push([json]);
                }
                else{
                    $undo.prop('disabled',true);
                }
            },
            redo:function(){
                if(y.share.redo.length>0) {
                    var jsonOp = y.share.redo.get(y.share.redo.length-1);
                    y.share.redo.delete(y.share.redo.length-1);
                    var operation = propagateHistoryOperationFromJson(jsonOp);
                    var inverseOp = operation.inverse();
                    var json = inverseOp.toJSON();
                    json.TYPE =  inverseOp.constructor.name;

                    if(y.share.undo.length===0)
                        $undo.prop('disabled',false);
                    y.share.undo.push([json]);

                }
                else{
                    $redo.prop('disabled',true);
                }
            }
        }
    }
    return new HistoryManager();
});