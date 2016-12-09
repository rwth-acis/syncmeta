define([
    'jqueryui',
    'lodash',
    'activity_widget/Activity',
    'activity_widget/ValueChangeActivity',
    'operations/ot/NodeResizeOperation',
    'operations/non_ot/ActivityOperation'
],/** @lends NodeResizeActivity */function($,_,Activity,ValueChangeActivity,NodeResizeOperation,ActivityOperation) {

    NodeResizeActivity.TYPE = "NodeResizeActivity";

    NodeResizeActivity.prototype = new Activity();
    NodeResizeActivity.prototype.constructor = NodeResizeActivity;
    /**
     * Activity representing the resizing of a node
     * @class activity_widget.NodeResizeActivity
     * @memberof activity_widget
     * @extends activity_widget.Activity
     * @param {string} entityId Entity id of the entity this activity works on
     * @param {string} sender JabberId of the user who issued this activity
     * @param {string} text Text of this activity which is displayed in the activity widget
     * @param {string} nodeType Type of the created node
     * @constructor
     */
    function NodeResizeActivity(entityId,sender,text,nodeType){
        Activity.call(this,entityId,sender,text);

        this.toJSON = function(){
            var json = Activity.prototype.toJSON.call(this);
            json.type = NodeResizeActivity.TYPE;
            json.nodeType = nodeType;
            return json;
        }
    }

    return NodeResizeActivity;

});
