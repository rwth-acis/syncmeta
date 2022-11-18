import Activity from "./Activity";

/**
 * Activity representing the application of a view
 * @class activity_widget.ViewApplyActivity
 * @memberof activity_widget
 * @extends activity_widget.Activity
 * @param {string} viewId the identifier of the view
 * @param {string} sender JabberId of the user who issued this activity
 * @constructor
 */
class ViewApplyActivity extends Activity {
  static TYPE = "ViewApplyActivity";
  constructor(viewId, sender, timestamp) {
    super(null, sender, timestamp);
    var _viewId = viewId;

    /**
     * get the identifier of a view
     * @returns {string}
     */
    this.getViewId = function () {
      return _viewId;
    };
  }
}

export default ViewApplyActivity;
