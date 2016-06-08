/**
 * Namespace for canvas widget.
 * @namespace canvas_widget
 */

requirejs([
    'jqueryui',
    'jsplumb',
    'iwcw',
    'lib/yjs-sync',
    'Util',
    'operations/non_ot/NonOTOperation',
    'operations/non_ot/ToolSelectOperation',
    'operations/non_ot/ActivityOperation',
    'operations/non_ot/JoinOperation',
    'operations/non_ot/ViewInitOperation',
    'operations/non_ot/UpdateViewListOperation',
    'operations/non_ot/DeleteViewOperation',
    'operations/non_ot/SetViewTypesOperation',
    'operations/non_ot/InitModelTypesOperation',
    'operations/non_ot/SetModelAttributeNodeOperation',
    'canvas_widget/Canvas',
    'canvas_widget/EntityManager',
    'canvas_widget/NodeTool',
    'canvas_widget/ObjectNodeTool',
    'canvas_widget/AbstractClassNodeTool',
    'canvas_widget/RelationshipNodeTool',
    'canvas_widget/RelationshipGroupNodeTool',
    'canvas_widget/EnumNodeTool',
    'canvas_widget/NodeShapeNodeTool',
    'canvas_widget/EdgeShapeNodeTool',
    'canvas_widget/EdgeTool',
    'canvas_widget/GeneralisationEdgeTool',
    'canvas_widget/BiDirAssociationEdgeTool',
    'canvas_widget/UniDirAssociationEdgeTool',
    'canvas_widget/ObjectNode',
    'canvas_widget/AbstractClassNode',
    'canvas_widget/RelationshipNode',
    'canvas_widget/RelationshipGroupNode',
    'canvas_widget/EnumNode',
    'canvas_widget/NodeShapeNode',
    'canvas_widget/EdgeShapeNode',
    'canvas_widget/GeneralisationEdge',
    'canvas_widget/BiDirAssociationEdge',
    'canvas_widget/UniDirAssociationEdge',
    'canvas_widget/ViewObjectNode',
    'canvas_widget/ViewObjectNodeTool',
    'canvas_widget/ViewRelationshipNode',
    'canvas_widget/ViewRelationshipNodeTool',
    'canvas_widget/ViewManager',
    'canvas_widget/ViewGenerator',
    'canvas_widget/HistoryManager',
    'promise!Space'
    //'promise!Guidancemodel'
],function($,jsPlumb,IWCW, yjsSync,Util,NonOTOperation,ToolSelectOperation,ActivityOperation,JoinOperation, ViewInitOperation, UpdateViewListOperation, DeleteViewOperation,SetViewTypesOperation, InitModelTypesOperation, SetModelAttributeNodeOperation, Canvas,EntityManager,NodeTool,ObjectNodeTool,AbstractClassNodeTool,RelationshipNodeTool,RelationshipGroupNodeTool,EnumNodeTool,NodeShapeNodeTool,EdgeShapeNodeTool,EdgeTool,GeneralisationEdgeTool,BiDirAssociationEdgeTool,UniDirAssociationEdgeTool,ObjectNode,AbstractClassNode,RelationshipNode,RelationshipGroupNode,EnumNode,NodeShapeNode,EdgeShapeNode,GeneralisationEdge,BiDirAssociationEdge,UniDirAssociationEdge, ViewObjectNode, ViewObjectNodeTool,ViewRelationshipNode, ViewRelationshipNodeTool, ViewManager, ViewGenerator, HistoryManager,space/*,guidancemodel*/) {

    var _iwcw;
    _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);
    _iwcw.setSpace(space);

    yjsSync().done(function(y){
        window.y = y;
        console.info('CANVAS: Yjs Initialized successfully');

        y.share.users.set(y.db.userId,_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
        var userInfo = _iwcw.getUser();
        if(userInfo.globalId === -1)
            userInfo.globalId = y.share.userList.keysPrimitives().length;
        y.share.userList.set(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID], userInfo);
        var metamodel = y.share.data.get('metamodel');
        var model = y.share.data.get('model');
        InitMainWidget(metamodel, model);


    }).fail(function(){
        console.info("yjs log: Yjs intialization failed!");
        window.y = undefined;
        InitMainWidget();
    });
    function InitMainWidget(metamodel, model) {

        EntityManager.init(metamodel);
        var userList = [];
        var canvas = new Canvas($("#canvas"));
        y.share.join.observe(function(event){
            userList.push(event.name);
            if(!event.value && event.name !== _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]){
                y.share.join.set(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID], true);
            }else if(event.name === _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] && !event.value){
                if (metamodel) {
                    var op = new InitModelTypesOperation(metamodel);
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, op.toNonOTOperation());
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, op.toNonOTOperation());
                }

                var joinOperation = new JoinOperation(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],true, y.db.userId);
                _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, joinOperation.toNonOTOperation());
                if(model)
                    JSONtoGraph(model).done(function(stats){
                        console.info(stats);
                        $("#loading").hide();
                        canvas.resetTool();
                        if(CONFIG.TEST_MODE)
                            require(['./../test/CanvasWidgetTest'], function(CanvasWidgetTest){
                                CanvasWidgetTest(canvas);
                            });
                    });
                else{
                    $("#loading").hide();
                    canvas.resetTool();
                }

                _iwcw.registerOnDataReceivedCallback(function (operation) {
                    if (operation instanceof SetModelAttributeNodeOperation) {
                        _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, new SetModelAttributeNodeOperation().toNonOTOperation());
                    }
                    else if (operation instanceof UpdateViewListOperation) {
                        y.share.canvas.set(UpdateViewListOperation.TYPE, true);
                    }
                    else if(operation.hasOwnProperty('getType') && operation.getType() === 'WaitForCanvasOperation'){
                        _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, new NonOTOperation('WaitForCanvasOperation', JSON.stringify(userList)));
                    }
                });
                y.share.canvas.observePath([UpdateViewListOperation.TYPE],function(){
                    ViewManager.GetViewpointList();
                });

                if (canvas.getModelAttributesNode() === null) {
                    var modelAttributesNode = EntityManager.createModelAttributesNode();
                    canvas.setModelAttributesNode(modelAttributesNode);
                    modelAttributesNode.addToCanvas(canvas);
                }
                canvas.resetTool();
            }
        });
        /*
         if (guidancemodel.isGuidanceEditor()) {
         //Set the model which is shown by the editor to the guidancemodel
         model = guidancemodel.guidancemodel;
         //Set the metamodel to the guidance metamodel
         metamodel = guidancemodel.guidancemetamodel;
         }*/

        if (metamodel) {
            if (metamodel.hasOwnProperty("nodes")) {
                var nodes = metamodel.nodes, node;
                for (var nodeId in nodes) {
                    if (nodes.hasOwnProperty(nodeId)) {
                        node = nodes[nodeId];
                        canvas.addTool(node.label, new NodeTool(node.label, null, null, node.shape.defaultWidth, node.shape.defaultHeight));
                    }
                }
            }
            if (metamodel.hasOwnProperty("edges")) {
                var edges = metamodel.edges, edge;
                for (var edgeId in edges) {
                    if (edges.hasOwnProperty(edgeId)) {
                        edge = edges[edgeId];
                        canvas.addTool(edge.label, new EdgeTool(edge.label, edge.relations));
                    }
                }
            }
            ViewManager.GetViewpointList();


            //Not needed int the model editor
            $("#btnCreateViewpoint").hide();
            $('#btnDelViewPoint').hide();

            //init the new tools for the canvas
            var initTools = function (vvs) {
                //canvas.removeTools();
                //canvas.addTool(MoveTool.TYPE, new MoveTool());
                if (vvs && vvs.hasOwnProperty("nodes")) {
                    var nodes = vvs.nodes, node;
                    for (var nodeId in nodes) {
                        if (nodes.hasOwnProperty(nodeId)) {
                            node = nodes[nodeId];
                            canvas.addTool(node.label, new NodeTool(node.label, null, null, node.shape.defaultWidth, node.shape.defaultHeight));
                        }
                    }
                }

                if (vvs && vvs.hasOwnProperty("edges")) {
                    var edges = vvs.edges, edge;
                    for (var edgeId in edges) {
                        if (edges.hasOwnProperty(edgeId)) {
                            edge = edges[edgeId];
                            canvas.addTool(edge.label, new EdgeTool(edge.label, edge.relations));
                        }
                    }
                }
            };

            //Modeling layer implementation. View generation process starts here
            $('#btnShowView').click(function () {
                //Get identifier of the current selected view
                var viewId = ViewManager.getViewIdOfSelected();
                var $currentViewIdLabel = $('#lblCurrentViewId');
                if (viewId === $currentViewIdLabel.text())
                    return;

                var vvs = y.share.views.get(viewId);
                EntityManager.initViewTypes(vvs);

                //send the new tools to the palette as well
                var operation = new InitModelTypesOperation(vvs, true).toNonOTOperation();
                _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation);
                _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation);

                var activityOperation = new ActivityOperation("ViewApplyActivity", vvs.id, _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
                _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, activityOperation.toNonOTOperation());
                y.share.canvas.set('ViewApplyActivity', {viewId:viewId, jabberId:_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]});

                //init the tools for canvas
                initTools(vvs);
                ViewGenerator.generate(metamodel, vvs);

                $('#lblCurrentView').show();
                $currentViewIdLabel.text(viewId);

                //});
                //}

            });

            //Modelling layer implementation
            $('#viewsHide').click(function () {
                $(this).hide();
                $('#viewsShow').show();
                $('#ViewCtrlContainer').hide();
                $('#canvas-frame').css('margin-top', '32px');
                var $lblCurrentViewId = $('#lblCurrentViewId');
                var viewpointId = $lblCurrentViewId.text();
                if (viewpointId.length > 0) {
                    //var $loading = $("#loading");
                    //$loading.show();


                    //reset view
                    var operation = new InitModelTypesOperation(metamodel, true);
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation.toNonOTOperation());
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.toNonOTOperation());

                    var activityOperation = new ActivityOperation("ViewApplyActivity", '', _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, activityOperation.toNonOTOperation());
                    y.share.canvas.set('ViewApplyActivity', {viewId:'', jabberId:_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]});


                    EntityManager.setViewId(null);
                    EntityManager.initModelTypes(metamodel);
                    initTools(metamodel);

                    ViewGenerator.reset(metamodel);

                    $('#lblCurrentView').hide();
                    $lblCurrentViewId.text("");
                    // $loading.hide();
                }
            });

            var $saveImage = $("#save_image");
            $saveImage.show();
            $saveImage.click(function(){
                canvas.toPNG().then(function(uri){
                    var link = document.createElement('a');
                    link.download = "export.png";
                    link.href = uri;
                    link.click();
                });
            });

        }
        else {
            //Add Node Tools
            canvas.addTool(ObjectNode.TYPE, new ObjectNodeTool());
            canvas.addTool(AbstractClassNode.TYPE, new AbstractClassNodeTool());
            canvas.addTool(RelationshipNode.TYPE, new RelationshipNodeTool());
            canvas.addTool(RelationshipGroupNode.TYPE, new RelationshipGroupNodeTool());
            canvas.addTool(EnumNode.TYPE, new EnumNodeTool());
            canvas.addTool(NodeShapeNode.TYPE, new NodeShapeNodeTool());
            canvas.addTool(EdgeShapeNode.TYPE, new EdgeShapeNodeTool());

            //Add Edge Tools
            canvas.addTool(GeneralisationEdge.TYPE, new GeneralisationEdgeTool());
            canvas.addTool(BiDirAssociationEdge.TYPE, new BiDirAssociationEdgeTool());
            canvas.addTool(UniDirAssociationEdge.TYPE, new UniDirAssociationEdgeTool());

            //Add View Types
            canvas.addTool(ViewObjectNode.TYPE, new ViewObjectNodeTool());
            canvas.addTool(ViewRelationshipNode.TYPE, new ViewRelationshipNodeTool());

            //Init control elements for views
            $("#btnCreateViewpoint").click(function () {
                ShowViewCreateMenu();
            });
            $('#btnCancelCreateViewpoint').click(function () {
                HideCreateMenu();
            });

            $('#btnShowView').click(function () {
                var viewId = ViewManager.getViewIdOfSelected();
                if (viewId === $('#lblCurrentViewId').text())
                    return;
                $("#loading").show();
                visualizeView(viewId);
            });

            $('#btnDelViewPoint').click(function () {
                var viewId = ViewManager.getViewIdOfSelected();
                if (viewId !== $('#lblCurrentViewId').text()) {
                    y.share.views.set(viewId, null);
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, new DeleteViewOperation(viewId).toNonOTOperation());

                }
                else {
                    y.share.views.set(viewId, null);
                    $('#viewsHide').click();
                }
            });

            $('#btnAddViewpoint').click(function () {
                var viewId = $('#txtNameViewpoint').val();
                if (ViewManager.existsView(viewId)) {
                    alert('View already exists');
                    return;
                }
                var $loading = $('#loading');
                $loading.show();
                resetCanvas();
                $('#lblCurrentView').show();
                $('#lblCurrentViewId').text(viewId);
                canvas.get$canvas().show();
                HideCreateMenu();
                y.share.canvas.set(UpdateViewListOperation.TYPE, true);
                $loading.hide();
            });

            //Meta-modelling layer implementation
            $('#viewsHide').click(function () {
                $(this).hide();
                $('#viewsShow').show();
                $('#ViewCtrlContainer').hide();
                $('#canvas-frame').css('margin-top', '32px');
                var $lblCurrentViewId = $('#lblCurrentViewId');
                if ($lblCurrentViewId.text().length > 0) {
                    var $loading = $("#loading");
                    $loading.show();

                    var model = y.share.data.get('model');
                    //Disable the view types in the palette
                    var operation = new SetViewTypesOperation(false);
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation.toNonOTOperation());

                    var activityOperation = new ActivityOperation("ViewApplyActivity", '', _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, activityOperation.toNonOTOperation());
                    y.share.canvas.set('ViewApplyActivity', {viewId:'', jabberId:_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]});


                    resetCanvas();
                    JSONtoGraph(model).done(function(){
                        $("#loading").hide();
                        canvas.resetTool();
                    });
                    $('#lblCurrentView').hide();
                    $lblCurrentViewId.text("");
                    EntityManager.setViewId(null);
                }
            })
        }

        //Functions and Callbacks for the view-based modeling approach
        var ShowViewCreateMenu = function () {
            $('#btnCreateViewpoint').hide();
            $('#ddmViewSelection').hide();
            $('#btnShowView').hide();
            $('#btnDelViewPoint').hide();
            $('#txtNameViewpoint').show();
            $('#btnAddViewpoint').show();
            $('#btnCancelCreateViewpoint').show();
        };
        var HideCreateMenu = function () {
            $('#btnCreateViewpoint').show();
            $('#ddmViewSelection').show();
            $('#btnDelViewPoint').show();
            $('#btnShowView').show();
            $('#txtNameViewpoint').hide();
            $('#btnAddViewpoint').hide();
            $('#btnCancelCreateViewpoint').hide();

        };

        function resetCanvas() {
            var edges = EntityManager.getEdges();
            for (edgeId in edges) {
                if (edges.hasOwnProperty(edgeId)) {
                    var edge = EntityManager.findEdge(edgeId);
                    edge.remove();
                    //edge.triggerDeletion();
                }
            }
            var nodes = EntityManager.getNodes();
            for (nodeId in nodes) {
                if (nodes.hasOwnProperty(nodeId)) {
                    var node = EntityManager.findNode(nodeId);
                    //node.triggerDeletion();
                    node.remove();
                }
            }
            EntityManager.deleteModelAttribute();
            EntityManager.clearBin();

        }

        var visualizeView = function (viewId) {
            //ViewManager.getViewResource(viewId).getRepresentation('rdfjson', function (viewData) {
            var viewData = y.share.views.get(viewId);
            if(viewData) {
                resetCanvas();
                ViewToGraph(viewData);
                $('#lblCurrentView').show();
                $('#lblCurrentViewId').text(viewData.id);
                EntityManager.setViewId(viewData.id);
                canvas.resetTool();

            }
            //});
        };

        function ViewToGraph(json) {
            //Initialize the attribute widget
            var operation = new ViewInitOperation(json);
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.toNonOTOperation());

            //Enable the view types in the palette
            operation = new SetViewTypesOperation(true);
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation.toNonOTOperation());

            var activityOperation = new ActivityOperation("ViewApplyActivity", json.id, _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, activityOperation.toNonOTOperation());
            y.share.canvas.set('ViewApplyActivity', {viewId:json.id, jabberId:_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]});

            JSONtoGraph(json).done(function(){
                $("#loading").hide();
                canvas.resetTool();
            });
        }


        //-------------------------------------------------------------
        var createYTextAttribute = function(map,val){
            //var deferred = $.Deferred();
            var promise = map.get(val.getEntityId());
            if(promise === undefined){
                map.set(val.getEntityId(), Y.Text).then(function(ytext){
                    if(!val.hasOwnProperty('registerYType'))
                        val.getValue().registerYType(ytext);
                    else
                        val.registerYType(ytext);
                    //deferred.resolve();
                });
            }
            else {
                map.get(val.getEntityId()).then(function(ytext){
                    if(!val.hasOwnProperty('registerYType'))
                        val.getValue().registerYType(ytext);
                    else
                        val.registerYType(ytext);

                    //deferred.resolve();

                })
            }
            //return deferred.promise();
        };
        function JSONtoGraph(json){
            var deferred = $.Deferred();
            function createModelAttributeCallback(map){
                var promises = [];
                var modelAttributesNode = EntityManager.createModelAttributesNodeFromJSON(json.attributes);


                var attrs = modelAttributesNode.getAttributes();
                for(var key in attrs){
                    if(attrs.hasOwnProperty(key)){
                        var val = attrs[key].getValue();
                        if(val.constructor.name === "Value" || val.constructor.name === "MultiLineValue"){
                            promises.push(createYTextAttribute(map,val));
                        }
                    }
                }


                if(promises.length >0) {
                    $.when.apply(null, promises).done(function () {
                        modelAttributesNode.registerYMap(map,true);
                        canvas.setModelAttributesNode(modelAttributesNode);
                        modelAttributesNode.addToCanvas(canvas);
                    });
                }else{
                    modelAttributesNode.registerYMap(map,true);
                    canvas.setModelAttributesNode(modelAttributesNode);
                    modelAttributesNode.addToCanvas(canvas);
                }

            }

            if (json.attributes && !_.isEmpty(json.attributes)){
                if (y.share.nodes.opContents.hasOwnProperty('modelAttributes')) {
                    y.share.nodes.get('modelAttributes').then(function (map) {
                        createModelAttributeCallback(map);
                    });
                } else {
                    y.share.nodes.set('modelAttributes', Y.Map).then(function (map) {
                        createModelAttributeCallback(map);
                    });

                }
            }

            function createNodeCallback(deferred,map, jsonNode,nodeId){
                var node = EntityManager.createNodeFromJSON(
                    jsonNode.type,
                    nodeId,
                    map.get('left')? map.get('left'): jsonNode.left,
                    map.get('top') ? map.get('top'): jsonNode.top,
                    map.get('width') ? map.get('width') : jsonNode.width,
                    map.get('height') ? map.get('height') : jsonNode.height,
                    map.get('zIndex') ? map.get('zIndex'): jsonNode.zIndex,
                    jsonNode);


                var promises = [];
                var attrs, attr;
                if(EntityManager.getLayer()===CONFIG.LAYER.META){
                    //promises.push(createYTextAttribute(map,node.getLabel()));
                    createYTextAttribute(map,node.getLabel());
                    if(jsonNode.type === "Edge Shape"){
                        //promises.push(createYTextAttribute(map,node.getAttribute(nodeId+'[color]')));
                        createYTextAttribute(map,node.getAttribute(nodeId+'[color]'));
                        //promises.push(createYTextAttribute(map,node.getAttribute(nodeId+'[overlay]')));
                        createYTextAttribute(map,node.getAttribute(nodeId+'[overlay]'));

                    }else if(jsonNode.type === "Node Shape"){
                        //promises.push(createYTextAttribute(map,node.getAttribute(nodeId  +'[color]')));
                        createYTextAttribute(map,node.getAttribute(nodeId  +'[color]'));
                        //promises.push(createYTextAttribute(map,node.getAttribute(nodeId+'[customAnchors]')));
                        createYTextAttribute(map,node.getAttribute(nodeId+'[customAnchors]'));
                        //promises.push(createYTextAttribute(map,node.getAttribute(nodeId+'[customShape]')));
                        createYTextAttribute(map,node.getAttribute(nodeId+'[customShape]'));
                    }
                    else if(jsonNode.type === 'Object' || jsonNode.type === 'Relationship' || jsonNode.type === 'Abstract Class'){
                        attrs = node.getAttribute('[attributes]').getAttributes();
                        for(var attrKey in attrs){
                            if(attrs.hasOwnProperty(attrKey)) {
                                attr = attrs[attrKey];
                                //promises.push(createYTextAttribute(map, attr.getKey()));
                                createYTextAttribute(map, attr.getKey());
                            }
                        }
                    }
                    else if(jsonNode.type==='Enumeration'){
                        attrs = node.getAttribute('[attributes]').getAttributes();
                        for(var attrKey2 in attrs){
                            if(attrs.hasOwnProperty(attrKey2)) {
                                attr = attrs[attrKey2];
                                //promises.push(createYTextAttribute(map, attr.getValue()));
                                createYTextAttribute(map, attr.getValue());
                            }
                        }
                    }else if(jsonNode.type ==='ViewObject' || jsonNode.type === 'ViewRelationship'){
                        attrs = node.getAttribute('[attributes]').getAttributes();
                        for(var attrKey3 in attrs){
                            if(attrs.hasOwnProperty(attrKey3)) {
                                attr = attrs[attrKey3];
                                //promises.push(createYTextAttribute(map, attr.getValue()));
                                createYTextAttribute(map, attr.getKey());
                            }
                        }
                        if(node.getAttribute('[condition]')) {
                            var conditions = node.getAttribute('[condition]').getAttributes();
                            for (var attrKey4 in conditions) {
                                if (conditions.hasOwnProperty(attrKey4)) {
                                    attr = conditions[attrKey4];
                                    //promises.push(createYTextAttribute(map, attr.getValue()));
                                    createYTextAttribute(map, attr.getKey());
                                }
                            }
                        }
                    }
                }
                else{
                    attrs = node.getAttributes();
                    for(var key in attrs){
                        if(attrs.hasOwnProperty(key)){
                            var val = attrs[key].getValue();
                            if(val.constructor.name === "Value" ){
                                //promises.push(createYTextAttribute(map,val));
                                createYTextAttribute(map,val);
                            }
                        }
                    }

                }

                if(promises.length >0) {
                    $.when.apply(null, promises).done(function () {
                        node.registerYMap(map,true);
                        node.addToCanvas(canvas);
                        node.draw();
                        deferred.resolve(nodeId);
                    });
                }else{
                    node.registerYMap(map,true);
                    node.addToCanvas(canvas);
                    node.draw();
                    deferred.resolve(nodeId);
                }
            }
            function createNode(nodeId,jsonNode){
                var deferred = $.Deferred();
                if(y.share.nodes.opContents.hasOwnProperty(nodeId)){
                    y.share.nodes.get(nodeId).then(function(map){
                        createNodeCallback(deferred, map, jsonNode,nodeId);
                    })
                }else{
                    y.share.nodes.set(nodeId, Y.Map).then(function(map){

                        map.set('left',  jsonNode.left);
                        map.set('top', jsonNode.top);
                        map.set('width', jsonNode.width);
                        map.set('height',jsonNode.height);
                        map.set('zIndex',jsonNode.zIndex);
                        createNodeCallback(deferred,map,jsonNode,nodeId);

                    })
                }
                return deferred.promise();
            }

            var numberOfNodes = _.keys(json.nodes).length;
            var numberOfEdges = _.keys(json.edges).length;
            var createdNodes=0;
            var createdEdges=0;

            function createNodes(nodes){
                var deferred = $.Deferred();
                for(var nodeId in nodes){
                    if(nodes.hasOwnProperty(nodeId)){
                        createNode(nodeId, nodes[nodeId]).done(function(){
                            createdNodes++;
                            deferred.notify(createdNodes);
                        });
                    }
                }
                return deferred.promise();
            }

            function registerEdgeCallback(deferred,edge, map){
                var promises = [];
                //promises.push(createYTextAttribute(map,edge.getLabel()));
                createYTextAttribute(map,edge.getLabel());
                if(EntityManager.getLayer() === CONFIG.LAYER.MODEL){
                    var attrs = edge.getAttributes();
                    for(var key in attrs){
                        if(attrs.hasOwnProperty(key)){
                            var val = attrs[key].getValue();
                            if(val.constructor.name === "Value" ){
                                //promises.push(createYTextAttribute(map,val));
                                createYTextAttribute(map,val);
                            }
                        }
                    }
                }

                if(promises.length >0) {
                    $.when.apply(null, promises).done(function () {
                        edge.registerYMap(map,true);
                        edge.addToCanvas(canvas);
                        edge.connect();
                        deferred.resolve();
                        //canvas.resetTool();

                    });
                }else{
                    edge.registerYMap(map,true);
                    edge.addToCanvas(canvas);
                    edge.connect();
                    deferred.resolve();
                    //canvas.resetTool();
                }
            }
            function registerEdge(edge){
                var deferred = $.Deferred();
                if(y.share.edges.opContents.hasOwnProperty(edge.getEntityId())){
                    y.share.edges.get(edge.getEntityId()).then(function(map){
                        registerEdgeCallback(deferred, edge,map);
                    })
                }else{
                    y.share.edges.set(edge.getEntityId(), Y.Map).then(function(map){
                        registerEdgeCallback(deferred,edge,map);
                    })
                }
                return deferred.promise();

            }
            function registerEdges(edges){
                var deferred = $.Deferred();
                for (edgeId in edges) {
                    if (edges.hasOwnProperty(edgeId)) {
                        //create edge
                        var edge = EntityManager.createEdgeFromJSON(edges[edgeId].type, edgeId, edges[edgeId].source, edges[edgeId].target, edges[edgeId]);

                        //register it to Yjs and draw it to the canvas
                        registerEdge(edge).done(function(){
                            createdEdges++;
                            deferred.notify(createdEdges);
                        });
                    }
                }
                return deferred.promise();
            }
            if(numberOfNodes>0) {
                createNodes(json.nodes).then(null, null, function (createdNodes) {
                    if (createdNodes === numberOfNodes) {
                        if (numberOfEdges > 0) {
                            registerEdges(json.edges).then(null, null, function (createdEdges) {
                                if (createdEdges === numberOfEdges) {
                                    canvas.resetTool();
                                    deferred.resolve('SYNCMETA:Created nodes:' + createdNodes +'Created Edges: ' + createdEdges);

                                }
                            });
                        } else
                            deferred.resolve('SYNCMETA:Created nodes:' + createdNodes);
                    }
                });
            }else
                deferred.resolve('SYNCMETA: Model is empty');
            return deferred.promise();
        }

        var $undo = $("#undo");
        var $redo = $("#redo");

        $undo.click(function () {
            HistoryManager.undo();
        });
        if(y.share.undo.length === 0)
            $undo.prop('disabled', true);

        $redo.click(function () {
            HistoryManager.redo();
        });
        if(y.share.redo.length === 0)
            $redo.prop('disabled', true);


        $("#q").draggable({
            axis: "y",
            start: function () {
                var $c = $("#canvas-frame");
                $c.css('bottom', 'inherit');
                $(this).css('height', 50);
            },
            drag: function (event, ui) {
                var height = ui.position.top - 30;
                $("#canvas-frame").css('height', height);
                gadgets.window.adjustHeight();
            },
            stop: function () {
                $(this).css('height', 3);
                gadgets.window.adjustHeight();
                $(this).css('top', '');
            }
        });

        $("#showtype").click(function () {
            canvas.get$node().removeClass("hide_type");
            $(this).hide();
            $("#hidetype").show();
        }).hide();

        $("#hidetype").click(function () {
            canvas.get$node().addClass("hide_type");
            $(this).hide();
            $("#showtype").show();
        });

        $('#viewsShow').click(function () {
            $(this).hide();
            $('#viewsHide').show();
            $('#ViewCtrlContainer').show();
            $('#canvas-frame').css('margin-top', '64px');
        });

        $("#zoomin").click(function () {
            canvas.setZoom(canvas.getZoom() + 0.1);
        });

        $("#zoomout").click(function () {
            canvas.setZoom(canvas.getZoom() - 0.1);
        });

        var $feedback = $("#feedback");

        var saveFunction = function () {
            $feedback.text("Saving...");

            var viewId = $('#lblCurrentViewId').text();
            if (viewId.length > 0 && !metamodel) {
                ViewManager.updateViewContent(viewId);
                $feedback.text("Saved!");
                setTimeout(function () {
                    $feedback.text("");
                }, 1000);

            } else {
                y.share.data.set('model', EntityManager.graphToJSON());
                $feedback.text("Saved!");
                setTimeout(function () {
                    $feedback.text("");
                }, 1000);
            }


        };
        $("#save").click(function () {
            saveFunction();
        });

        $("#dialog").dialog({
            autoOpen: false,
            resizable: false,
            height: 350,
            width: 400,
            modal: true,
            buttons: {
                "Generate": function (event) {
                    var title = $("#space_title").val();
                    var label = $("#space_label").val().replace(/[^a-zA-Z]/g, "").toLowerCase();

                    if (title === "" || label === "") return;
                    EntityManager.generateSpace(label, title).then(function (spaceObj) {
                        var operation = new ActivityOperation(
                            "EditorGenerateActivity",
                            "-1",
                            _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
                            "..generated new Editor <a href=\"" + spaceObj.spaceURI + "\" target=\"_blank\">" + spaceObj.spaceTitle + "</a>",
                            {}
                        ).toNonOTOperation();
                        //_iwcw.sendRemoteNonOTOperation(operation);
                        _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, operation);

                        $("#space_link").text(spaceObj.spaceURI).attr({href: spaceObj.spaceURI}).show();
                        $("#space_link_text").show();
                        $("#space_link_input").hide();
                        $(event.target).parent().hide();
                    });
                },
                "Close": function () {
                    $(this).dialog("close");
                }
            },
            open: function () {
                var name = canvas.getModelAttributesNode().getAttribute("modelAttributes[name]").getValue().getValue();
                var $spaceTitle = $("#space_title");
                var $spaceLabel = $("#space_label");

                if ($spaceTitle.val() === "") $spaceTitle.val(name);
                if ($spaceLabel.val() === "") $spaceLabel.val(name.replace(/[^a-zA-Z]/g, "").toLowerCase());

                $(":button:contains('Generate')").show();
            },
            close: function (/*event, ui*/) {
                $("#space_link_text").hide();
                $("#space_link_input").show();
            }
        });

        var $generate = $("#generate").click(function () {
            $("#dialog").dialog("open");
        });

        if (!metamodel || !metamodel.hasOwnProperty("nodes") && !metamodel.hasOwnProperty("edges")) {
            $generate.show();
        }

        var readyToSave = true;
        var saveTriggered = false;
        var saveCallback = function () {
            if (readyToSave) {
                readyToSave = false;
                setTimeout(function () {
                    saveFunction();
                }, 500);
                setTimeout(function () {
                    readyToSave = true;
                    if (saveTriggered) {
                        saveTriggered = false;
                        saveCallback();
                    }
                }, 5000);
            } else {
                saveTriggered = true;
            }
        };

        ViewManager.GetViewpointList();

        //local user joins
        y.share.join.set(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],false);

    }

});

