$(function() {
    var addToList = function(text) {
        $('#eventList').prepend(($('<li></li>').text(text)));
    }
    syncmeta.connect().done(function() {
        syncmeta.onNodeAdd(function(event) {
            console.info('Node created: ' + event.id);
            addToList('Node created: ' + event.id);

            syncmeta.onNodeAttributeChange(function(value, entityId, attrId) {
                console.info('onNodeAttributeChange(only ' + entityId + ') + value:  ' + value + ' attrId: ' + attrId);
                addToList('onNodeAttributeChange(only ' + entityId + ') + value:  ' + value + ' attrId: ' + attrId);
            }, event.id);
            
            syncmeta.onNodeAttributeChange(function(value, entityId, attrId) {
                console.info('onNodeAttributeChange(only ' + entityId + ') + value + ' + value + ' attrId: ' + attrId);
                addToList('onNodeAttributeChange2('+ entityId + ')value: '  + value + ' attrId: ' + attrId);
            });
            
            syncmeta.onNodeMove(function(e) {
                console.info('Node  was moved. Listens to ' + e.id + 'only');
                addToList('Node  was moved. Listens to ' + e.id + 'only');
            }, event.id);
        });

        syncmeta.onEdgeAdd(function(event) {
            console.info('Edge created: ' + event.id);
            addToList('Edge created: ' + event.id);
        });

        syncmeta.onEntitySelect(function(entityId) {
            console.info('Entity select: ' + entityId);
            addToList('Entity select: ' + entityId);
        });

        syncmeta.onNodeSelect(function(nodeId) {
            console.info('Node select: ' + nodeId);
            addToList('Node select: ' + nodeId);
        });

        syncmeta.onNodeDelete(function(nodeId) {
            console.info('Node was deleted: ' + nodeId);
            addToList('Node was deleted: ' + nodeId);
        });

        syncmeta.onEdgeDelete(function(nodeId) {
            addToList('Edge was deleted: ' + nodeId);
            console.info('Edge was deleted: ' + nodeId);

        });
        syncmeta.onNodeMove(function(event) {
            addToList('Node was moved: ' + event.id);
            console.info('Node was moved: ' + event.id);
        });

        syncmeta.onNodeResize(function(event) {
            addToList('Node was resized: ' + event.id);
            console.info('Node was resized: ' + event.id);
        });

        syncmeta.onNodeMoveZ(function(event) {
            addToList('Node was moved on Z: ' + event.id);
            console.info('Node was moved on Z: ' + event.id);
        });

        syncmeta.onNodeAttributeChange(function(value, entityId, attrId) {
            addToList('onNodeAttributeChange:  value: ' + value + ' entityId: ' + entityId + ' attrId: ' + attrId);
            console.info('onNodeAttributeChange:  value: ' + value + ' entityId: ' + entityId + ' attrId: ' + attrId);
        });
        syncmeta.onEdgeAttributeChange(function(value, entityId, attrId) {
            addToList('onEdgeAttributeChange:  value: ' + value + ' entityId: ' + entityId + ' attrId: ' + attrId);
            console.info('onEdgeAttributeChange:  value: ' + value + ' entityId: ' + entityId + ' attrId: ' + attrId);
        });
    });
});