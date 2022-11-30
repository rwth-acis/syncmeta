import { CONFIG } from "../../config";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "jquery-ui";
import _ from "lodash-es";
import { EntityManagerInstance as EntityManager } from "../Manager";
import loadHTML from "../../html.template.loader";
const selectToolGuidanceHtml = await loadHTML(
  "../../../templates/guidance_modeling/select_tool_guidance.html",
  import.meta.url
);
function SelectToolGuidance(id, label, tool, canvas, icon) {
  //var _id = id;
  //var _label = label;
  //var _tool = tool;
  var _canvas = canvas;
  var _$node = $(
    _.template(selectToolGuidanceHtml)({
      text: label,
      icon: icon || "plus-circle",
    })
  );

  _$node.click(function () {
    if (
      EntityManager.getViewId() !== undefined &&
      EntityManager.getLayer() === CONFIG.LAYER.MODEL
    ) {
      if (EntityManager.getNodeType(tool) !== null) {
        _canvas.mountTool(EntityManager.getNodeType(tool).VIEWTYPE);
      } else {
        _canvas.mountTool(tool);
      }
    } else _canvas.mountTool(tool);

    _canvas.hideGuidanceBox();
    //guidanceFollowed does not exists, seems to be unnecessary and obsolete
    // _canvas.guidanceFollowed();
  });

  this.get$node = function () {
    return _$node;
  };
}

export default SelectToolGuidance;
