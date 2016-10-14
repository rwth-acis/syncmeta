$(function() {

    var addToList = function(text) {
        var $event = $('<li></li>').text(text)
        $('#eventList').prepend($event);
        setTimeout(function() {
            $event.css('opacity', 0.5);
        }, 3000);
    }
    var nc = 0, ec = 0;

    /*It is also possible to use syncmeta.init(yInstance) if you are already connected to syncmeta yjs room.
    * This doesn't require the async promise call like above
    */
    syncmeta.connect().done(function() {
        $('#modelAttr').click(function(){
             syncmeta.setAttributeValue('modelAttributes', 'id', 'the empty model');
            syncmeta.setAttributeValue('modelAttributes', 'boolean', false);
            syncmeta.setAttributeValue('modelAttributes', 'version', 2);
            syncmeta.setAttributeValue('modelAttributes', 'enum', 'third');
        });
       
        syncmeta.onNodeAdd(function(event) {
            addToList('Node created: ' + event.id);

            /*
            * everytime a node is created a new onNodeAttributeChange observer is also created.
            * should not be used like that. This will produce a lot of callbacks. Only for testing and demonstration purposes
            * better uses this outside of such a callback like in line 65
            * New oberver for the events on attributes on nodes.
            */
            nc++;
            /*syncmeta.onNodeAttributeChange(function(value, entityId, attrId) {
                addToList('onNodeAttributeChange ' + nc + ':  nodeId: ' + entityId + ' value:  ' + value + ' attrId: ' + attrId);
            });*/

            
            //from the onNodeAdd callback setAttribute doesn't work  well because the ytext is created asynchonously on the canvas- and attribute widget
            //so we are only sure that the node is created but not the ytext attributes which belongs to the node
            // maybe a little timeout would help
            syncmeta.setAttributeValue(event.id, 'id', 'Set with on Node add');
            syncmeta.setAttributeValue(event.id, 'title', 'also set with onNodeAdd');
            syncmeta.setAttributeValue(event.id, 'bool', false);
            syncmeta.setAttributeValue(event.id, 'enum', 'second');
            syncmeta.setAttributeValue(event.id, 'number', 7353);


        });

        syncmeta.onEdgeAdd(function(event) {
            addToList('Edge created: ' + event.id);

            //new oberserver for attribute on events on edges
            ec++;
            syncmeta.onEdgeAttributeChange(function(value, entityId, attrId) {
                addToList('onEdgeAttributeChange' + ' edgeId: ' + entityId + 'value: ' + value + 'attrId: ' + attrId);
            });

        });

        syncmeta.onEntitySelect(function(entityId) {
            addToList('Entity select: ' + entityId);
        });

        syncmeta.onNodeSelect(function(nodeId) {
            addToList('Node select: ' + nodeId);
            /*syncmeta.setAttributeValue(nodeId, nodeId+'[title]', 'OnSelect');
            syncmeta.setAttributeValue(nodeId, 'isvisible', true);*/
                
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


        //Second onNode move observer
        syncmeta.onNodeMove(function(e) {
            addToList('onNodeMove2: Moved: ' + e.id);
        });
    });
});