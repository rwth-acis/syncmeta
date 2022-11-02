import $ from "jquery-ui";
import _ from "lodash";
import IWCW from "iwcw";
import Activity from "activity_widget/Activity";
import ValueChangeActivity from "activity_widget/ValueChangeActivity";
import NodeAddOperation from "operations/ot/NodeAddOperation";
import ActivityOperation from "operations/non_ot/ActivityOperation";

NodeAddActivity.TYPE = "NodeAddActivity";

NodeAddActivity.prototype = new Activity();
NodeAddActivity.prototype.constructor = NodeAddActivity;
/**
 * Activity representing the addition of a new node
 * @class activity_widget.NodeAddActivity
 * @memberof activity_widget
 * @extends activity_widget.Activity
 * @param {string} entityId Entity id of the entity this activity works on
 * @param {string} sender JabberId of the user who issued this activity
 * @param {string} text Text of this activity which is displayed in the activity widget
 * @param {string} nodeType Type of the created node
 * @constructor
 */
function NodeAddActivity(entityId, sender, text, timestamp, nodeType) {
  Activity.call(this, entityId, sender, text, timestamp);

  this.toJSON = function () {
    var json = Activity.prototype.toJSON.call(this);
    json.nodeType = nodeType;
    json.type = NodeAddActivity.TYPE;
    return json;
  };
}

export default NodeAddActivity;
