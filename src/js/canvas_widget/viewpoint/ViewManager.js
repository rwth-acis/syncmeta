define([
    'jqueryui',
    'lodash',
    'canvas_widget/EntityManager',
    'text!templates/canvas_widget/select_option.html'
], /**@lends ViewManager*/function($,_, EntityManager, optionHtml){

    /**
     * the view manager manges a arbitrary number of views
     * @returns {{GetViewpointList: Function, existsView: Function, getViewIdOfSelected: Function, getViewUri: Function, getViewpointUri: Function, getSelected$node: Function, getResource: Function, addView: Function, deleteView: Function, initViewList: Function}}
     * @constructor
     */
    function ViewManager(){

        /**
         * represent a reference to the view selection html element
         * @type {jQuery}
         * @private
         */
        var _$selection = $('#ddmViewSelection');

        /**
         * html option element template
         * @type {function}
         */
        var optionTpl = _.template(optionHtml);

        return {
            /**
             * initialize the viewpoint selection list of the generic editor instance
             */
            GetViewpointList : function() {
                _$selection.empty();
                var viewpointList = y.share.views.keys();
                for(var i=0;i<viewpointList.length;i++) {
                    var viewpoint = y.share.views.get(viewpointList[i]);
                    if(viewpoint) {
                        _$selection.append($(optionTpl({
                            id: viewpointList[i]
                        })));
                    }
                    else
                        y.share.views.delete(viewpointList[i]);
                }
            },
            /**
             * checks if a view exists
             * @param viewId the viewId of the vie
             * @returns {boolean} true if the view already exits false if not
             */
            existsView : function(viewId) {
                return y.share.views.keys().indexOf(viewId) != -1;
            },
            /**
             * returns the view identifier of  currently selected html selection element
             * @returns {string} the identifier of the view
             */
            getViewIdOfSelected : function(){
                return this.getSelected$node().attr('id');
            },       
            /**
             * returns the currently selected option node of the html selection element
             * @returns {object} jquery object
             */
            getSelected$node : function(){
                return  _$selection.find('option:selected');
            },
            /**
             * adds a view to the ViewManager
             * @param {string} viewId the view identifier
             */
            addView : function(viewId){
                if(y.share.views.keys().indexOf(viewId) == -1) {
                    y.share.views.set(viewId, {viewId:viewId, attributes:{}, nodes:{}, edges:{}});
                    return true;
                }
                else return false;
            },
            /**
             * deletes a view from the view manager
             * @param {string} viewId the identifier of the view
             */
            deleteView: function(viewId){
                y.share.views.delete(viewId);
                _$selection.find('#'+viewId).remove();
            },
            /**
             * Update a view representation in the ROLE Space
             * @param {string} viewId The view identifier
             * @param {string} viewId The Identifier of the view
             * @param {object} resource openapp.oo.resource of the the view
             * @returns {object} jquery promise
             */
            updateViewContent:function(viewId){
                var data = this.viewToJSON(viewId);
                y.share.views.set(viewId,data);
            },
            /**
             * generates the json representation of a view
             * @param viewId the unique name of the view
             * @returns {Object}
             */
            viewToJSON : function (viewId) {
                var vls = EntityManager.graphToJSON();
                vls['id'] = viewId;
                return vls;
            }
        }
    }
    return new ViewManager();
});