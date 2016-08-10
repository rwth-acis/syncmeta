$(function() {

    var addToList = function(text) {
        var $event = $('<li></li>').text(text)
        $('#eventList').prepend($event);
        setTimeout(function() {
            $event.css('opacity', 0.5);
        }, 3000);
    }
    syncmeta.connect().done(function() {
        syncmeta.onNodeAdd(function(event) {
            addToList('Node created: ' + event.id);

            /*
            * New oberver for the events on attributes on nodes.
            */  
            syncmeta.onNodeAttributeChange(function(value, entityId, attrId) {
                addToList('onNodeAttributeChange(overrides) nodeId: ' + entityId + ' value:  ' + value + ' attrId: ' + attrId);
            });

        });

        syncmeta.onEdgeAdd(function(event) {
            addToList('Edge created: ' + event.id);
            
            //new oberserver for attribute on events on edges
            syncmeta.onEdgeAttributeChange(function(value, entityId, attrId) {
                addToList('onEdgeAttributeChange(only ' + entityId + ') + value:  ' + value + ' attrId: ' + attrId);
            });
            
        });

        syncmeta.onEntitySelect(function(entityId) {
            addToList('Entity select: ' + entityId);
        });

        syncmeta.onNodeSelect(function(nodeId) {
            addToList('Node select: ' + nodeId);
        });

        syncmeta.onNodeDelete(function(nodeId) {
            addToList('Node was deleted: ' + nodeId);
        });

        syncmeta.onEdgeDelete(function(nodeId) {
            addToList('Edge was deleted: ' + nodeId);
        });
        syncmeta.onNodeMove(function(event) {
            addToList('Node was moved: ' + event.id);
        });

        syncmeta.onNodeResize(function(event) {
            addToList('Node was resized: ' + event.id);
        });

        syncmeta.onNodeMoveZ(function(event) {
            addToList('Node was moved on Z: ' + event.id);
        });

        
        syncmeta.onNodeAttributeChange(function(value, entityId, attrId) {
            addToList('onNodeAttributeChange:  value: ' + value + ' entityId: ' + entityId + ' attrId: ' + attrId);
        });
        syncmeta.onEdgeAttributeChange(function(value, entityId, attrId) {
            addToList('onEdgeAttributeChange:  value: ' + value + ' entityId: ' + entityId + ' attrId: ' + attrId);
        });
        
        //the old NodeMove callback should be overridden by this one
        //See Line 43
        syncmeta.onNodeMove(function(e) {
            addToList('Node  was moved(overridden): '+ e.id);
        });
    });
});