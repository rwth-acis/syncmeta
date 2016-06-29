/**
 * Namespace for attribute widget.
 * @namespace attribute_widget
 */

requirejs([
    'jqueryui',
    'iwcw',
    'lib/yjs-sync',
    'attribute_widget/AttributeWrapper',
    'attribute_widget/EntityManager',
    'attribute_widget/ViewGenerator',
    'operations/non_ot/JoinOperation',
    'operations/non_ot/InitModelTypesOperation',
    'operations/non_ot/ViewInitOperation',
    'operations/non_ot/SetModelAttributeNodeOperation',
    'promise!Guidancemodel'
],function ($,IWCW,yjsSync,AttributeWrapper,EntityManager, ViewGenerator, JoinOperation,InitModelTypesOperation,ViewInitOperation, SetModelAttributeNodeOperation, guidancemodel) {

    var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

    yjsSync().done(function(y){
        window.y = y;
        console.info('ATTRIBUTE: Yjs successfully initialized');
        var model = y.share.data.get('model');
        InitAttributeWidget(model);
    }).fail(function(){
        window.y= undefined;
        InitAttributeWidget();
    });
    function InitAttributeWidget(model) {

        if(guidancemodel.isGuidanceEditor()){
            EntityManager.init(y.share.data.get('guidancemetamodel'));
            model = y.share.data.get('guidancemodel');
        }else {
            EntityManager.init(y.share.data.get('metamodel'));
        }
        var wrapper = new AttributeWrapper($("#wrapper"));

        if(model)
            JSONtoGraph(model);


        function JSONtoGraph(json) {
            var modelAttributesNode;
            var nodeId, edgeId;
            if (json.attributes && !_.isEmpty(json.attributes)) {
                modelAttributesNode = EntityManager.createModelAttributesNodeFromJSON(json.attributes);
                wrapper.setModelAttributesNode(modelAttributesNode);
                modelAttributesNode.registerYType();
                modelAttributesNode.addToWrapper(wrapper);
                //wrapper.select(modelAttributesNode);
            }
            for (nodeId in json.nodes) {
                if (json.nodes.hasOwnProperty(nodeId)) {
                    var node = EntityManager.createNodeFromJSON(json.nodes[nodeId].type, nodeId, json.nodes[nodeId].left, json.nodes[nodeId].top, json.nodes[nodeId].width, json.nodes[nodeId].height, json.nodes[nodeId]);
                    try{
                        node.registerYType();
                    }catch(e){
                        //If this fails doesn't matter initialize it with bindYTextCallback
                    }
                    node.addToWrapper(wrapper);
                }
            }
            for (edgeId in json.edges) {
                if (json.edges.hasOwnProperty(edgeId)) {
                    var edge = EntityManager.createEdgeFromJSON(json.edges[edgeId].type, edgeId, json.edges[edgeId].source, json.edges[edgeId].target, json.edges[edgeId]);
                    try{
                        edge.registerYType();

                    }catch(e){
                        //If this fails doesn't matter initialize it with bindYTextCallback

                    }
                    edge.addToWrapper(wrapper);
                }
            }
        }

        iwc.registerOnDataReceivedCallback(function (operation) {
            var modelAttributesNode/*, model*/;
            if (operation instanceof JoinOperation && operation.isDone()) {
                y.share.users.set(y.db.userId,operation.getUser());
                /*if (firstInitializationFlag)
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
                 wrapper.select(modelAttributesNode);*/

            }
            else if (operation instanceof SetModelAttributeNodeOperation) {
                modelAttributesNode = wrapper.getModelAttributesNode();
                if (modelAttributesNode === null) {
                    modelAttributesNode = EntityManager.createModelAttributesNode();
                    wrapper.setModelAttributesNode(modelAttributesNode);
                    modelAttributesNode.addToWrapper(wrapper);
                }
                wrapper.select(modelAttributesNode);
            }
            else if (operation instanceof InitModelTypesOperation) {
                var vvs = operation.getVLS();
                var metamodel = y.share.data.get('metamodel');
                if (vvs.hasOwnProperty('id')) {
                    EntityManager.initViewTypes(vvs);
                    if (operation.getViewGenerationFlag()) {
                        ViewGenerator.generate(metamodel, vvs);
                    }

                } else {
                    EntityManager.setViewId(null);
                    if (operation.getViewGenerationFlag()) {
                        ViewGenerator.reset(metamodel);
                    }
                }
            }
            else if (operation instanceof ViewInitOperation) {
                EntityManager.clearBin();

                var json = operation.getData();
                var nodeId, edgeId;
                for (nodeId in json.nodes) {
                    if (json.nodes.hasOwnProperty(nodeId)) {
                        var node = EntityManager.createNodeFromJSON(json.nodes[nodeId].type, nodeId, json.nodes[nodeId].left, json.nodes[nodeId].top, json.nodes[nodeId].width, json.nodes[nodeId].height, json.nodes[nodeId], json.id);
                        try{
                            node.registerYType();
                        }catch(e){
                            //If this fails doesn't matter initialize it with bindYTextCallback
                        }
                        node.addToWrapper(wrapper);
                        if (json.nodes[nodeId].attributes.hasOwnProperty(nodeId + '[target]'))
                            EntityManager.addToMap(json.id, json.nodes[nodeId].attributes[nodeId + '[target]'].value.value, nodeId);
                    }
                }
                for (edgeId in json.edges) {
                    if (json.edges.hasOwnProperty(edgeId)) {
                        var edge = EntityManager.createEdgeFromJSON(json.edges[edgeId].type, edgeId, json.edges[edgeId].source, json.edges[edgeId].target, json.edges[edgeId], json.id);
                        try{
                            edge.registerYType();

                        }catch(e){
                            //If this fails doesn't matter initialize it with bindYTextCallback

                        }
                        edge.addToWrapper(wrapper);
                        if (json.edges[edgeId].attributes.hasOwnProperty(nodeId + '[target]'))
                            EntityManager.addToMap(json.id, json.edges[edgeId].attributes[nodeId + '[target]'].value.value, edgeId);
                    }
                }
            }
        });




        //var firstInitializationFlag = true;

        var operation = new SetModelAttributeNodeOperation();
        iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN, operation.toNonOTOperation());

        if(CONFIG.TEST_MODE_ATTRIBUTE)
            require(['./../test/AttributeWidgetTest']);

        $("#loading").hide();
        //--------------------------------------------------------------------------
        /*
         $("#q").draggable({
         axis: "y",
         start: function () {
         var $c = $("body");
         $c.css('bottom', 'inherit');
         $(this).css('height', 50);
         },
         drag: function (event, ui) {
         var height = ui.position.top;
         $("body").css('height', height);
         gadgets.window.adjustHeight();
         },
         stop: function () {
         $(this).css('height', 3);
         gadgets.window.adjustHeight();
         $(this).css('top', '');
         }
         });*/
    }

});