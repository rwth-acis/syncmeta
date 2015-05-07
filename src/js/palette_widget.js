/**
 * Namespace for palette widget.
 * @namespace palette_widget
 */

requirejs([
    'jqueryui',
    'palette_widget/Palette',
    'palette_widget/MoveTool',
    'palette_widget/Separator',
    'palette_widget/NodeTool',
    'palette_widget/ObjectNodeTool',
    'palette_widget/AbstractClassNodeTool',
    'palette_widget/EnumNodeTool',
    'palette_widget/NodeShapeNodeTool',
    'palette_widget/EdgeShapeNodeTool',
    'palette_widget/RelationshipNodeTool',
    'palette_widget/RelationshipGroupNodeTool',
    'palette_widget/EdgeTool',
    'palette_widget/BiDirAssociationEdgeTool',
    'palette_widget/UniDirAssociationEdgeTool',
    'palette_widget/GeneralisationEdgeTool',
    'text!templates/canvas_widget/circle_node.html',
    'text!templates/canvas_widget/diamond_node.html',
    'text!templates/canvas_widget/rectangle_node.html',
    'text!templates/canvas_widget/rounded_rectangle_node.html',
    'text!templates/canvas_widget/triangle_node.html',
    'promise!Metamodel',
    'promise!Guidancemodel'
],function ($,Palette,MoveTool,Separator,NodeTool,ObjectNodeTool,AbstractClassNodeTool,EnumNodeTool,NodeShapeNodeTool,EdgeShapeNodeTool,RelationshipNodeTool,RelationshipGroupNodeTool,EdgeTool,BiDirAssociationEdgeTool,UniDirAssociationEdgeTool,GeneralisationEdgeTool,circleNodeHtml,diamondNodeHtml,rectangleNodeHtml,roundedRectangleNodeHtml,triangleNodeHtml,metamodel, guidancemodel) {

    /**
     * Predefined node shapes, first is default
     * @type {{circle: *, diamond: *, rectangle: *, triangle: *}}
     */
    var nodeShapeTypes = {
        "circle": circleNodeHtml,
        "diamond": diamondNodeHtml,
        "rectangle": rectangleNodeHtml,
        "rounded_rectangle": roundedRectangleNodeHtml,
        "triangle": triangleNodeHtml
    };

    /**
     * jQuery object to test for valid color
     * @type {$}
     */
    var $colorTestElement = $('<div></div>');

    var palette = new Palette($("#palette"),$("#info"));

    palette.addTool(new MoveTool());
    palette.addSeparator(new Separator());

    //Create node tools for guidance modeling based on guidance model (if in guidance modeling editor)
    if(guidancemodel){
        console.log("Create guidance modeling node tools");
    }
    //Create node tools for modeling based on a metamodel (if a metamodel exists)
    else if(metamodel && metamodel.hasOwnProperty("nodes")){
        var nodes = metamodel.nodes,
            node,
            shape,
            color,
            anchors,
            $shape;

        for(var nodeId in nodes){
            if(nodes.hasOwnProperty(nodeId)){
                node = nodes[nodeId];
                if(node.shape.customShape){
                    shape = node.shape.customShape;
                } else {
                    shape = nodeShapeTypes.hasOwnProperty(node.shape.shape) ? nodeShapeTypes[node.shape.shape] : _.keys(nodeShapeTypes)[0];
                }
                if(node.shape.customAnchors){
                    anchors = node.shape.customAnchors;
                } else {
                    switch(node.shape.shape){
                        case "circle":
                            anchors = [ "Perimeter", { shape:"Circle", anchorCount: 10} ];
                            break;
                        case "diamond":
                            anchors = [ "Perimeter", { shape:"Diamond", anchorCount: 10} ];
                            break;
                        case "triangle":
                            anchors = [ "Perimeter", { shape:"Triangle", anchorCount: 10} ];
                            break;
                        default:
                        case "rectangle":
                            anchors = [ "Perimeter", { shape:"Rectangle", anchorCount: 10} ];
                            break;
                    }
                }
                color = node.shape.color ? $colorTestElement.css('color','#FFFFFF').css('color',node.shape.color).css('color') : '#FFFFFF';
                $shape = $('<div>').css('display','table-cell').css('verticalAlign','middle').css('width',node.shape.defaultWidth || 100).css('height',node.shape.defaultHeight || 50).append($(_.template(shape,{color: color, type: node.label})));
                $shape.find('.type').hide();

                palette.addTool(new NodeTool(node.label,node.label,null,$shape));
            }
        }
    }
    //Create node tools for metamodeling
    else {
        palette.addTool(new AbstractClassNodeTool());
        palette.addTool(new ObjectNodeTool());
        palette.addTool(new RelationshipNodeTool());
        palette.addTool(new RelationshipGroupNodeTool());
        palette.addTool(new EnumNodeTool());
        palette.addTool(new NodeShapeNodeTool());
        palette.addTool(new EdgeShapeNodeTool());
    }
    palette.addSeparator(new Separator());

    //Create edge tools for guidance modeling (if in guidance model editor)
    if(guidancemodel){
        console.log("Create guidance modeling edge tools")
    }
    //Create edge tools for modeling (based on metamodel)
    else if(metamodel && metamodel.hasOwnProperty("edges")){
        var edges = metamodel.edges, edge;
        for(var edgeId in edges){
            if(edges.hasOwnProperty(edgeId)){
                edge = edges[edgeId];
                palette.addTool(new EdgeTool(edge.label,edge.label,null,edge.shape.arrow+".png",edge.shape.color));
            }
        }
    }
    //Create edge tools for metamodeling
    else {
        palette.addTool(new BiDirAssociationEdgeTool());
        palette.addTool(new UniDirAssociationEdgeTool());
        palette.addTool(new GeneralisationEdgeTool());
    }

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