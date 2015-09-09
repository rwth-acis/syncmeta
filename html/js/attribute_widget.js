/**
 * Namespace for attribute widget.
 * @namespace attribute_widget
 */

requirejs([
    'jqueryui',
    'iwcw',
    'attribute_widget/AttributeWrapper',
    'attribute_widget/EntityManager',
    'operations/non_ot/JoinOperation',
    'operations/non_ot/InitModelTypesOperation',
    'operations/non_ot/ViewInitOperation'
],function ($,IWCW,AttributeWrapper,EntityManager,JoinOperation,InitModelTypesOperation,ViewInitOperation) {

    var wrapper = new AttributeWrapper($("#wrapper"));

    var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

    function JSONtoGraph(json){
        var modelAttributesNode;
        var nodeId, edgeId;
        if(json.attributes){
            modelAttributesNode = EntityManager.createModelAttributesNodeFromJSON(json.attributes);
            wrapper.setModelAttributesNode(modelAttributesNode);
            modelAttributesNode.addToWrapper(wrapper);
            wrapper.select(modelAttributesNode);    
        }
        for(nodeId in json.nodes){
            if(json.nodes.hasOwnProperty(nodeId)){
                var node = EntityManager.createNodeFromJSON(json.nodes[nodeId].type,nodeId,json.nodes[nodeId].left,json.nodes[nodeId].top,json.nodes[nodeId].width,json.nodes[nodeId].height,json.nodes[nodeId]);
                node.addToWrapper(wrapper);
            }
        }
        for(edgeId in json.edges){
            if(json.edges.hasOwnProperty(edgeId)){
                var edge = EntityManager.createEdgeFromJSON(json.edges[edgeId].type,edgeId,json.edges[edgeId].source,json.edges[edgeId].target,json.edges[edgeId]);
                edge.addToWrapper(wrapper);
            }
        }
    }

    iwc.registerOnDataReceivedCallback(function(operation){
        var model;
        if(operation instanceof JoinOperation && operation.isDone()){
            model = operation.getData();

            JSONtoGraph(model);

            if(wrapper.getModelAttributesNode() === null) {
                var modelAttributesNode = EntityManager.createModelAttributesNode();
                wrapper.setModelAttributesNode(modelAttributesNode);
                modelAttributesNode.addToWrapper(wrapper);
                wrapper.select(modelAttributesNode);
            }

            $("#loading").hide();
        }
        else if(operation instanceof ViewInitOperation){
            if(operation.getViewpoint())
                EntityManager.initModelTypes(operation.getViewpoint());
            EntityManager.clearBin();
            var json = operation.getData();
            var nodeId, edgeId;
            for(nodeId in json.nodes){
                if(json.nodes.hasOwnProperty(nodeId)){
                    var node = EntityManager.createNodeFromJSON(json.nodes[nodeId].type,nodeId,json.nodes[nodeId].left,json.nodes[nodeId].top,json.nodes[nodeId].width,json.nodes[nodeId].height,json.nodes[nodeId],json.id);
                    node.addToWrapper(wrapper);
                    if(json.nodes[nodeId].attributes.hasOwnProperty(nodeId +'[target]'))
                        EntityManager.addToMap(json.id, json.nodes[nodeId].attributes[nodeId +'[target]'].value.value, nodeId);
                }
            }
            for(edgeId in json.edges){
                if(json.edges.hasOwnProperty(edgeId)){
                    var edge = EntityManager.createEdgeFromJSON(json.edges[edgeId].type,edgeId,json.edges[edgeId].source,json.edges[edgeId].target,json.edges[edgeId], json.id);
                    edge.addToWrapper(wrapper);
                    if(json.edges[edgeId].attributes.hasOwnProperty(nodeId +'[target]'))
                        EntityManager.addToMap(json.id, json.edges[edgeId].attributes[nodeId +'[target]'].value.value, edgeId);
                }
            }
        }
    });

    $("#q").draggable({
        axis: "y",
        start: function(){
            var $c = $("body");
            $c.css('bottom', 'inherit');
            $(this).css('height',50);
        },
        drag: function( event, ui ) {
            var height = ui.position.top;
            $("body").css('height', height);
            gadgets.window.adjustHeight();
        },
        stop: function(){
            $(this).css('height',3);
            gadgets.window.adjustHeight();
            $(this).css('top','');
        }
    });

});