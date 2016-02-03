/**
 * Namespace for attribute widget.
 * @namespace attribute_widget
 */

requirejs([
    'jqueryui',
    'iwcw',
    'attribute_widget/AttributeWrapper',
    'attribute_widget/EntityManager',
    'attribute_widget/ViewGenerator',
    'operations/non_ot/JoinOperation',
    'operations/non_ot/InitModelTypesOperation',
    'operations/non_ot/ViewInitOperation',
    'operations/non_ot/SetModelAttributeNodeOperation',
    'promise!Model',
    'promise!Guidancemodel'
],function ($,IWCW,AttributeWrapper,EntityManager, ViewGenerator, JoinOperation,InitModelTypesOperation,ViewInitOperation, SetModelAttributeNodeOperation, model,guidancemodel) {

    var wrapper = new AttributeWrapper($("#wrapper"));

    var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

    if(guidancemodel.isGuidanceEditor()){
        model = guidancemodel.guidancemodel;
    }

    function JSONtoGraph(json){
        var modelAttributesNode;
        var nodeId, edgeId;
        if(json.attributes && !_.isEmpty(json.attributes)){
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
        else if(operation instanceof InitModelTypesOperation) {
            var vvs = operation.getVLS();

            if (vvs.hasOwnProperty('id')) {
                EntityManager.initViewTypes(vvs);
                if(operation.getViewGenerationFlag()) {
                    require(['promise!Metamodel'], function (metamodel) {
                        ViewGenerator.generate(metamodel, vvs);
                    });
                }

            }else{
                EntityManager.setViewId(null);
                if(operation.getViewGenerationFlag()) {
                    require(['promise!Metamodel'], function (metamodel) {
                        ViewGenerator.reset(metamodel);
                    });
                }
            }
        }
        else if(operation instanceof ViewInitOperation){
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

    //-----------------------------------------------------------------------------
    // the attribute widget loads the model directly from the role resource space.
    // attribute widget no longer waits for the JoinOperation from the canvas. This should speed up the initialization a bit.
    // To revert these changes uncomment line 45-60
    JSONtoGraph(model);

    var firstInitializationFlag = true;

    var operation = new SetModelAttributeNodeOperation();
    iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN, operation.toNonOTOperation());

    $("#loading").hide();
    //--------------------------------------------------------------------------

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