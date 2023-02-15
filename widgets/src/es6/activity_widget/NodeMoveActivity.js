import _ from "lodash-es";
import Activity from "./Activity";

/**
 * Activity representing the movement of a node
 * @class activity_widget.NodeMoveActivity
 * @memberof activity_widget
 * @extends activity_widget.Activity
 * @param {string} entityId Entity id of the entity this activity works on
 * @param {string} sender JabberId of the user who issued this activity
 * @param {string} text Text of this activity which is displayed in the activity widget
 * @param {string} nodeType Type of the created node
 * @constructor
 */
class NodeMoveActivity extends Activity {
  static TYPE = "NodeMoveActivity";
  constructor(entityId, sender, text, timestamp, nodeType) {
    super(entityId, sender, text, timestamp);

    this.toJSON = function () {
      var json = Activity.prototype.toJSON.call(this);
      json.type = NodeMoveActivity.TYPE;
      json.nodeType = nodeType;
      return json;
    };
  }
}

export default NodeMoveActivity;
