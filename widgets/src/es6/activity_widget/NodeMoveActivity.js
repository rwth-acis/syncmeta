import $ from 'jqueryui';
import _ from 'lodash';
import IWCW from 'iwcw';
import Activity from 'activity_widget/Activity';
import ValueChangeActivity from 'activity_widget/ValueChangeActivity';
import NodeMoveOperation from 'operations/ot/NodeMoveOperation';
import ActivityOperation from 'operations/non_ot/ActivityOperation';

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
    function NodeMoveActivity(entityId,sender,text,timestamp,nodeType){
        Activity.call(this,entityId,sender,text,timestamp);

        this.toJSON = function(){
            var json = Activity.prototype.toJSON.call(this);
            json.type = NodeMoveActivity.TYPE;
            json.nodeType = nodeType;
            return json;
        }
    }

    export default NodeMoveActivity;

