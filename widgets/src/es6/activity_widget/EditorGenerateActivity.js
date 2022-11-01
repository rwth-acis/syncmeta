import Activity from 'activity_widget/Activity';
    EditorGenerateActivity.TYPE = "EditorGenerateActivity";

    EditorGenerateActivity.prototype = new Activity();
	EditorGenerateActivity.prototype.constructor = EditorGenerateActivity;
    /**
     * Activity representing the deletion of an edge
     * @class activity_widget.EditorGenerateActivity
     * @memberof activity_widget
     * @extends activity_widget.Activity
     * @param {string} entityId Entity id of the entity this activity works on
     * @param {string} sender JabberId of the user who issued this activity
     * @param {string} text Text of this activity which is displayed in the activity widget
     * @constructor
     */
    function EditorGenerateActivity(entityId,sender,text, timestamp){
        Activity.call(this,entityId,sender,text, timestamp);

        this.toJSON = function(){
            var json = Activity.prototype.toJSON.call(this);
            json.type = EditorGenerateActivity.TYPE;
            return json;
        }
    }

    export default EditorGenerateActivity;


