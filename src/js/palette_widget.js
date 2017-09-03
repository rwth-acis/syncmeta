/**
 * Namespace for palette widget.
 * @namespace palette_widget
 */

requirejs([
    'jqueryui',
    'WaitForCanvas',    
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
    'palette_widget/ViewRelationshipNodeTool',
    'promise!Guidancemodel'
],function ($,WaitForCanvas,Palette,MoveTool,ObjectNodeTool,AbstractClassNodeTool,EnumNodeTool,NodeShapeNodeTool,EdgeShapeNodeTool,RelationshipNodeTool,RelationshipGroupNodeTool,BiDirAssociationEdgeTool,UniDirAssociationEdgeTool,GeneralisationEdgeTool,ViewObjectNodeTool,ViewRelationshipNodeTool,guidancemodel) {

    WaitForCanvas(CONFIG.WIDGET.NAME.PALETTE, 10, 500).done(function (metamodel) {        
        var palette = new Palette($("#palette"), $("#info"));

        palette.addTool(new MoveTool());
        palette.addSeparator();

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

        if (CONFIG.TEST.PALETTE)
            require(['./../test/PaletteWidgetTest']);
    });

});