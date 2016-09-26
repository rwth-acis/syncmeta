define([
    'jqueryui',
    'lodash',
    'iwcw',
    'activity_widget/Activity',
    'operations/ot/ValueChangeOperation',
    'operations/non_ot/ActivityOperation'
],/** @lends ValueChangeActivity */function($,_,IWCW,Activity,ValueChangeOperation,ActivityOperation) {

    ValueChangeActivity.TYPE = "ValueChangeActivity";

    ValueChangeActivity.prototype = new Activity();
	ValueChangeActivity.prototype.constructor = ValueChangeActivity;
    /**
     * Activity representing the modification of an attribute value
     * @class activity_widget.ValueChangeActivity
     * @memberof activity_widget
     * @extends activity_widget.Activity
     * @param {string} entityId Entity id of the entity this activity works on
     * @param {string} sender JabberId of the user who issued this activity
     * @param {string} text Text of this activity which is displayed in the activity widget
     * @param {string} value Value of the attribute after the change
     * @param {string} subjectEntityName Name of the entity the changed Value object is assigned to
     * @param {string} rootSubjectEntityType Type of topmost entity in the chain of entities the value is assigned to
     * @param {string} rootSubjectEntityId Entity id of topmost entity in the chain of entities the attribute is assigned to
     * @constructor
     */
    function ValueChangeActivity(entityId,sender,text,value,subjectEntityName,rootSubjectEntityType,rootSubjectEntityId){
        var that = this;

        Activity.call(this,entityId,sender,text);

        /**
         * Value of the attribute
         * @type {string}
         * @private
         */
        var _value = value;

        /**
         * Name of the entity the changed Value object is assigned to
         * @type {string}
         * @private
         */
        var _subjectEntityName = subjectEntityName;

        /**
         * Type of topmost entity in the chain of entities the value is assigned to
         * @type {string}
         * @private
         */
        var _rootSubjectEntityType = rootSubjectEntityType;

        /**
         * Entity id of topmost entity in the chain of entities the attribute is assigned to
         * @type {string}
         * @private
         */
        var _rootSubjectEntityId = rootSubjectEntityId;

        /**
         * Inter widget communication wrapper
         * @type {Object}
         */
        var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ACTIVITY);

        /**
         * Callback for received Value Change Activity referring the root subject entity label
         * @param {operations.non_ot.ActivityOperation} operation
         */
        var rootSubjectEntityLabelChangeCallback = function(operation) {
            if (operation instanceof ActivityOperation &&
                operation.getType() === ValueChangeActivity.TYPE &&
                that.getRootSubjectEntityId() + "[label]" === operation.getEntityId()) {

                that.setText(ValueChangeOperation.getOperationDescription(_subjectEntityName, _rootSubjectEntityType, operation.getData().value));
            }

        };

        /**
         * Get value of attribute
         * @returns {string}
         */
        this.getValue = function(){
            return _value;
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get name of the entity the changed Value object is assigned to
         * @returns {string}
         */
        this.getSubjectEntityName = function(){
            return _subjectEntityName;
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get type of topmost entity in the chain of entities the value is assigned to
         * @returns {string}
         */
        this.getRootSubjectEntityType = function(){
            return _rootSubjectEntityType;
        };

        /**
         * Get entity id of topmost entity in the chain of entities the value is assigned to
         * @returns {string}
         */
        this.getRootSubjectEntityId = function(){
            return _rootSubjectEntityId;
        };

        /**
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function(){
            iwc.registerOnDataReceivedCallback(rootSubjectEntityLabelChangeCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function(){
            iwc.unregisterOnDataReceivedCallback(rootSubjectEntityLabelChangeCallback);
        };

        if(iwc){
            this.registerCallbacks();
        }

    }

    return ValueChangeActivity;

});
