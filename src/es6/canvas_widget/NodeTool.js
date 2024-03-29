import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import { EntityManagerInstance as EntityManager } from "./Manager";
import AbstractCanvasTool from "./AbstractCanvasTool";

/**
 * NodeTool
 * @class canvas_widget.NodeTool
 * @extends canvas_widget.AbstractCanvasTool
 * @memberof canvas_widget
 * @constructor
 */
class NodeTool extends AbstractCanvasTool {
  constructor(
    name,
    className,
    description,
    containment,
    defaultWidth,
    defaultHeight
  ) {
    super(name, className || "tool-node", description || "Add a node");

    var _defaultWidth = defaultWidth || 100,
      _defaultHeight = defaultHeight || 50;

    /**
     * Mount the tool on canvas
     */
    this.mount = function (defaultLabel, defaultAttributeValues) {
      var $canvas = this.getCanvas().get$canvas();
      var that = this;
      AbstractCanvasTool.prototype.mount.call(this);

      //Enable Node Addition
      $canvas.on("mouseup.nodeadd", function (ev) {
        var offsetClick, offsetCanvas;

        if (ev.which != 1) return;

        offsetCanvas = $canvas.offset(); // current offset of the canvas relative to the document
        var zoom = that.getCanvas().getZoom();
        var nodeX = (ev.pageX - offsetCanvas.left) / zoom - _defaultWidth / 2; // center position of the node
        var nodeY = (ev.pageY - offsetCanvas.top) / zoom - _defaultHeight / 2; // center position of the node

        that
          .getCanvas()
          .createNode(
            that.getName(),
            nodeX,
            nodeY,
            _defaultWidth,
            _defaultHeight,
            null,
            containment,
            null,
            null,
            null,
            defaultLabel,
            defaultAttributeValues
          );
        that.getCanvas().resetTool();
      });

      $canvas.bind("contextmenu", function (ev) {
        if (ev.target == this) {
          ev.preventDefault();
          that.getCanvas().resetTool();
          return false;
        }
        return true;
      });

      $canvas.find(".node").bind("contextmenu", function (ev) {
        ev.preventDefault();
        that.getCanvas().resetTool();
        that.getCanvas().select(EntityManager.findNode($(this).attr("id")));
        return false;
      });
    };

    /**
     * Unmount the tool from canvas
     */
    this.unmount = function () {
      var $canvas = this.getCanvas().get$canvas();
      AbstractCanvasTool.prototype.unmount.call(this);

      //Disable Node Addition
      $canvas.off("mouseup.nodeadd");

      $canvas.unbind("contextmenu");
      $canvas.find(".node").unbind("contextmenu");
    };
  }
}

export default NodeTool;
