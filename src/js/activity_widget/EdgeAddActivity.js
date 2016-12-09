define([
    'jqueryui',
    'lodash',
    'iwcw',
    'activity_widget/Activity',
    'activity_widget/ValueChangeActivity',
    'operations/ot/EdgeAddOperation',
    'operations/non_ot/ActivityOperation'
],/** @lends EdgeAddActivity */function($,_,IWCW,Activity,ValueChangeActivity,EdgeAddOperation,ActivityOperation) {

    EdgeAddActivity.TYPE = "EdgeAddActivity";

    EdgeAddActivity.prototype = new Activity();
	EdgeAddActivity.prototype.constructor = EdgeAddActivity;
    /**
     * Activity representing the addition of a new edge
     * @class activity_widget.EdgeAddActivity
     * @memberof activity_widget
     * @extends activity_widget.Activity
     * @constructor
     * @param {string} entityId Entity id of the entity this activity works on
     * @param {string} sender JabberId of the user who issued this activity
     * @param {string} text Text of this activity which is displayed in the activity widget
     * @param {string} edgeType Type of the created edge
     * @param {string} sourceNodeLabel Label of the source node
     * @param {string} sourceNodeId Entity id of the source node
     * @param {string} sourceNodeType Type of the source node
     * @param {string} targetNodeLabel Label of the target node
     * @param {string} targetNodeId Entity id of the target node
     * @param {string} targetNodeType Type of the tarhet node
     */
    function EdgeAddActivity(entityId,sender,text,edgeType,sourceNodeLabel,sourceNodeId,sourceNodeType,targetNodeLabel,targetNodeId,targetNodeType){
        var that = this;
        
        Activity.call(this,entityId,sender,text);

        /**
         * Type of created edge
         * @type {string}
         * @private
         */
        var _edgeType = edgeType;

        /**
         * Label of source node
         * @type {string}
         * @private
         */
        var _sourceNodeLabel = sourceNodeLabel;

        /**
         * Entity id of source node
         * @type {string}
         * @private
         */
        var _sourceNodeId = sourceNodeId;

        /**
         * Type of source node
         * @type {string}
         * @private
         */
        var _sourceNodeType = sourceNodeType;

        /**
         * Label of target node
         * @type {string}
         * @private
         */
        var _targetNodeLabel = targetNodeLabel;

        /**
         * Entity id of target node
         * @type {string}
         * @private
         */
        var _targetNodeId = targetNodeId;

        /**
         * Type of target node
         * @type {string}
         * @private
         */
        var _targetNodeType = targetNodeType;

        /**
         * Label of the created edge
         * @type {string}
         * @private
         */
        var _edgeLabel = "";

        /**
         * Inter widget communication wrapper
         * @type {Object}
         */
        var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ACTIVITY);

        /**
         * Callback for received Value Change Activity referring the edge label
         * @param {operations.non_ot.ActivityOperation} operation
         */
        var edgeLabelChangeCallback = function (operation) {
            if (operation instanceof ActivityOperation &&
                operation.getType() === ValueChangeActivity.TYPE &&
                that.getEntityId() + "[label]" === operation.getEntityId()) {

                _edgeLabel = operation.getData().value;
                that.setText(EdgeAddOperation.getOperationDescription(_edgeType, _edgeLabel, _sourceNodeType, _sourceNodeLabel, _targetNodeType, _targetNodeLabel));
            }
        };

        /**
         * Callback for received Value Change Activity referring the source node label
         * @param {operations.non_ot.ActivityOperation} operation
         */
        var sourceNodeLabelChangeCallback = function(operation) {
            if (operation instanceof ActivityOperation &&
                operation.getType() === ValueChangeActivity.TYPE &&
                _sourceNodeId + "[label]" === operation.getEntityId()) {

                _sourceNodeLabel = operation.getData().value;
                that.setText(EdgeAddOperation.getOperationDescription(_edgeType, _edgeLabel, _sourceNodeType, _sourceNodeLabel, _targetNodeType, _targetNodeLabel));
            }

        };

        /**
         * Callback for received Value Change Activity referring the target node label
         * @param {operations.non_ot.ActivityOperation} operation
         */
        var targetNodeLabelChangeCallback = function(operation) {
            if (operation instanceof ActivityOperation &&
                operation.getType() === ValueChangeActivity.TYPE &&
                _targetNodeId + "[label]" === operation.getEntityId()) {

                _targetNodeLabel = operation.getData().value;
                that.setText(EdgeAddOperation.getOperationDescription(_edgeType, _edgeLabel, _sourceNodeType, _sourceNodeLabel, _targetNodeType, _targetNodeLabel));
            }
        };

        /**
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function(){
            iwc.registerOnDataReceivedCallback(edgeLabelChangeCallback);
            iwc.registerOnDataReceivedCallback(sourceNodeLabelChangeCallback);
            iwc.registerOnDataReceivedCallback(targetNodeLabelChangeCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function(){
            iwc.unregisterOnDataReceivedCallback(edgeLabelChangeCallback);
            iwc.unregisterOnDataReceivedCallback(sourceNodeLabelChangeCallback);
            iwc.unregisterOnDataReceivedCallback(targetNodeLabelChangeCallback);
        };
        
        /**
         * activity to json
         */
        this.toJSON = function(){
            var json = Activity.prototype.toJSON.call(this);
            json.type = EdgeAddActivity.TYPE;
            json.edgeType = _edgeType;
            json.edgeLabel = _edgeLabel;
            json.sourceNodeLabel = _sourceNodeLabel;
            json.sourceNodeId = _sourceNodeId;
            json.sourceNodeType = _sourceNodeType;
            json.targetNodeLabel = _targetNodeLabel;
            json.targetNodeId = _targetNodeId;
            json.targetNodeType = _targetNodeType;
            return json;
        }

        if(iwc){
            this.registerCallbacks();
        }
        
    }

    return EdgeAddActivity;

});
