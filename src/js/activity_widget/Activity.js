define([
    'jqueryui',
    'lodash',
    'Util',
    //'promise!Space',
    'text!templates/activity_widget/activity_box.html'
],/** @lends Activity */function($,_,Util/*,space*/,activityBoxHtml) {

    /**
     * An abstract user activity issued by one of the users
     * @class activity_widget.Activity
     * @memberof activity_widget
     * @constructor
     * @param {string} entityId Entity id of the entity the activity works on
     * @param {string} sender JabberId of the user who issued this activity
     * @param {string} text Text of this activity which is displayed in the activity widget
     */
    function Activity(entityId,sender,text){

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
        var _timestamp = Date.now();

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
            var d = new Date(_timestamp);
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var year = d.getFullYear();
            var month = months[d.getMonth()];
            var date = d.getDate();
            var hour = d.getHours();
            var min = d.getMinutes();
            var sec = d.getSeconds();
            var dateTime = date + '.' + month + '.' + year + '/' + hour + ':' + min + ':' + sec;
            return dateTime;
        }

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
        if (_sender)
            _$node = $(_activityBoxTemplate({
                heading: y.share.userList.get(_sender) ? y.share.userList.get(_sender)[CONFIG.NS.PERSON.TITLE] : "",
                text: _text,
                color: y.share.userList.get(_sender) ? Util.getColor(y.share.userList.get(_sender).globalId) : "#000000",
                timestamp: getDateTimeAsString()
            })).hide();
        else
            _$node = $(_activityBoxTemplate({
                heading: "",
                text: "",
                color: "#000000",
                timestamp: getDateTimeAsString()

            })).hide();




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
        this.getEntityId = function(){
            return _entityId;
        };

        /**
         * Get JabberId of the user who issued this activity
         * @returns {string}
         */
        this.getSender = function(){
            return _sender;
        };

        /**
         * Get the timestamp of the activity
         */
        this.getTimestampe = function(){
            return _timestamp;
        }

        /**
         * Get the text of this activity which is displayed in the activity widget
         * @returns {string}
         */
        this.getText = function(){
            return _text;
        };

        /**
         * Set the text of this activity which is displayed in the activity widget
         * @param {string} text
         */
        this.setText = function(text){
            _text = text;
            _$textNode.text(text);
        };

        /**
         * Get the DOM node of this activity as jquery object
         * @returns {jQuery}
         */
        this.get$node = function(){
            return _$node;
        };

        /**
         * Hide the DOM node of this attribute
         */
        this.hide = function(){
            this.get$node().hide();
        };

        /**
         * Show the DOM node of this attribute
         */
        this.show = function(){
            this.get$node().show();
        };

        /**
         * activity to JSON
         */
        this._toJSON = function(){
            return {
                entityId: entityId,
                sender: sender,
                text: text,
                timestamp:_timestamp
            }
        }

    }
    /**
     * activity to JSON
     */
    Activity.prototype.toJSON = function(){
        return this._toJSON();
    }

    return Activity;

});
