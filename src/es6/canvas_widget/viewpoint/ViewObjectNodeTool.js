import { ViewObjectNode } from "../Manager";
import NodeTool from "../NodeTool";


/**
 * ViewObjectNodeTool
 * @class canvas_widget.ViewObjectNodeTool
 * @memberof canvas_widget
 * @constructor
 */
export class ViewObjectNodeTool extends NodeTool {
  constructor() {
    super(
      ViewObjectNode.TYPE,
      null,
      null,
      null,
      ViewObjectNode.DEFAULT_WIDTH,
      ViewObjectNode.DEFAULT_HEIGHT
    );
  }
}

export default ViewObjectNodeTool;
