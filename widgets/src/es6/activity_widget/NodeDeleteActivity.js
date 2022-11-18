import Activity from "./Activity";

/**
 * Activity representing the deletion of a node
 * @class activity_widget.NodeDeleteActivity
 * @memberof activity_widget
 * @extends activity_widget.Activity
 * @param {string} entityId Entity id of the entity this activity works on
 * @param {string} sender JabberId of the user who issued this activity
 * @param {string} text Text of this activity which is displayed in the activity widget
 * @constructor
 */
class NodeDeleteActivity extends Activity {
  static TYPE = "NodeDeleteActivity";
  constructor(entityId, sender, text, timestamp) {
    super(entityId, sender, text, timestamp);

    this.toJSON = function () {
      var json = Activity.prototype.toJSON.call(this);
      json.type = NodeDeleteActivity.TYPE;
      return json;
    };
  }
}

export default NodeDeleteActivity;
