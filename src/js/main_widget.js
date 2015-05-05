/**
 * Namespace for canvas widget.
 * @namespace canvas_widget
 */

requirejs([
    'jqueryui',
    'jsplumb',
    'iwcotw',
    'operations/non_ot/ToolSelectOperation',
    'operations/non_ot/ActivityOperation',
    'operations/non_ot/JoinOperation',
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
    'promise!Metamodel',
    'promise!Model'
],function($,jsPlumb,IWCOT,ToolSelectOperation,ActivityOperation,JoinOperation,Canvas,EntityManager,NodeTool,ObjectNodeTool,AbstractClassNodeTool,RelationshipNodeTool,RelationshipGroupNodeTool,EnumNodeTool,NodeShapeNodeTool,EdgeShapeNodeTool,EdgeTool,GeneralisationEdgeTool,BiDirAssociationEdgeTool,UniDirAssociationEdgeTool,ObjectNode,AbstractClassNode,RelationshipNode,RelationshipGroupNode,EnumNode,NodeShapeNode,EdgeShapeNode,GeneralisationEdge,BiDirAssociationEdge,UniDirAssociationEdge,metamodel,model) {

    var iwcot;
    var canvas;

    iwcot = IWCOT.getInstance(CONFIG.WIDGET.NAME.MAIN);
    canvas = new Canvas($("#canvas"));

    //When guidance_modeling is true then create guidance modeling node tools
    if(guidance_modeling){
        console.log("Check activity!!!");
        act = openapp.param.get("http://purl.org/role/terms/activity");
        openapp.resource.get(act, function(resource){
            console.log("Got resource!!!!");
            console.log(resource.data[resource.uri]["http://purl.org/dc/terms/title"][0].value);
        });
    }
    //Otherwise if a metamodel is given create tools based on the metamodel
    else if(metamodel && metamodel.hasOwnProperty("nodes")){
        var nodes = metamodel.nodes, node;
        for(var nodeId in nodes){
            if(nodes.hasOwnProperty(nodeId)){
                node = nodes[nodeId];
                canvas.addTool(node.label,new NodeTool(node.label,null,null,node.shape.defaultWidth,node.shape.defaultHeight));
            }
        }
    }
    //When no metamodel is given create node tools for metamodeling
    else {
        canvas.addTool(ObjectNode.TYPE,new ObjectNodeTool());
        canvas.addTool(AbstractClassNode.TYPE,new AbstractClassNodeTool());
        canvas.addTool(RelationshipNode.TYPE,new RelationshipNodeTool());
        canvas.addTool(RelationshipGroupNode.TYPE,new RelationshipGroupNodeTool());
        canvas.addTool(EnumNode.TYPE,new EnumNodeTool());
        canvas.addTool(NodeShapeNode.TYPE,new NodeShapeNodeTool());
        canvas.addTool(EdgeShapeNode.TYPE,new EdgeShapeNodeTool());
    }

    //When guidance_modeling is true create guidance modeling edge tools
    if(guidance_modeling){
        console.log("Create guidance modeling edge tools");
    }
    //Otherwise if a metamodel is given create edge tools based on the metamodel
    else if(metamodel && metamodel.hasOwnProperty("edges")){
        var edges = metamodel.edges, edge;
        for(var edgeId in edges){
            if(edges.hasOwnProperty(edgeId)){
                edge = edges[edgeId];
                canvas.addTool(edge.label,new EdgeTool(edge.label,edge.relations));
            }
        }
    }
    //When no metamodel is given create edge tools for metamodeling
    else {
        canvas.addTool(GeneralisationEdge.TYPE,new GeneralisationEdgeTool());
        canvas.addTool(BiDirAssociationEdge.TYPE,new BiDirAssociationEdgeTool());
        canvas.addTool(UniDirAssociationEdge.TYPE,new UniDirAssociationEdgeTool());
    }

    function JSONtoGraph(json){
        var modelAttributesNode;
        var nodeId, edgeId;
        if(json.attributes){
            modelAttributesNode = EntityManager.createModelAttributesNodeFromJSON(json.attributes);
            canvas.setModelAttributesNode(modelAttributesNode);
            modelAttributesNode.addToCanvas(canvas);
        }
        for(nodeId in json.nodes){
            if(json.nodes.hasOwnProperty(nodeId)){
                var node = EntityManager.createNodeFromJSON(json.nodes[nodeId].type,nodeId,json.nodes[nodeId].left,json.nodes[nodeId].top,json.nodes[nodeId].width,json.nodes[nodeId].height,json.nodes[nodeId].zIndex,json.nodes[nodeId]);
                node.draw();
                node.addToCanvas(canvas);
            }
        }
        for(edgeId in json.edges){
            if(json.edges.hasOwnProperty(edgeId)){
                var edge = EntityManager.createEdgeFromJSON(json.edges[edgeId].type,edgeId,json.edges[edgeId].source,json.edges[edgeId].target,json.edges[edgeId]);
                edge.connect();
                edge.addToCanvas(canvas);
            }
        }
    }

    var $undo = $("#undo");
    var $redo = $("#redo");
    $undo.click(function(){
        iwcot.undo();
    }).prop('disabled',true);

    $redo.click(function(){
        iwcot.redo();
    }).prop('disabled',true);

    iwcot.registerOnHistoryChangedCallback(function(operation,length,position){
        $undo.prop('disabled', position == -1);
        $redo.prop('disabled', position == length-1);
    });

    $("#q").draggable({
        axis: "y",
        start: function(){
            var $c = $("#canvas-frame");
            $c.css('bottom', 'inherit');
            $(this).css('height',50);
        },
        drag: function( event, ui ) {
            var height = ui.position.top-30;
            $("#canvas-frame").css('height', height);
            gadgets.window.adjustHeight();
        },
        stop: function(){
            $(this).css('height',3);
            gadgets.window.adjustHeight();
            $(this).css('top','');
        }
    });

    $("#showtype").click(function(){
        canvas.get$node().removeClass("hide_type");
        $(this).hide();
        $("#hidetype").show();
    }).hide();

    $("#hidetype").click(function(){
        canvas.get$node().addClass("hide_type");
        $(this).hide();
        $("#showtype").show();
    });

    $("#zoomin").click(function(){
        canvas.setZoom(canvas.getZoom()+0.1);
    });

    $("#zoomout").click(function(){
        canvas.setZoom(canvas.getZoom()-0.1);
    });

    var $feedback = $("#feedback");
    $("#save").click(function(){
        $feedback.text("Saving...");
        EntityManager.storeData().then(function(){
            $feedback.text("Saved!");
            setTimeout(function(){
                $feedback.text("");
            },1000);
        });
    });

    $("#dialog").dialog({
        autoOpen: false,
        resizable: false,
        height:350,
        width: 400,
        modal: true,
        buttons: {
            "Generate": function(event) {
                var title = $("#space_title").val();
                var label = $("#space_label").val().replace(/[^a-zA-Z]/g,"").toLowerCase();

                if(title === "" || label === "") return;
                EntityManager.generateSpace(label,title).then(function(spaceObj){
                    var operation = new ActivityOperation(
                        "EditorGenerateActivity",
                        "-1",
                        iwcot.getUser()[CONFIG.NS.PERSON.JABBERID],
                        "..generated new Editor <a href=\""+spaceObj.spaceURI+"\" target=\"_blank\">"+spaceObj.spaceTitle+"</a>",
                        {}
                    ).toNonOTOperation();
                    iwcot.sendRemoteNonOTOperation(operation);
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,operation);

                    $("#space_link").text(spaceObj.spaceURI).attr({href:spaceObj.spaceURI}).show();
                    $("#space_link_text").show();
                    $("#space_link_input").hide();
                    $(event.target).parent().hide();
                });
            },
            "Close": function() {
                $( this ).dialog( "close" );
            }
        },
        open: function(){
            var name = canvas.getModelAttributesNode().getAttribute("modelAttributes[name]").getValue().getValue();
            var timeout;
            var $spaceTitle = $("#space_title");
            var $spaceLabel = $("#space_label");

            if($spaceTitle.val() === "") $spaceTitle.val(name);
            if($spaceLabel.val() === "") $spaceLabel.val(name.replace(/[^a-zA-Z]/g,"").toLowerCase());

            $(":button:contains('Generate')").show();
        },
        close: function( /*event, ui*/ ) {
            $("#space_link_text").hide();
            $("#space_link_input").show();
        }
    });

    var $generate = $("#generate").click(function(){
        $("#dialog").dialog( "open" );
    });

    if(!metamodel || !metamodel.hasOwnProperty("nodes") && !metamodel.hasOwnProperty("edges")){
        $generate.show();
    }

    var readyToSave = true;
    var saveTriggered = false;
    var saveCallback = function(){
        if(readyToSave){
            readyToSave = false;
            setTimeout(function(){
                $("#save").click();
            },500);
            setTimeout(function(){
                readyToSave = true;
                if(saveTriggered){
                    saveTriggered = false;
                    saveCallback();
                }
            },5000);
        } else {
            saveTriggered = true;
        }
    };

    iwcot.registerOnHistoryChangedCallback(saveCallback);

    if(iwcot.getJoiningState() === IWCOT.JOIN_STATE.COMPLETED){
        $("#loading").hide();
    }

    iwcot.registerOnJoinOrLeaveCallback(function(operation){
        var activityOperation;
        if(operation instanceof JoinOperation){
            if(operation.getUser() === iwcot.getUser()[CONFIG.NS.PERSON.JABBERID]){
                if(operation.isDone()){
                    operation.setData(model);
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.toNonOTOperation());
                    JSONtoGraph(model);
                    if(canvas.getModelAttributesNode() === null) {
                        var modelAttributesNode = EntityManager.createModelAttributesNode();
                        canvas.setModelAttributesNode(modelAttributesNode);
                        modelAttributesNode.addToCanvas(canvas);
                    }
                    canvas.resetTool();
                    $("#loading").hide();
                    activityOperation = new ActivityOperation(
                        "UserJoinActivity",
                        "-1",
                        operation.getUser(),
                        "",
                        {}
                    ).toNonOTOperation();
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,activityOperation);
                } else {
                    activityOperation = new ActivityOperation(
                        "UserJoinActivity",
                        "-1",
                        operation.getSender(),
                        "",
                        {}
                    ).toNonOTOperation();
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,activityOperation);
                    model = operation.getData();
                }
            } else {
                if(operation.isDone()){
                    activityOperation = new ActivityOperation(
                        "UserJoinActivity",
                        "-1",
                        operation.getUser(),
                        "",
                        {}
                    ).toNonOTOperation();
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,activityOperation);
                } else {
                }
            }
        }
    });

    /*$("#save_image").click(function(){
        canvas.toPNG().then(function(uri){
            var link = document.createElement('a');
            link.download = "export.png";
            link.href = uri;
            link.click();
        });
    });*/

});

