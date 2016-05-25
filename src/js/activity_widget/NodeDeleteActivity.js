define(['activity_widget/Activity'],/** @lends NodeDeleteActivity */function(Activity) {
    NodeDeleteActivity.TYPE = "NodeDeleteActivity";

    NodeDeleteActivity.prototype = new Activity();
	NodeDeleteActivity.prototype.constructor = NodeDeleteActivity;
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
    function NodeDeleteActivity(entityId,sender,text){
        Activity.call(this,entityId,sender,text);
    }

    return NodeDeleteActivity;

});
