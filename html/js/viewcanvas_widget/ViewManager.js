define([
    'jqueryui',
    'lodash',
    'text!templates/viewcanvas_widget/select_option.html'
], /**@lends ViewManager*/function($,_, optionHtml){

    /**
     * the view manager manges a arbitrary number of views
     * @returns {{GetViewpointList: Function, existsView: Function, getViewIdOfSelected: Function, getViewUri: Function, getViewpointUri: Function, getSelected$node: Function, getResource: Function, addView: Function, deleteView: Function, initViewList: Function}}
     * @constructor
     */
    function ViewManager(){
        /**
         * consists of the view identifier as key and the openapp.oo.Resource object as value
         * @type {object}
         * @private
         */
        var _viewResourceDictionary = {};

        /**
         * conisits of the viewpoint identifier as key and the viewpoint uri as value
         * @type {object}
         * @private
         */
        var _viewViewpointDictionary={};

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
                var resourceSpace = new openapp.oo.Resource(openapp.param.space());
                var $selection = $('#ddmViewpointSelection');
                resourceSpace.getSubResources({
                    relation: openapp.ns.role + "data",
                    type: CONFIG.NS.MY.VIEWPOINT,
                    onEach: function (context) {
                        context.getRepresentation("rdfjson", function (representation) {
                            var $option = $(optionTpl({
                                id: representation.id
                            }));
                            $option.attr('link', context.uri);
                            $selection.append($option);
                        });
                    }
                });
            },

            /**
             * checks if a view exists
              * @param viewId the viewId of the vie
             * @returns {boolean} true if the view already exits false if not
             */
            existsView : function(viewId) {
                return _viewResourceDictionary.hasOwnProperty(viewId);
            },

            /**
             * returns the view identifier of  currently selected html selection element
             * @returns {string} the identifier of the view
             */
            getViewIdOfSelected : function(){
                return this.getSelected$node().attr('id');
            },

            /**
             * gets the view uri for a viewId
             * @param viewId the view identifier of the view
             * @returns {string} the uri of the resource in the role space
             */
            getViewUri : function(viewId){
                return _viewResourceDictionary.hasOwnProperty(viewId)? _viewResourceDictionary[viewId].uri : null;
            },

            /**
             * gets the viewpoint uri for a viewId
             * @param {string} viewId the viewpoint identifier
             * @returns {string} the uri of the resource in the role space
             */
            getViewpointUri : function(viewId){
                return _viewViewpointDictionary.hasOwnProperty(viewId)? _viewViewpointDictionary[viewId] : null;
            },

            /**
             * returns the currently selected option node of the html selection element
             * @returns {object} jquery object
             */
            getSelected$node : function(){
                return  _$selection.find('option:selected');
            },

            /**
             * returns the openapp.oo.Resource object of the view
             * @param {string} viewId the view identifier
             * @returns {object}
             */
            getResource : function(viewId){
              if(_viewResourceDictionary.hasOwnProperty(viewId)){
                  return _viewResourceDictionary[viewId];
              }
            },

            /**
             * adds a view to the ViewManager
             * @param {string} viewId the view identifier
             * @param {string} viewUri pointing to the view in the role space
             * @param {string} viewpointUri the viewpoint uri which is used to generate the view. for the meta model editor this is null
             * @param {object} resource the openapp.oo.resource object
             */
            addView : function(viewId, viewUri,viewpointUri, resource){
                if(!_viewResourceDictionary.hasOwnProperty(viewId)){
                    _viewResourceDictionary[viewId] = resource;
                    _viewViewpointDictionary[viewId] = viewpointUri;
                    var $option = $(optionTpl({
                        id: viewId
                    }));
                    _$selection.append($option);
                }
            },

            /**
             * deletes a view from the view manager
             * @param {string} viewId the identifier of the view
             */
            deleteView: function(viewId){
                delete _viewResourceDictionary[viewId];
                delete _viewViewpointDictionary[viewId];
                _$selection.find('#'+viewId).remove();
            },

            /**
             * initializes the view manager and adds new views to to view manager
             */
            initViewList : function(){
                var that = this;
                var resourceSpace = new openapp.oo.Resource(openapp.param.space());
                resourceSpace.getSubResources({
                    relation: openapp.ns.role + "data",
                    type: CONFIG.NS.MY.VIEW,
                    onEach: function (context) {
                        context.getRepresentation("rdfjson", function (data) {
                            that.addView(data.id, context.uri, data.viewpoint, context);
                        });
                    }
                });
            }
        }
    }
    return new ViewManager();
});