define([
    'operations/non_ot/NonOTOperation'
],/** @lends JoinOperation */function(NonOTOperation) {

    JoinOperation.TYPE = "JoinOperation";

    /**
     * JoinOperation
     * @class operations.non_ot.JoinOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} user jabberId of joining user
     * @param {string} done Flag if join has finished
     * @param {string} sender jabberId of user sending the message
     * @param {object} data JSON representation of graph instance
     */
    function JoinOperation(user,done,sender,data){
        /**
         * jabberId of joining user
         * @type {string}
         */
        var _user = user;

        /**
         * Flag if join has finished
         * @type {string}
         */
        var _done = done;

        /**
         * jabberId of user sending the message
         * @type {string}
         * @private
         */
        var _sender = sender;

        /**
         * JSON representation of graph instance
         * @type {object}
         */
        var _data = data;

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var nonOTOperation = null;

        /**
         * Get jabberId of joining user
         * @returns {string}
         */
        this.getUser = function(){
            return _user;
        };

        /**
         * Get flag if join has finished
         * @returns {string}
         */
        this.isDone = function(){
            return _done;
        };

        /**
         * Get jabberId of user sending the message
         * @returns {string}
         */
        this.getSender = function(){
            return _sender;
        };

        /**
         * Get JSON representation of graph instance
         * @returns {Object}
         */
        this.getData = function(){
            return _data;
        };

        /**
         * Set JSON representation of graph instance
         * @param {Object} data
         */
        this.setData = function(data){
            _data = data;
        };

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(nonOTOperation === null){
                nonOTOperation = new NonOTOperation(
                    JoinOperation.TYPE,
                    JSON.stringify({user: _user, done: _done, sender: _sender, data: _data})
                );
            }
            return nonOTOperation;
        };
    }

    JoinOperation.prototype.toJSON = function(){
        return {user: this.getUser(), done : this.isDone(), sender:this.getSender()};
    };

    return JoinOperation;

});