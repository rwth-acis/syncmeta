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
         * Activity box template
         * @type {function}
         * @private
         */
        var _activityBoxTemplate = _.template(activityBoxHtml);

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
        if(_sender)
            _$node = $(_activityBoxTemplate({
                heading: y.share.userList.get(_sender) ? y.share.userList.get(_sender)[CONFIG.NS.PERSON.TITLE] : "",
                text: _text,
                color: y.share.userList.get(_sender) ? Util.getColor(y.share.userList.get(_sender).globalId) : "#000000"
            })).hide();
        else
            _$node = $(_activityBoxTemplate({
                heading: "",
                text: "",
                color:"#000000"
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

    }

    return Activity;

});
