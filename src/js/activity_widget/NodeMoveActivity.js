define([
    'jqueryui',
    'lodash',
    'iwcw',
    'activity_widget/Activity',
    'activity_widget/ValueChangeActivity',
    'operations/ot/NodeMoveOperation',
    'operations/non_ot/ActivityOperation'
],/** @lends NodeMoveActivity */function($,_,IWCW,Activity,ValueChangeActivity,NodeMoveOperation,ActivityOperation) {

    NodeMoveActivity.TYPE = "NodeMoveActivity";

    NodeMoveActivity.prototype = new Activity();
    NodeMoveActivity.prototype.constructor = NodeMoveActivity;
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
    function NodeMoveActivity(entityId,sender,text,nodeType){
        Activity.call(this,entityId,sender,text);

        this.toJSON = function(){
            var json = Activity.prototype.toJSON.call(this);
            json.type = NodeMoveActivity.TYPE;
            json.nodeType = nodeType;
            return json;
        }
    }

    return NodeMoveActivity;

});
