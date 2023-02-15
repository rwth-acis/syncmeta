import AbstractTool from "./AbstractTool";


/**
 * EdgeTool
 * @class palette_widget.EdgeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
export class EdgeTool extends AbstractTool {
  constructor(
    toolName,
    toolLabel,
    toolDescription,
    toolIcon,
    toolColor,
    type = "img"
  ) {
    if (toolIcon && toolIcon.includes(".png")) {
      let tmp = toolIcon.split(".");
      tmp.pop();
      const key = tmp.join("."); //remove the file extension at the end
      if (key in DEFAULT_EDGE_ICONS) {
        toolIcon = DEFAULT_EDGE_ICONS[key];
        type = "svg";
      }
    }
    super(
      toolName,
      toolLabel,
      toolDescription ||
        "Click and hold on one Node and release on another node to add an edge between these two nodes.",
      toolIcon || DEFAULT_EDGE_ICONS["unidirassociation"],
      toolColor || "#000000",
      type
    );
  }
}

const DEFAULT_EDGE_ICONS = {
  unidirassociation: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>`,
  generalisation: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg>`,
  bidirassociation: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/></svg>`,
};
