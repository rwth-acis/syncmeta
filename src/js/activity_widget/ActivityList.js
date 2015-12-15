define([
    'jqueryui',
    'lodash',
    'iwcw',
    'activity_widget/Activity',
    'activity_widget/NodeAddActivity',
    'activity_widget/NodeDeleteActivity',
    'activity_widget/NodeMoveActivity',
    'activity_widget/NodeResizeActivity',
    'activity_widget/EdgeAddActivity',
    'activity_widget/EdgeDeleteActivity',
    'activity_widget/EditorGenerateActivity',
    'activity_widget/UserJoinActivity',
    'activity_widget/ValueChangeActivity',
    'activity_widget/ViewApplyActivity',
    'activity_widget/User',
    'operations/non_ot/ActivityOperation',
    'operations/non_ot/EntitySelectOperation'
],/** @lends ActivityList */function($,_,IWCW,Activity,NodeAddActivity,NodeDeleteActivity,NodeMoveActivity,NodeResizeActivity,EdgeAddActivity,EdgeDeleteActivity,EditorGenerateActivity,UserJoinActivity,ValueChangeActivity,ViewApplyActivity, User,ActivityOperation,EntitySelectOperation) {

    /**
     * List of user activities
     * @class activity_widget.ActivityList
     * @memberof activity_widget
     * @constructor
     * @param {jQuery} $userListNode jquery object of DOM node representing the user list
     * @param {jQuery} $activityListNode jquery object of DOM node representing the activity list
     */
    function ActivityList($userListNode,$activityListNode){
        var that = this;

        /**
         * jQuery object of DOM node representing the user list
         * @type {jQuery}
         * @private
         */
        var _$userListNode = $userListNode;

        /**
         * jQuery object of DOM node representing the activity list
         * @type {jQuery}
         * @private
         */
        var _$activityListNode = $activityListNode;

        /**
         * List of user
         * @type {object}
         */
        var userList = {};

        /**
         * List of activities
         * @type {Array}
         */
        var activityList = [];

        /**
         * Inter widget communication wrapper
         * @type {Object}
         */
        var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ACTIVITY);

        /**
         * Add an user to the user list
         * @param {string} jabberId
         */
        this.addUser = function(jabberId){
            var user;
            if(!userList.hasOwnProperty(jabberId)){
                user = new User(jabberId,new Date());
                userList[jabberId] = user;
                _$userListNode.append(user.get$node().show("clip",{},200));
            } else {
                user = userList[jabberId];
                user.setLastActivityDate(new Date());
                user.show();
            }
        };

        /**
         * Get user by jabber Id
         * @param {string} jabberId
         * @returns {activity_widget.User}
         */
        this.getUser = function(jabberId){
            if(userList.hasOwnProperty(jabberId)){
                return userList[jabberId];
            }
            return null;
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Remove User by jabber Id
         * @param {string} jabberId
         */
        this.removeUser = function(jabberId){
            var user;
            if(userList.hasOwnProperty(jabberId)){
                user = userList[jabberId];
                user.setLastActivityDate(new Date());
                user.hide();
            }
        };

        /**
         * Add an activity to the activity list
         * @param {activity_widget/Activity} activity
         */
        this.addActivity = function(activity){
            activityList.unshift(activity);
            _$activityListNode.prepend(activity.get$node().show("clip",{},200));
        };

        /**
         * Get first activity from the list
         * @returns {Activity}
         */
        this.getFirst = function(){
            if(activityList.length > 0){
                return activityList[0];
            }
            return null;
        };

        /**
         * Callback for received Operations
         * @param {operations.non_ot.ActivityOperation|operations.non_ot.EntitySelectOperation} operation
         */
        //TODO: Create abstract Operation class
        var operationCallback = function(operation){
            var activity,
                user,
                firstActivity,
                data;

            if(operation instanceof ActivityOperation){
                data = operation.getData();
                switch(operation.getType()){
                    case NodeAddActivity.TYPE:
                        activity = new NodeAddActivity(operation.getEntityId(),operation.getSender(),operation.getText(),data.nodeType);
                        that.addActivity(activity);
                        break;
                    case EdgeAddActivity.TYPE:
                        activity = new EdgeAddActivity(operation.getEntityId(),operation.getSender(),operation.getText(),data.nodeType,data.sourceNodeLabel,data.sourceNodeId,data.sourceNodeType,data.targetNodeLabel,data.targetNodeId,data.targetNodeType);
                        that.addActivity(activity);
                        break;
                    case NodeDeleteActivity.TYPE:
                        activity = new NodeDeleteActivity(operation.getEntityId(),operation.getSender(),operation.getText());
                        that.addActivity(activity);
                        break;
                    case EdgeDeleteActivity.TYPE:
                        activity = new EdgeDeleteActivity(operation.getEntityId(),operation.getSender(),operation.getText());
                        that.addActivity(activity);
                        break;
                    case NodeMoveActivity.TYPE:
                        activity = new NodeMoveActivity(operation.getEntityId(),operation.getSender(),operation.getText(),data.nodeType);
                        that.addActivity(activity);
                        break;
                    case NodeResizeActivity.TYPE:
                        activity = new NodeResizeActivity(operation.getEntityId(),operation.getSender(),operation.getText(),data.nodeType);
                        that.addActivity(activity);
                        break;
                    case ValueChangeActivity.TYPE:
                        activity = new ValueChangeActivity(operation.getEntityId(),operation.getSender(),operation.getText(),data.value,data.subjectEntityName,data.rootSubjectEntityType,data.rootSubjectEntityId);
                        firstActivity = that.getFirst();
                        if(firstActivity && firstActivity instanceof ValueChangeActivity && firstActivity.getEntityId() === activity.getEntityId() && firstActivity.getSender() === activity.getSender()){
                            firstActivity.setText(activity.getText());
                        } else {
                            that.addActivity(activity);
                        }
                        break;
                    case EditorGenerateActivity.TYPE:
                        activity = new EditorGenerateActivity(operation.getEntityId(),operation.getSender(),operation.getText());
                        that.addActivity(activity);
                        break;
                    case UserJoinActivity.TYPE:
                        that.addUser(operation.getSender());
                        break;
                    case ViewApplyActivity.TYPE:
                        activity = new ViewApplyActivity(operation.getEntityId(),operation.getSender());
                        if (userList.hasOwnProperty(activity.getSender())) {
                            userList[activity.getSender()].get$node().find('.lblViewId').text(activity.getViewId());
                        }
                        return;
                }
                user = that.getUser(operation.getSender());
                if(user){
                    user.setLastActivityDate(new Date());
                }
                return;
            }
            if(operation instanceof EntitySelectOperation){
                if(operation.getSelectedEntityId() === null){
                    _.each(activityList,function(activity){
                        activity.show();
                    });
                } else {
                    _.each(activityList,function(actvity){
                        actvity.show();
                    });
                    _.each(_.filter(activityList,function(activity){
                        if(activity instanceof ValueChangeActivity){
                            return activity.getRootSubjectEntityId() !== operation.getSelectedEntityId();
                        }
                        return activity.getEntityId() !== operation.getSelectedEntityId();
                    }),function(activity){
                        activity.hide();
                    });
                }
            }
        };

        /**
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function(){
            iwc.registerOnDataReceivedCallback(operationCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function(){
            iwc.unregisterOnDataReceivedCallback(operationCallback);
        };

        if(iwc){
            this.registerCallbacks();
        }
    }

    return ActivityList;

});
