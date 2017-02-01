/**
 * Namespace for attribute widget.
 * @namespace attribute_widget
 */

requirejs([
    'jqueryui',
    'iwcw',
    'lib/yjs-sync',
    'WaitForCanvas',
    'attribute_widget/AttributeWrapper',
    'attribute_widget/EntityManager',
    'attribute_widget/view/ViewGenerator',
    'operations/non_ot/InitModelTypesOperation',
    'operations/non_ot/ViewInitOperation',
    'operations/non_ot/SetModelAttributeNodeOperation',
    'promise!Guidancemodel'
], function ($, IWCW, yjsSync, WaitForCanvas, AttributeWrapper, EntityManager, ViewGenerator, InitModelTypesOperation, ViewInitOperation, SetModelAttributeNodeOperation, guidancemodel) {
    WaitForCanvas(CONFIG.WIDGET.NAME.ATTRIBUTE, 7).done(function (user) {
        $('#wrapper').find('h1').text('Got Response from Canvas! Connecting to Yjs....');
        var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);
        iwc.setSpace(user);
        
        yjsSync().done(function (y) {
            window.y = y;
            window.syncmetaLog = {
                widget: "Attribute",
                initializedYTexts: 0,
                objects: {},
                errors: {},
                firstAttemptFail: {}
            };
            $('#wrapper').find('h1').text('Successfully connected to Yjs.');
            setTimeout(function () {
                $('#wrapper').find('h1').remove();
            }, 2000);
            console.info('ATTRIBUTE: Yjs successfully initialized');
            y.share.users.set(y.db.userId, iwc.getUser()[CONFIG.NS.PERSON.JABBERID]);

            var model = y.share.data.get('model');
            InitAttributeWidget(model);
        });
        function InitAttributeWidget(model) {

            if (guidancemodel.isGuidanceEditor()) {
                EntityManager.init(y.share.data.get('guidancemetamodel'));
                model = y.share.data.get('guidancemodel');
            } else {
                EntityManager.init(y.share.data.get('metamodel'));
            }
            var wrapper = new AttributeWrapper($("#wrapper"));

            if (model)
                JSONtoGraph(model);
            console.info('ATTRIBUTE: Initialization of model completed' , window.syncmetaLog);


            function JSONtoGraph(json) {
                var modelAttributesNode;
                var nodeId, edgeId;
                if (json.attributes && !_.isEmpty(json.attributes)) {
                    modelAttributesNode = EntityManager.createModelAttributesNodeFromJSON(json.attributes);
                    wrapper.setModelAttributesNode(modelAttributesNode);
                    modelAttributesNode.registerYType();
                    modelAttributesNode.addToWrapper(wrapper);
                    wrapper.select(modelAttributesNode);
                }
                for (nodeId in json.nodes) {
                    if (json.nodes.hasOwnProperty(nodeId)) {
                        var node = EntityManager.createNodeFromJSON(json.nodes[nodeId].type, nodeId, json.nodes[nodeId].left, json.nodes[nodeId].top, json.nodes[nodeId].width, json.nodes[nodeId].height, json.nodes[nodeId]);
                        node.registerYType();
                        node.addToWrapper(wrapper);
                    }
                }
                for (edgeId in json.edges) {
                    if (json.edges.hasOwnProperty(edgeId)) {
                        var edge = EntityManager.createEdgeFromJSON(json.edges[edgeId].type, edgeId, json.edges[edgeId].source, json.edges[edgeId].target, json.edges[edgeId]);
                        edge.registerYType();
                        edge.addToWrapper(wrapper);
                    }
                }
            }

            iwc.registerOnDataReceivedCallback(function (operation) {
                var modelAttributesNode;
                 if (operation instanceof SetModelAttributeNodeOperation) {
                    modelAttributesNode = wrapper.getModelAttributesNode();
                    if (modelAttributesNode === null) {
                        modelAttributesNode = EntityManager.createModelAttributesNode();
                        wrapper.setModelAttributesNode(modelAttributesNode);
                        modelAttributesNode.registerYType();
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
            });

            var operation = new SetModelAttributeNodeOperation();
            iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN, operation.toNonOTOperation());

            if (CONFIG.TEST.ATTRIBUTE && (iwc.getUser()[CONFIG.NS.PERSON.TITLE] === CONFIG.TEST.USER || iwc.getUser()[CONFIG.NS.PERSON.MBOX] === CONFIG.TEST.EMAIL))
                require(['./../test/AttributeWidgetTest']);

            y.share.canvas.observe(function (event) {
                switch (event.name) {
                    case 'ReloadWidgetOperation': {
                        frameElement.contentWindow.location.reload();
                    }
                }
            });

            $("#loading").hide();
        }
    }).fail(function () {
        $('#wrapper').find('h1').text('Add Canvas Widget to Space and refresh the widget.');
        $('#loading').hide();
    });



});