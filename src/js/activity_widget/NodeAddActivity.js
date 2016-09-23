define([
    'jqueryui',
    'lodash',
    'iwcw',
    'activity_widget/Activity',
    'activity_widget/ValueChangeActivity',
    'operations/ot/NodeAddOperation',
    'operations/non_ot/ActivityOperation'
],/** @lends NodeAddActivity */function($,_,IWCW,Activity,ValueChangeActivity,NodeAddOperation,ActivityOperation) {

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
    function NodeAddActivity(entityId,sender,text,nodeType){
        var that = this;

        Activity.call(this,entityId,sender,text);
    }

    return NodeAddActivity;

});
