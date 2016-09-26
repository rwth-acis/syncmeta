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
        var that = this;

        Activity.call(this,entityId,sender,text);

        /**
         * Type of moved node
         * @type {string}
         * @private
         */
        var _nodeType = nodeType;

        /**
         * Label of moved node
         * @type {string}
         * @private
         */
        var _nodeLabel = "";

        /**
         * Inter widget communication wrapper
         * @type {Object}
         */
        var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ACTIVITY);

        /**
         * Callback for received Value Change Activity referring the node label
         * @param {operations.non_ot.ActivityOperation} operation
         */
        var nodeLabelChangeCallback = function(operation) {
            if (operation instanceof ActivityOperation &&
                operation.getType() === ValueChangeActivity.TYPE &&
                that.getEntityId() + "[label]" === operation.getEntityId()) {

                _nodeLabel = operation.getData().value;
                that.setText(NodeMoveOperation.getOperationDescription(_nodeType, _nodeLabel));
            }
        };

        /**
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function(){
            iwc.registerOnDataReceivedCallback(nodeLabelChangeCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function(){
            iwc.unregisterOnDataReceivedCallback(nodeLabelChangeCallback);
        };

        if(iwc){
            this.registerCallbacks();
        }

    }

    return NodeMoveActivity;

});
