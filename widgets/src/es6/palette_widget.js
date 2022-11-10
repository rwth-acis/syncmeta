/**
 * Namespace for palette widget.
 * @namespace palette_widget
 */

import "jquery";
import "jquery-ui";
import WaitForCanvas from "./WaitForCanvas";
import Palette from "./palette_widget/Palette";
import MoveTool from "./palette_widget/MoveTool";
import ObjectNodeTool from "./palette_widget/ObjectNodeTool";
import AbstractClassNodeTool from "./palette_widget/AbstractClassNodeTool";
import EnumNodeTool from "./palette_widget/EnumNodeTool";
import NodeShapeNodeTool from "./palette_widget/NodeShapeNodeTool";
import EdgeShapeNodeTool from "./palette_widget/EdgeShapeNodeTool";
import RelationshipNodeTool from "./palette_widget/RelationshipNodeTool";
import RelationshipGroupNodeTool from "./palette_widget/RelationshipGroupNodeTool";
import BiDirAssociationEdgeTool from "./palette_widget/BiDirAssociationEdgeTool";
import { UniDirAssociationEdge } from "./canvas_widget/Manager";
import GeneralisationEdgeTool from "./palette_widget/GeneralisationEdgeTool";
import ViewObjectNodeTool from "./palette_widget/ViewObjectNodeTool";
import ViewRelationshipNodeTool from "./palette_widget/ViewRelationshipNodeTool";
import { CONFIG } from "./config.js";
// import test from "./../es6-test/PaletteWidgetTest";

WaitForCanvas(CONFIG.WIDGET.NAME.PALETTE, 10, 1500).done(function (metamodel) {
  var palette = new Palette($("#palette"), $("#info"));

  palette.addTool(new MoveTool());
  palette.addSeparator();

  if (!$.isEmptyObject(metamodel)) {
    if (metamodel.hasOwnProperty("nodes")) {
      palette.initNodePalette(metamodel);
    }
    if (metamodel.hasOwnProperty("edges")) {
      palette.iniEdgePalette(metamodel);
    }
  } else {
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

  // if (CONFIG.TEST.PALETTE) test();
});
