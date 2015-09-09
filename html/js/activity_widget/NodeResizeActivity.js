define([
    'jqueryui',
    'lodash',
    'iwcw',
    'activity_widget/Activity',
    'activity_widget/ValueChangeActivity',
    'operations/ot/NodeResizeOperation',
    'operations/non_ot/ActivityOperation'
],/** @lends NodeResizeActivity */function($,_,IWCW,Activity,ValueChangeActivity,NodeResizeOperation,ActivityOperation) {

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
        var that = this;

        Activity.call(this,entityId,sender,text);

        /**
         * Type of resized node
         * @type {string}
         * @private
         */
        var _nodeType = nodeType;

        /**
         * Label of resized node
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
                that.setText(NodeResizeOperation.getOperationDescription(_nodeType, _nodeLabel));
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

    return NodeResizeActivity;

});
