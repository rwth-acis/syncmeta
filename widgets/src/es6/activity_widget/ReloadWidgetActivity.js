import Activity from "./Activity";

/**
 * Activity representing the deletion of an edge
 * @class activity_widget.UserJoinActivity
 * @memberof activity_widget
 * @extends activity_widget.Activity
 * @param {string} entityId Entity id of the entity this activity works on
 * @param {string} sender JabberId of the user who issued this activity
 * @param {string} text Text of this activity which is displayed in the activity widget
 * @constructor
 */
class ReloadWidgetActivity extends Activity {
  static TYPE = "ReloadWidgetActivity";
  constructor(entityId, sender, text, timestamp) {
    super(entityId, sender, text, timestamp);
  }
}

export default ReloadWidgetActivity;
