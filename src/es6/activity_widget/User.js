import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import Util from "../Util";
import loadHTML from "../html.template.loader";
import { CONFIG } from "../config";
const userBoxHtml = await loadHTML(
  "../../templates/activity_widget/user_box.html",
  import.meta.url
);

/**
 * A user working on the model
 * @class activity_widget.User
 * @memberof activity_widget
 * @constructor
 * @param {string} jabberId JabberId of the user
 * @param {Date} lastActivityDate Date of the user's last activity
 */
class User {
  isAnonymous = true;

  constructor(jabberId, lastActivityDate, isLocalUser) {
    var that = this;

    /**
     * Entity id of the entity this user works on
     * @type {string}
     * @private
     */
    var _entityId = jabberId;

    var isLocalUser = isLocalUser;

    const userList = y.getMap("userList");

    this.isAnonymous = !userList.get(jabberId);

    /**
     * Timestamp of the user's last activity
     * @type {Date}
     * @private
     */
    var _lastActivityDate = lastActivityDate;

    /**
     * Text of this user which is displayed in the user widget
     * @type {string}
     * @private
     */
    var _text = "";

    /**
     * User box template
     * @type {function}
     * @private
     */
    var _userBoxTemplate = _.template(userBoxHtml);

    let username;
    if (userList.get(jabberId)) {
      username = userList.get(jabberId)[CONFIG.NS.PERSON.TITLE];
      if (userList.get(jabberId).self) {
        username = username + " (You)";
      }
    } else {
      username = "Anonymous";
    }
    /**
     * jQuery object of DOM node representing the user
     * @type {jQuery}
     * @private
     */

    var _$node = $(
      _userBoxTemplate({
        heading: username,
        text: "",
        color: userList.get(jabberId)
          ? Util.getColor(userList.get(jabberId).globalId)
          : "#C0C5CE",
        view: "",
      })
    ).hide();

    /**
     * jQuery object of DOM node representing the user text
     * @type {jQuery}
     * @private
     */
    var _$textNode = _$node.find(".text"); // te xt node

    /**
     * Get the entity id of t he entity this user works onActivity
     * @returns {string}
     */
    this.getJabberId = function () {
      return _entityId;
    };

    /**
     * Set the timestamp of the user's last activity
     * @param {Date} lastActivityDate
     */
    this.setLastActivityDate = function (lastActivityDate) {
      _lastActivityDate = lastActivityDate;
      updateText();
    };

    /**
     * Get the timestamp of the user's last activity
     * @returns {Date}
     */
    this.getLastActivityDate = function () {
      return _lastActivityDate;
    };

    /**
     * Set the text of this user which is displayed in the user widget
     * @param {string} text
     */
    var setText = function (text) {
      _text = text;
      _$textNode.text(text);
    };

    /**
     * Get the DOM node of this user as jquery object
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
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

    /**
     * Updates text with last time of activity
     */
    var updateText = function () {
      var diff = Math.floor(new Date() - that.getLastActivityDate());
      var secs = Math.floor(diff / 10000) * 10;
      var mins = Math.floor(secs / 60);
      var hours = Math.floor(mins / 60);
      var days = Math.floor(hours / 24);
      if (secs < 60) {
        setText("last seen: " + secs + "s ago");
      } else if (mins < 60) {
        setText("last seen: " + mins + "m ago");
      } else if (hours < 24) {
        setText("last seen: " + hours + "h ago");
      } else {
        setText(days + "d ago");
      }
    };

    updateText();
    setInterval(updateText, 10000);
  }
}

export default User;
