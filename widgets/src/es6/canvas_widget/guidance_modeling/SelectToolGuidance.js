import $ from "jquery-ui";
import _ from "lodash";
import EntityManager from "canvas_widget/EntityManager";
import selectToolGuidanceHtml from "text!templates/guidance_modeling/select_tool_guidance.html";
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
