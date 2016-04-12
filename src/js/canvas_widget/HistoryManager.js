define(['jqueryui',
    'operations/ot/NodeDeleteOperation'
],function ($,NodeDeleteOperation) {
    function HistoryManager(){

        var $undo= $('#undo');

        var $redo=$('#redo');

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
                    switch(jsonOp.TYPE){
                        case NodeDeleteOperation.TYPE:{
                            y.share.nodes.get(jsonOp.id).then(function(ymap){
                               ymap.set(NodeDeleteOperation.TYPE, new NodeDeleteOperation(jsonOp.id).toJSON());
                            });
                            break;
                        }
                    }
                }
                else{
                    $undo.prop('disabled',true);
                }
            },
            redo:function(){

            }

        }
    }

    return HistoryManager();
});