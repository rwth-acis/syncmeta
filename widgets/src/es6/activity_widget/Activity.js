import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import IWCW from "../lib/IWCWrapper";
import Util from "../Util";
import MoveCanvasOperation from "../operations/non_ot/MoveCanvasOperation";
const activityBoxHtml = await loadHTML(
  "../../templates/activity_widget/activity_box.html",
  import.meta.url
);
import { CONFIG } from "../config";
/**
 * An abstract user activity issued by one of the users
 * @class activity_widget.Activity
 * @memberof activity_widget
 * @constructor
 * @param {string} entityId Entity id of the entity the activity works on
 * @param {string} sender JabberId of the user who issued this activity
 * @param {string} text Text of this activit  y whichis displayed in the activity widget
 */
class Activity {
  _type = undefined;
  constructor(entityId, sender, text, timestamp) {
    var that = this;

    var isTrackable = false;

    /**
     * Inter widget communication wrapper
     * @type {Object}
     */
    var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.ACTIVITY);

    /**
     * Entity id of the entity this activity works on
     * @type {string}
     * @private
     */
    var _entityId = entityId;

    /**
     * JabberId of the user who issued this activity
     * @type {string}
     * @private
     */
    var _sender = sender;

    /**
     * Text of this activity which is displayed in the activity widget
     * @type {string}
     * @private
     */
    var _text = text;

    /**
     * the timestamp of the activity
     * @type {number}
     * @private
     */
    var _timestamp = timestamp;

    /**
     * the type of the activity
     * @type {string}
     * @private
     */
    this._type = undefined;

    /**
     * Activity box template
     * @type {function}
     * @private
     */
    var _activityBoxTemplate = _.template(activityBoxHtml);

    /**
     * Convert timestamp to a nice string to display in the activity list
     */
    var getDateTimeAsString = function () {
      const today = new Date();
      var d = new Date(_timestamp);

      // if the activity is from today, only display the time
      if (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      ) {
        var hour = d.getHours();
        var min = d.getMinutes();

        // add leading zero if necessary
        if (hour < 10) {
          hour = "0" + hour;
        }
        if (min < 10) {
          min = "0" + min;
        }

        var dateTime = hour + ":" + min;
        return dateTime;
      }
      // if the activity is from this year, only display the date and time

      var months = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];

      var year = d.getFullYear() % 100;
      var month = months[d.getMonth()];
      var date = d.getDate();
      var hour = d.getHours();
      var min = d.getMinutes();

      // add leading zero if necessary
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (min < 10) {
        min = "0" + min;
      }

      // if the activity is from this year, only display the date and time
      if (d.getFullYear() === today.getFullYear()) {
        var dateTime = date + "." + month + "/" + hour + ":" + min;
        return dateTime;
      }

      var dateTime = date + "." + month + "." + year + "/" + hour + ":" + min;
      return dateTime;
    };

    /**
     * jQuery object of DOM node representing the activity
     * @type {jQuery}
     * @private
     */
    /*var _$node = $(_activityBoxTemplate({
         heading: space.members.hasOwnProperty(_sender) ? space.members[_sender][CONFIG.NS.PERSON.TITLE] : "",
         text: _text,
         color: space.members.hasOwnProperty(_sender) ? Util.getColor(space.members[_sender].globalId) : "#000000"
         })).hide();*/
    var _$node;
    if (_sender) {
      const userList = y.getMap("userList");
      _$node = $(
        _activityBoxTemplate({
          heading: userList.get(_sender)
            ? userList.get(_sender)[CONFIG.NS.PERSON.TITLE]
            : "Anonymous",
          text: _text,
          color: userList.get(_sender)
            ? Util.getColor(userList.get(_sender).globalId)
            : "#C0C5CE",
          timestamp: getDateTimeAsString(),
        })
      ).hide();
    } else
      _$node = $(
        _activityBoxTemplate({
          heading: "",
          text: "",
          color: "#000000",
          timestamp: getDateTimeAsString(),
        })
      ).hide();

    /**
     * jQuery object of DOM node representing the activity text
     * @type {jQuery}
     * @private
     */
    var _$textNode = _$node.find(".text");

    /**
     * Get the entity id of the entity this activity works on
     * @returns {string}
     */
    this.getEntityId = function () {
      return _entityId;
    };

    /**
     * Get JabberId of the user who issued this activity
     * @returns {string}
     */
    this.getSender = function () {
      return _sender;
    };

    /**
     * Get the timestamp of the activity
     */
    this.getTimestampe = function () {
      return _timestamp;
    };

    /**
     * Get the text of this activity which is displayed in the activity widget
     * @returns {string}
     */
    this.getText = function () {
      return _text;
    };

    /**
     * Set the text of this activity which is displayed in the activity widget
     * @param {string} text
     */
    this.setText = function (text) {
      _text = text;
      _$textNode.text(text);
    };

    /**
     * Get the DOM node of this activity as jquery object
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    this.isTrackable = function () {
      return isTrackable;
    };
    /**
     * Hide the DOM node of this attribute
     */
    this.hide = function () {
      this.get$node().hide();
    };

    /**
     * Show the DOM node of this attribute
     */
    this.show = function () {
      this.get$node().show();
    };

    this.setType = function (type) {
      this._type = type;
    };
    this.getType = function () {
      return this._type;
    };

    /**
     * activity to JSON
     */
    this._toJSON = function () {
      var json = {
        entityId: _entityId,
        sender: _sender,
        text: _text,
        timestamp: _timestamp,
        type: this._type,
      };
      const userList = y.getMap("userList");
      var user = userList.get(sender);
      if (user) {
        json.user = {};
        json.user.title = user[CONFIG.NS.PERSON.TITLE];
        json.user.mail = user[CONFIG.NS.PERSON.MBOX];
        json.user.color = Util.getColor(user.globalId);
      }
      return json;
    };

    this.trackable = function () {
      _$node.click(function (event) {
        var operation = new MoveCanvasOperation(that.getEntityId(), false);
        _iwcw.sendLocalNonOTOperation(
          CONFIG.WIDGET.NAME.MAIN,
          operation.toNonOTOperation()
        );
      });
      _$node.hover(
        function () {
          const color = y.getMap("userList").get(_sender)
            ? Util.getColor(y.getMap("userList").get(_sender).globalId)
            : "#ccc";
          $(this).css("border", "5px solid " + color);
        },
        function () {
          const color = y.getMap("userList").get(_sender)
            ? Util.getColor(y.getMap("userList").get(_sender).globalId)
            : "#ccc";
          $(this).css("border", "1px solid" + color);
        }
      );
      _$node.find(".timestamp").css("border-color", "rgb(112, 222, 148)");
      isTrackable = true;
    };

    this.untrackable = function () {
      const color = y.getMap("userList").get(_sender)?.globalId
        ? Util.getColor(y.getMap("userList").get(_sender).globalId)
        : "rgb(112, 222, 148)";
      _$node.off();
      _$node.find(".timestamp").css("border-color", color);
      isTrackable = false;
    };
  }
  /**
   * activity to JSON
   */
  toJSON() {
    return this._toJSON();
  }
}

export default Activity;
