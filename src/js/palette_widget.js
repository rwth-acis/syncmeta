/**
 * Namespace for palette widget.
 * @namespace palette_widget
 */

requirejs([
    'jqueryui',
    'lib/yjs-sync',
    'palette_widget/Palette',
    'palette_widget/MoveTool',
    'palette_widget/ObjectNodeTool',
    'palette_widget/AbstractClassNodeTool',
    'palette_widget/EnumNodeTool',
    'palette_widget/NodeShapeNodeTool',
    'palette_widget/EdgeShapeNodeTool',
    'palette_widget/RelationshipNodeTool',
    'palette_widget/RelationshipGroupNodeTool',
    'palette_widget/BiDirAssociationEdgeTool',
    'palette_widget/UniDirAssociationEdgeTool',
    'palette_widget/GeneralisationEdgeTool',
    'palette_widget/ViewObjectNodeTool',
    'palette_widget/ViewRelationshipNodeTool'
   // 'text!templates/canvas_widget/circle_node.html',
    //'text!templates/canvas_widget/diamond_node.html',
    //'text!templates/canvas_widget/rectangle_node.html',
    //'text!templates/canvas_widget/rounded_rectangle_node.html',
    //'text!templates/canvas_widget/triangle_node.html'
    //'promise!Metamodel',
    //'promise!Guidancemodel'
],function ($,yjsSync,Palette,MoveTool,ObjectNodeTool,AbstractClassNodeTool,EnumNodeTool,NodeShapeNodeTool,EdgeShapeNodeTool,RelationshipNodeTool,RelationshipGroupNodeTool,BiDirAssociationEdgeTool,UniDirAssociationEdgeTool,GeneralisationEdgeTool,ViewObjectNodeTool,ViewRelationshipNodeTool/*,circleNodeHtml,diamondNodeHtml,rectangleNodeHtml,roundedRectangleNodeHtml,triangleNodeHtml*//*,metamodel,guidancemodel*/) {

    yjsSync().done(function(y) {
        window.y = y;
        console.info('PALETTE:Yjs successfully initialized');
        var metamodel = y.share.data.get('metamodel');
        var palette = new Palette($("#palette"), $("#info"));

        palette.addTool(new MoveTool());
        palette.addSeparator();

        //Set the metamodel to the guidance metamodel in the guidance editor
        /*if (guidancemodel.isGuidanceEditor()) {
            metamodel = guidancemodel.guidancemetamodel;
        }*/

        if (metamodel) {
            if (metamodel.hasOwnProperty('nodes')) {
                palette.initNodePalette(metamodel);
            }
            if (metamodel.hasOwnProperty('edges')) {
                palette.iniEdgePalette(metamodel);
            }
        }
        else {
            //Create node tools for metamodeling
            palette.addTool(new AbstractClassNodeTool());
            palette.addTool(new ObjectNodeTool());
            palette.addTool(new RelationshipNodeTool());
            palette.addTool(new RelationshipGroupNodeTool());
            palette.addTool(new EnumNodeTool());
            palette.addTool(new NodeShapeNodeTool());
            palette.addTool(new EdgeShapeNodeTool());


            var viewObjectTool = new ViewObjectNodeTool();
            palette.addTool(viewObjectTool);
            viewObjectTool.get$node().hide();

            var viewRelNodeTool = new ViewRelationshipNodeTool();
            palette.addTool(viewRelNodeTool);
            viewRelNodeTool.get$node().hide();

            palette.addSeparator();
            palette.addTool(new BiDirAssociationEdgeTool());
            palette.addTool(new UniDirAssociationEdgeTool());
            palette.addTool(new GeneralisationEdgeTool());


        }

        //var componentName = "palette"+Util.generateRandomId();
        //var iwc = IWCW.getInstance(componentName);
        /**
         * Predefined node shapes, first is default
         * @type {{circle: *, diamond: *, rectangle: *, triangle: *}}
         */
        /*
         //UNSUSED
         var nodeShapeTypes = {
         "circle": circleNodeHtml,
         "diamond": diamondNodeHtml,
         "rectangle": rectangleNodeHtml,
         "rounded_rectangle": roundedRectangleNodeHtml,
         "triangle": triangleNodeHtml
         };*/

        /**
         * jQuery object to test for valid color
         * @type {$}
         */
        //unused
        //var $colorTestElement = $('<div></div>');


        if (CONFIG.TEST_MODE)
            require(['./../test/PaletteWidgetTest']);

        //UNUSED
        /*$("#q").draggable({
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
    });

});