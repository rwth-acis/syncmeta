import $ from 'jqueryui';
import _ from 'lodash';
import Util from 'Util';
import userBoxHtml from 'text!templates/activity_widget/user_box.html';

    /**
     * A user working on the model
     * @class activity_widget.User
     * @memberof activity_widget
     * @constructor
     * @param {string} jabberId JabberId of the user
     * @param {Date} lastActivityDate Date of the user's last activity
     */
    function User(jabberId, lastActivityDate) {
        var that = this;

        /**
         * Entity id of the entity this user works on
         * @type {string}
         * @private
         */
        var _entityId = jabberId;

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

        /**
         * jQuery object of DOM node representing the user
         * @type {jQuery}
         * @private
         */
        const userList = y.getMap("userList");
        var _$node = $(
          _userBoxTemplate({
            heading: userList.get(jabberId)
              ? userList.get(jabberId)[CONFIG.NS.PERSON.TITLE]
              : "",
            text: "",
            color: userList.get(jabberId)
              ? Util.getColor(userList.get(jabberId).globalId)
              : "#000000",
            view: "",
          })
        ).hide();


        /**
         * jQuery object of DOM node representing the user text
         * @type {jQuery}
         * @private
         */
        var _$textNode = _$node.find(".text");

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get the entity id of the entity this user works onActivity
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
            var diff = Math.floor((new Date() - that.getLastActivityDate()));
            var secs = Math.floor(diff / 10000) * 10;
            var mins = Math.floor(secs / 60);
            var hours = Math.floor(mins / 60);
            var days = Math.floor(hours / 24);
            if (secs < 60) {
                setText(secs + "s");
            } else if (mins < 60) {
                setText(mins + "m");
            } else if (hours < 24) {
                setText(hours + "h");
            } else {
                setText(days + "d");
            }
        };

        updateText();
        setInterval(updateText, 10000);

    }

    export default User;


