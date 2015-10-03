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
    'operations/non_ot/SetModelAttributeNodeOperation',
    'promise!Model',
    'promise!Guidancemodel'
],function ($,IWCW,AttributeWrapper,EntityManager,JoinOperation, SetModelAttributeNodeOperation, model, guidancemodel) {

    var wrapper = new AttributeWrapper($("#wrapper"));

    var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

    if(guidancemodel.isGuidanceEditor()){
        model = guidancemodel.guidancemodel;
    }

    function JSONtoGraph(json){
        console.log("jsontograph");
        console.log(json);
        var modelAttributesNode;
        var nodeId, edgeId;
        if(json.attributes){
            modelAttributesNode = EntityManager.createModelAttributesNodeFromJSON(json.attributes);
            wrapper.setModelAttributesNode(modelAttributesNode);
            modelAttributesNode.addToWrapper(wrapper);
            //wrapper.select(modelAttributesNode);
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
        var model, modelAttributesNode;
        if(operation instanceof JoinOperation && operation.isDone()){
            if(firstInitializationFlag)
                firstInitializationFlag = false;
            else {
                model = operation.getData();

                JSONtoGraph(model);

                $("#loading").hide();
            }

            modelAttributesNode = wrapper.getModelAttributesNode();
            if (modelAttributesNode === null) {
                modelAttributesNode = EntityManager.createModelAttributesNode();
                wrapper.setModelAttributesNode(modelAttributesNode);
                modelAttributesNode.addToWrapper(wrapper);
            }
            wrapper.select(modelAttributesNode);

        }
        else if(operation instanceof SetModelAttributeNodeOperation){
            modelAttributesNode = wrapper.getModelAttributesNode();
            if (modelAttributesNode === null) {
                modelAttributesNode = EntityManager.createModelAttributesNode();
                wrapper.setModelAttributesNode(modelAttributesNode);
                modelAttributesNode.addToWrapper(wrapper);
            }
            wrapper.select(modelAttributesNode);
        }
    });

    JSONtoGraph(model);

    var firstInitializationFlag = true;

    var operation = new SetModelAttributeNodeOperation();
    iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN, operation.toNonOTOperation());

    $("#loading").hide();

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