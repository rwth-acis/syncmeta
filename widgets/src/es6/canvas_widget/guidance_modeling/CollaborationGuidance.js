import { CONFIG } from "../../config";
import IWCW from "../../lib/IWCWrapper";
import $ from "jquery-ui";
import _ from "lodash";
import CollaborateInActivityOperation from "../../operations/non_ot/CollaborateInActivityOperation";
const selectToolGuidanceHtml = await loadHTML(
  "../../../html/templates/guidance_modeling/collaboration_guidance.html",
  import.meta.url
);
function CollaborationGuidance(id, label, activityId, objectId, canvas) {
  var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);
  var _canvas = canvas;
  var _$node = $(
    _.template(selectToolGuidanceHtml)({ text: label, icon: "users" })
  );

  _$node.click(function () {
    var operation = new CollaborateInActivityOperation(activityId);
    _iwcw.sendLocalNonOTOperation(
      CONFIG.WIDGET.NAME.GUIDANCE,
      operation.toNonOTOperation()
    );
    _canvas.hideGuidanceBox();
    _canvas.scrollNodeIntoView(objectId);
  });

  this.get$node = function () {
    return _$node;
  };
}

export default CollaborationGuidance;
