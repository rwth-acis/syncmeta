import { CONFIG } from "../config";
import _ from "lodash-es";
import IWCW from "../lib/IWCWrapper";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import ToolSelectOperation from "../operations/non_ot/ToolSelectOperation";
import SetViewTypesOperation from "../operations/non_ot/SetViewTypesOperation";
import InitModelTypesOperation from "../operations/non_ot/InitModelTypesOperation";
import MoveTool from "./MoveTool";
import NodeTool from "./NodeTool";
import { EdgeTool } from "./EdgeTool";

const circleNodeHtml = await loadHTML(
  "../../templates/canvas_widget/circle_node.html",
  import.meta.url
);
const diamondNodeHtml = await loadHTML(
  "../../templates/canvas_widget/diamond_node.html",
  import.meta.url
);

const rectangleNodeHtml = await loadHTML(
  "../../templates/canvas_widget/rectangle_node.html",
  import.meta.url
);

const roundedRectangleNodeHtml = await loadHTML(
  "../../templates/canvas_widget/rounded_rectangle_node.html",
  import.meta.url
);

const triangleNodeHtml = await loadHTML(
  "../../templates/canvas_widget/triangle_node.html",
  import.meta.url
);

/**
 * Palette
 * @class palette_widget.Palette
 * @memberof palette_widget
 * @constructor
 */
class Palette {
  constructor($palette, $info) {
    var that = this;

    /**
     * Tools added to palette
     * @type {Object}
     * @private
     */
    var _tools = {};

    /**
     * Tool currently selected
     * @type String
     * @private
     */
    var _currentToolName = null;

    /**
     * Inter widget communication wrapper
     * @type {Object}
     * @private
     */
    var _iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.PALETTE);

    /**
     * Apply a tool selection
     * @param {String} name
     */
    var processToolSelection = function (name) {
      var tool;
      if (_tools.hasOwnProperty(name)) {
        if (_currentToolName) {
          _tools[_currentToolName].unselect();
          $info.text("");
        }
        tool = _tools[name];
        tool.select();
        $info.text(tool.getDescription());
        _currentToolName = name;
      }
    };

    /**
     * Callback for a local Tool Select Operation
     * @param {operations.non_ot.ToolSelectOperation.non_ot.ToolSelectOperation} operation
     */
    var toolSelectionCallback = function (operation) {
      if (operation instanceof ToolSelectOperation) {
        processToolSelection(operation.getSelectedToolName());
      }
    };

    var setViewTypesCallback = function (operation) {
      if (operation instanceof SetViewTypesOperation) {
        if (
          operation.getFlag() &&
          _tools.hasOwnProperty("ViewObject") &&
          _tools.hasOwnProperty("ViewRelationship")
        ) {
          _tools["ViewObject"].get$node().show();
          _tools["ViewRelationship"].get$node().show();
          _tools["Object"].get$node().hide();
          _tools["Enumeration"].get$node().hide();
          _tools["Relationship"].get$node().hide();
          _tools["Abstract Class"].get$node().hide();
        } else if (
          !operation.getFlag() &&
          _tools.hasOwnProperty("ViewObject") &&
          _tools.hasOwnProperty("ViewRelationship")
        ) {
          _tools["ViewObject"].get$node().hide();
          _tools["ViewRelationship"].get$node().hide();
          _tools["Object"].get$node().show();
          _tools["Enumeration"].get$node().show();
          _tools["Relationship"].get$node().show();
          _tools["Abstract Class"].get$node().show();
        }
      }
    };

    var initModelTypesCallback = function (operation) {
      if (operation instanceof InitModelTypesOperation) {
        var vls = operation.getVLS();

        if (!$.isEmptyObject(_tools)) {
          _tools = {};
          $palette.empty();
        }
        that.addTool(new MoveTool());
        that.addSeparator();
        that.initNodePalette(vls);
        that.addSeparator();
        that.iniEdgePalette(vls);
        _currentToolName = "MoveTool";
      }
    };

    /**
     * Add tool tool to palette
     * @param {palette_widget.AbstractTool} tool
     */
    this.addTool = function (tool) {
      var name = tool.getName();
      var $node;
      if (!_tools.hasOwnProperty(name)) {
        _tools[name] = tool;
        $node = tool.get$node();
        $node.on("mousedown", function (ev) {
          if (ev.which != 1) return;
          that.selectTool(name);
        });
        $palette.append($node);
      }
    };

