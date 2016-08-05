syncmeta.connect().done(function(){
    syncmeta.onNodeAdd(function(event) {
       console.info('Node created: ' + event.id);

        syncmeta.onNodeAttributeChange(function(value, entityId, attrId) {
            console.info('onNodeAttributeChange(only ' + entityId +  ') + value + ' + value +  ' attrId: ' + attrId);
        }, event.id);
    });

    syncmeta.onEdgeAdd(function(event) {
        console.info('Edge created: ' + event.id);
    });

    syncmeta.onEntitySelect(function(entityId) {
        console.info('Entity select: ' + entityId);
    });

    syncmeta.onNodeSelect(function(nodeId) {
        currentNode = nodeId;
        syncmeta.onNodeMove(function(event) {
           console.info('Node  was moved. Listens to ' + event.id + 'only');
        }, nodeId);

    });

    syncmeta.onNodeDelete(function(nodeId) {
        console.info('Node was deleted: ' + nodeId);
    });

    syncmeta.onEdgeDelete(function(nodeId) {
        console.info('Edge was deleted: ' + nodeId);
    });
    syncmeta.onNodeMove(function(event) {
        console.info('Node was moved: ' + event.id);
    });

    syncmeta.onNodeResize(function(event){
        console.info('Node was resized: ' + event.id);
    });

    syncmeta.onNodeMoveZ(function(event){
        console.info('Node was moved on Z: ' + event.id);
    });

    syncmeta.onNodeAttributeChange(function(value, entityId, attrId){
        console.info('onNodeAttributeChange:  value: ' + value + ' entityId: ' + entityId + ' attrId: ' + attrId);
    });
    syncmeta.onEdgeAttributeChange(function(value, entityId, attrId){
        console.info('onEdgeAttributeChange:  value: ' + value + ' entityId: ' + entityId + ' attrId: ' + attrId);
    });
});