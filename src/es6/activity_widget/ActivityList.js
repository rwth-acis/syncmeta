import _ from "lodash-es";
import Activity from "./Activity";
import NodeAddActivity from "./NodeAddActivity";
import NodeDeleteActivity from "./NodeDeleteActivity";
import NodeMoveActivity from "./NodeMoveActivity";
import NodeResizeActivity from "./NodeResizeActivity";
import EdgeAddActivity from "./EdgeAddActivity";
import EdgeDeleteActivity from "./EdgeDeleteActivity";
import EditorGenerateActivity from "./EditorGenerateActivity";
import UserJoinActivity from "./UserJoinActivity";
import ValueChangeActivity from "./ValueChangeActivity";
import ViewApplyActivity from "./ViewApplyActivity";
import ReloadWidgetActivity from "./ReloadWidgetActivity";
import User from "./User";
import ActivityOperation from "../operations/non_ot/ActivityOperation";

/**
 * List of user activities
 * @class activity_widget.ActivityList
 * @memberof activity_widget
 * @constructor
 * @param {jQuery} $userListNode jquery object of DOM node representing the user list
 * @param {jQuery} $activityListNode jquery object of DOM node representing the activity list
 */
class ActivityList {
  that;

  /**
   * jQuery object of DOM node representing the user list
   * @type {jQuery}
   * @private
   */
  _$userListNode;

  /**
   * jQuery object of DOM node representing the activity list
   * @type {jQuery}
   * @private
   */
  _$activityListNode;

  /**
   * List of user
   * @type {object}
   */
  userList = {};

  /**
   * List of activities
   * @type {Array}
   */
  activityList = [];

  /**
   * Add an user to the user list
   * @param {string} jabberId
   */
  addUser;

  /**
   * Get user by jabber Id
   * @param {string} jabberId
   * @returns {activity_widget.User}
   */
  getUser;

  //noinspection JSUnusedGlobalSymbols
  /**
   * Remove User by jabber Id
   * @param {string} jabberId
   */
  removeUser;

  /**
   * Add an activity to the activity list
   * @param {activity_widget/Activity} activity
   */
  addActivity;

  addActivityToLog;
  /**
   * Get first activity from the list
   * @returns {Activity}
   */
  getFirst;

  /**
   * Activity List to JSON
   */
  toJSON;
  /**
   * Callback for received Operations
   * @param {operations.non_ot.ActivityOperation|operations.non_ot.EntitySelectOperation} operation
   */
  operationCallback;

  findUntrackableActivities;

