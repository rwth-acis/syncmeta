import { ObjectNode } from "./Manager";
import NodeTool from "./NodeTool";



/**
 * ObjectNodeTool
 * @class canvas_widget.ObjectNodeTool
 * @memberof canvas_widget
 * @constructor
 */
export class ObjectNodeTool extends NodeTool {
  constructor() {
    super(
      ObjectNode.TYPE,
      null,
      null,
      null,
      ObjectNode.DEFAULT_WIDTH,
      ObjectNode.DEFAULT_HEIGHT
    );
  }
}