    /**
     * Add separator to palette
     */
    this.addSeparator = function () {
      $palette.append($(`<hr style="margin-top: 8px; margin-bottom: 8px;" />`));
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get tool by name
     * @param {string} name
     * @returns {palette_widget.AbstractTool}
     */
    this.getTool = function (name) {
      if (_tools.hasOwnProperty(name)) {
        return _tools[name];
      }
      return null;
    };

    /**
     * Select tool by name
     * @param {string} name
     */
    this.selectTool = function (name) {
      if (_tools.hasOwnProperty(name)) {
        processToolSelection(name);
        var operation = new ToolSelectOperation(name, null);
        _iwc.sendLocalNonOTOperation(
          CONFIG.WIDGET.NAME.MAIN,
          operation.toNonOTOperation()
        );
      }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get currently selected tool
     * @returns {palette_widget.AbstractTool}
     */
    this.getCurrentToolName = function () {
      return _currentToolName;
    };

    /**
     * Register inter widget communication callbacks
     */
    this.registerCallbacks = function () {
      _iwc.registerOnDataReceivedCallback(toolSelectionCallback);
      _iwc.registerOnDataReceivedCallback(setViewTypesCallback);
      _iwc.registerOnDataReceivedCallback(initModelTypesCallback);
    };

    /**
     * Unregister inter widget communication callbacks
     */
    this.unregisterCallbacks = function () {
      _iwc.unregisterOnDataReceivedCallback(toolSelectionCallback);
      _iwc.unregisterOnDataReceivedCallback(setViewTypesCallback);
      _iwc.unregisterOnDataReceivedCallback(initModelTypesCallback);
    };

    if (_iwc) {
      this.registerCallbacks();
    }

    this.initNodePalette = function (metamodel) {
      var nodeShapeTypes = {
        circle: circleNodeHtml,
        diamond: diamondNodeHtml,
        rectangle: rectangleNodeHtml,
        rounded_rectangle: roundedRectangleNodeHtml,
        triangle: triangleNodeHtml,
      };

      /**
       * jQuery object to test for valid color
       * @type {$}
       */
      var $colorTestElement = $("<div></div>");

      var nodes = metamodel.nodes,
        node,
        shape,
        color,
        anchors,
        $shape;

      for (var nodeId in nodes) {
        if (nodes.hasOwnProperty(nodeId)) {
          node = nodes[nodeId];

          if (node.shape?.customShape) {
            shape = node.shape.customShape;
          } else {
            shape =
              node.shape && nodeShapeTypes.hasOwnProperty(node.shape.shape)
                ? nodeShapeTypes[node.shape.shape]
                : _.keys(nodeShapeTypes)[0];
          }
          if (node.shape?.customAnchors) {
            anchors = node.shape.customAnchors;
          } else {
            switch (node.shape?.shape) {
              case "circle":
                anchors = ["Perimeter", { shape: "Circle", anchorCount: 10 }];
                break;
              case "diamond":
                anchors = ["Perimeter", { shape: "Diamond", anchorCount: 10 }];
                break;
              case "triangle":
                anchors = ["Perimeter", { shape: "Triangle", anchorCount: 10 }];
                break;
              default:
              case "rectangle":
                anchors = [
                  "Perimeter",
                  { shape: "Rectangle", anchorCount: 10 },
                ];
                break;
            }
          }
          color = node.shape?.color
            ? $colorTestElement
                .css("color", "#FFFFFF")
                .css("color", node.shape.color)
                .css("color")
            : "#FFFFFF";
          $shape = $("<div>")
            .css("display", "table-cell")
            .css("verticalAlign", "middle")
            .css("width", node.shape?.defaultWidth || 100)
            .css("height", node.shape?.defaultHeight || 50)
            .append(
              $(
                _.template(shape)({
                  color: color,
                  type: node.label,
                })
              )
            );
          $shape.find(".type").hide();

          that.addTool(new NodeTool(node.label, node.label, null, $shape));
        }
      }
    };
    this.iniEdgePalette = function (metamodel) {
      var edges = metamodel.edges,
        edge;
      for (var edgeId in edges) {
        if (edges.hasOwnProperty(edgeId)) {
          edge = edges[edgeId];
          that.addTool(
            new EdgeTool(
              edge.label,
              edge.label,
              null,
              edge.shape ? edge.shape.arrow + ".png" : null,
              edge.shape?.color
            )
          );
        }
      }
    };
  }
}
export default Palette;