  findTrackableActivities;
  init;
  constructor($userListNode, $activityListNode) {
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
     * Add an user to the user list
     * @param {string} jabberId
     */
    this.addUser = function (jabberId, isLocalUser = false) {
      if (!jabberId) {
        return;
      }
      var user;
      if (!userList.hasOwnProperty(jabberId)) {
        const userListContainsLocalUser = _.some(
          userList,
          (u) => u.isLocalUser
        );
        user = new User(jabberId, new Date(), isLocalUser);
        if (user.isLocalUser && userListContainsLocalUser) {
          console.warn(
            "Local user already exists in user list. Not adding new local user."
          );
          return;
        }
        if (user.isAnonymous) {
          if (!Object.values(userList).some((user) => user.isAnonymous)) {
            // if there is no anonymous user in the list, add the new one
            userList[jabberId] = user;
            _$userListNode.append(user.get$node().show("clip", {}, 200));
          }
        } else {
          userList[jabberId] = user;
          _$userListNode.append(user.get$node().show("clip", {}, 200));
        }
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
    this.getUser = function (jabberId) {
      if (userList.hasOwnProperty(jabberId)) {
        return userList[jabberId];
      }
      return null;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Remove User by jabber Id
     * @param {string} jabberId
     */
    this.removeUser = function (jabberId) {
      var user;
      if (userList.hasOwnProperty(jabberId)) {
        user = userList[jabberId];
        user.setLastActivityDate(new Date());
        user.hide();
      }
    };

    /**
     * Add an activity to the activity list
     * @param {activity_widget/Activity} activity
     */
    this.addActivity = function (activity) {
      activityList.unshift(activity);
      _$activityListNode.prepend(activity.get$node().show("clip", {}, 200));
    };

    this.addActivityToLog = function (activity, data) {
      //add activity to yjs log, also start the log if not already
      const activityMap = y.getMap("activity");
      var jsonActivityList = activityMap.get("log");
      if (!jsonActivityList) activityMap.set("log", that.toJSON());
      else {
        /*if (activity instanceof ValueChangeActivity && jsonActivityList.length > 0) {
                      var first = jsonActivityList[0];
                      if (first.type === ValueChangeActivity.TYPE)
                          first.text = activity.getText();
                  }
                  else{*/
        var json = activity.toJSON();
        if (data) json.data = data;
        jsonActivityList.unshift(json);
        //}
        activityMap.set("log", jsonActivityList);
      }
    };

    /**
     * Get first activity from the list
     * @returns {Activity}
     */
    this.getFirst = function () {
      if (activityList.length > 0) {
        return activityList[0];
      }
      return null;
    };

    /**
     * Activity List to JSON
     */
    this.toJSON = function () {
      var list = [];
      _.forEach(activityList, function (activity) {
        list.unshift(activity.toJSON());
      });
      return list;
    };

    /**
     * Callback for received Operations
     * @param {operations.non_ot.ActivityOperation|operations.non_ot.EntitySelectOperation} operation
     */
    var operationCallback = function (operation) {
      var activity, user, firstActivity, data;

      if (operation instanceof ActivityOperation) {
        data = operation.getData();
        if (!operation.getType()) {
          console.warn("Operation type not set", operation);
          return;
        }
        switch (operation.getType()) {
          case NodeAddActivity.TYPE:
            activity = new NodeAddActivity(
              operation.getEntityId(),
              operation.getSender(),
              operation.getText(),
              Date.now(),
              data.nodeType
            );
            that.addActivity(activity);

            that.findTrackableActivities(activity);
            break;
          case EdgeAddActivity.TYPE:
            activity = new EdgeAddActivity(
              operation.getEntityId(),
              operation.getSender(),
              operation.getText(),
              Date.now(),
              data.nodeType,
              data.sourceNodeLabel,
              data.sourceNodeId,
              data.sourceNodeType,
              data.targetNodeLabel,
              data.targetNodeId,
              data.targetNodeType
            );
            that.findTrackableActivities(activity);
            that.addActivity(activity);

            that.findTrackableActivities(activity);
            break;
          case NodeDeleteActivity.TYPE:
            activity = new NodeDeleteActivity(
              operation.getEntityId(),
              operation.getSender(),
              operation.getText(),
              Date.now()
            );
            that.addActivity(activity);

            that.findUntrackableActivities(activity);
            break;
          case EdgeDeleteActivity.TYPE:
            activity = new EdgeDeleteActivity(
              operation.getEntityId(),
              operation.getSender(),
              operation.getText(),
              Date.now()
            );
            that.addActivity(activity);

            that.findUntrackableActivities(activity);
            break;
          case NodeMoveActivity.TYPE:
            activity = new NodeMoveActivity(
              operation.getEntityId(),
              operation.getSender(),
              operation.getText(),
              Date.now(),
              data.nodeType
            );
            that.addActivity(activity);

            activity.trackable();
            break;
          case NodeResizeActivity.TYPE:
            activity = new NodeResizeActivity(
              operation.getEntityId(),
              operation.getSender(),
              operation.getText(),
              Date.now(),
              data.nodeType
            );
            that.addActivity(activity);

            activity.trackable();
            break;
          case ValueChangeActivity.TYPE:
            activity = new ValueChangeActivity(
              operation.getEntityId(),
              operation.getSender(),
              operation.getText(),
              Date.now(),
              data.value,
              data.subjectEntityName,
              data.rootSubjectEntityType,
              data.rootSubjectEntityId
            );
            firstActivity = that.getFirst();
            if (
              firstActivity &&
              firstActivity instanceof ValueChangeActivity &&
              firstActivity.getEntityId() === activity.getEntityId() &&
              firstActivity.getSender() === activity.getSender()
            ) {
              firstActivity.setText(activity.getText());
            } else {
              that.addActivity(activity);
            }

            activity.trackable();
            break;
          case EditorGenerateActivity.TYPE:
            activity = new EditorGenerateActivity(
              operation.getEntityId(),
              operation.getSender(),
              operation.getText(),
              Date.now()
            );
            that.addActivity(activity);
            break;
          case UserJoinActivity.TYPE:
            that.addUser(operation.getSender());
            break;
          case "UserLeftActivity": {
            const sender = operation.getSender() || "Anonymous";
            activity = new Activity(
              null,
              sender,
              ".. left the space",
              Date.now()
            );
            activity.setType("UserLeftActivity");
            that.addActivity(activity);
            that.removeUser(operation.getSender());
            break;
          }
          case "ApplyLayoutActivity": {
            activity = new Activity(
              null,
              operation.getSender(),
              operation.getText(),
              Date.now()
            );
            activity.setType("ApplyLayoutActivity");
            that.addActivity(activity);
            break;
          }
          case "ReloadWidgetOperation":
            activity = new ReloadWidgetActivity(
              operation.getEntityId(),
              operation.getSender(),
              operation.getText(),
              Date.now()
            );
            activity.setType("ReloadWidgetOperation");
            that.addActivity(activity);
            break;
          case ViewApplyActivity.TYPE:
            activity = new ViewApplyActivity(
              operation.getEntityId(),
              operation.getSender()
            );
            if (userList.hasOwnProperty(activity.getSender())) {
              userList[activity.getSender()]
                .get$node()
                .find(".lblViewId")
                .text(activity.getViewId());
            }
            break;
          case "WidgetTrackingActivity":
            activity = new Activity(
              operation.getEntityId(),
              operation.getSender(),
              operation.getText(),
              Date.now()
            );
            activity.setType(operation.getType());
            //Don't add this to the activity widget
            break;
          default: {
            activity = new Activity(
              operation.getEntityId(),
              operation.getSender(),
              operation.getText(),
              Date.now()
            );
            activity.setType(operation.getType());
            that.addActivity(activity);
            break;
          }
        }
        user = that.getUser(operation.getSender());
        if (user) {
          user.setLastActivityDate(new Date());
          const userMap = y.getMap("users");
          if (userMap.get(y.clientID) === operation.getSender())
            that.addActivityToLog(activity, data);
        }
        return;
      }
    };

    this.findUntrackableActivities = function (activity) {
      for (var i = 0; i < activityList.length; i++) {
        var a = activityList[i];
        if (
          a.isTrackable &&
          (activity.getEntityId() === a.getEntityId() ||
            a instanceof NodeDeleteActivity ||
            a instanceof EdgeAddActivity)
        ) {
          a.untrackable();
        }
      }
    };

    this.findTrackableActivities = function (activity) {
      for (var i = 0; i < activityList.length; i++) {
        var a = activityList[i];
        if (
          !a.isTrackable() &&
          activity.getEntityId() === a.getEntityId() &&
          !(a instanceof NodeDeleteActivity || a instanceof EdgeDeleteActivity)
        ) {
          a.trackable();
        }
      }
    };

    this.init = function () {
      const activityMap = y.getMap("activity");
      //initialize the activity list with activities of previous session
      var list = activityMap.get("log");
      var activity;
      var checkEntity = function (entityId) {
        const nodesMap = y.getMap("nodes");
        const edgesMap = y.getMap("edges");
        if (nodesMap.has(entityId) || edgesMap.has(entityId)) return true;
        else return false;
      };
      if (list) {
        _.forEachRight(list, function (a) {
          switch (a.type) {
            case NodeAddActivity.TYPE: {
              activity = new NodeAddActivity(
                a.entityId,
                a.sender,
                a.text,
                a.timestamp,
                a.nodeType
              );
              that.addActivity(activity);
              break;
            }
            case NodeDeleteActivity.TYPE: {
              activity = new NodeDeleteActivity(
                a.entityId,
                a.sender,
                a.text,
                a.timestamp
              );
              that.addActivity(activity);
              break;
            }
            case EdgeAddActivity.TYPE: {
              activity = new EdgeAddActivity(
                a.entityId,
                a.sender,
                a.text,
                a.timestamp,
                a.nodeType,
                a.sourceNodeLabel,
                a.sourceNodeId,
                a.sourceNodeType,
                a.targetNodeLabel,
                a.targetNodeId,
                a.targetNodeType
              );
              that.addActivity(activity);
              break;
            }
            case EdgeDeleteActivity.TYPE: {
              activity = new EdgeDeleteActivity(
                a.entityId,
                a.sender,
                a.text,
                a.timestamp
              );
              that.addActivity(activity);
              break;
            }
            case NodeMoveActivity.TYPE: {
              activity = new NodeMoveActivity(
                a.entityId,
                a.sender,
                a.text,
                a.timestamp,
                a.nodeType
              );
              that.addActivity(activity);
              break;
            }
            case NodeResizeActivity.TYPE: {
              activity = new NodeResizeActivity(
                a.entityId,
                a.sender,
                a.text,
                a.timestamp,
                a.nodeType
              );
              that.addActivity(activity);
              const nodesMap = y.getMap("nodes");
              if (nodesMap.size > 0) break;
            }
            case ValueChangeActivity.TYPE: {
              activity = new ValueChangeActivity(
                a.entityId,
                a.sender,
                a.text,
                a.timestamp,
                a.value,
                a.subjectEntityName,
                a.rootSubjectEntityType,
                a.rootSubjectEntityId
              );
              that.addActivity(activity);
              break;
            }
            case EditorGenerateActivity.TYPE: {
              activity = new EditorGenerateActivity(
                a.entityId,
                a.sender,
                a.text,
                a.timestamp
              );
              that.addActivity(activity);
              break;
            }
            default: {
              activity = new Activity(
                a.entityId,
                a.sender,
                a.text,
                a.timestamp
              );
              that.addActivity(activity);
              break;
            }
          }
          if (checkEntity(activity.getEntityId())) activity.trackable();
          else activity.untrackable();
        });
      }
    };
    if (y) {
      const activityMap = y.getMap("activity");
      activityMap.observe(function (event) {
        event.keysChanged.forEach((key) => {
          if (key == "log") return;
          const activity = event.currentTarget.get(key);
          if (!activity) return;
          operationCallback(
            new ActivityOperation(
              activity.type,
              activity.entityId,
              activity.sender,
              activity.text,
              activity.data
            )
          );
        });
      });
      const selectionMap = y.getMap("select");
      selectionMap.observe(function (event) {
        event.keysChanged.forEach((key) => {
          const value = event.currentTarget.get(key);
          if (value === null) {
            _.each(activityList, function (activity) {
              activity.show();
            });
          } else {
            _.each(activityList, function (activity) {
              activity.show();
            });
            _.each(
              _.filter(activityList, function (activity) {
                if (activity instanceof ValueChangeActivity) {
                  return activity.getRootSubjectEntityId() !== value;
                }
                return activity.getEntityId() !== value;
              }),
              function (activity) {
                activity.hide();
              }
            );
          }
        });
      });
    }
  }
}

export default ActivityList;
