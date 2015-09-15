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
         * consists of the view identifier as key and the openapp.oo.Resource object as value
         * @type {object}
         * @private
         */
        var _viewResourceDictionary = {};

        /**
         * consists of the viewpoint identifier as key and the viewpoint identifier as value
         * @type {object}
         * @private
         */
        var _viewViewpointDictionary={};

        /**
         * consists of the viewpoint id as value and the openapp.oo.Resource object as value
         * @type {object}
         * @private
         */
        var _viewpointResourceDictionary={};

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
                var that = this;
                var resourceSpace = new openapp.oo.Resource(openapp.param.space());
                var $selection = $('#ddmViewpointSelection');
                resourceSpace.getSubResources({
                    relation: openapp.ns.role + "data",
                    type: CONFIG.NS.MY.VIEWPOINT,
                    onEach: function (context) {
                        context.getRepresentation("rdfjson", function (rep) {
                            var $option = $(optionTpl({
                                id: rep.id
                            }));
                            //$option.attr('link', context.uri);
                            _viewpointResourceDictionary[rep.id] = context;
                            if(that.getViewResource(rep.id) === null)
                                that.addView(rep.id, rep.id, null);
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
             * returns the viewpoint role space resource object for a identifier of a view
             * @param viewId the identifier of the view
             * @returns {object} the resource object
             */
            getViewpointResourceFromViewId:function(viewId){
                if(_viewViewpointDictionary.hasOwnProperty(viewId)){
                    var viewpointId = _viewViewpointDictionary[viewId];
                    if(_viewpointResourceDictionary.hasOwnProperty(viewpointId)){
                        return _viewpointResourceDictionary[viewpointId];
                    }
                }
                return null;
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
             * returns the view role space resource object for a identifier of a view
             * @param viewId the identifier of the view
             * @returns {object} the resource object
             */
            getViewResource:function(viewId){
                return _viewResourceDictionary.hasOwnProperty(viewId)? _viewResourceDictionary[viewId] : null;
            },

            /**
             * the data for a specific view
             * @param viewId the identifier of the view
             * @returns {*} a jquery promise object
             */
            getViewData:function(viewId){
                var deferred = $.Deferred();
                this.getViewResource(viewId).getRepresentation('rdfjson', function(viewData){
                    deferred.resolve(viewData);
                });
                return deferred.promise();
            },
            /**
             * gets the identifier of a viewpoint for a viewId
             * @param {string} viewId the viewpoint identifier
             * @returns {string} the uri of the resource in the role space
             */
            getViewpointId : function(viewId){
                return _viewViewpointDictionary.hasOwnProperty(viewId)? _viewViewpointDictionary[viewId] : null;
            },

            /**
             * returns the viewpoint resource object for a viewpoint id
             * @param viewpointId
             * @returns {object} the openapp.oo.resource object
             */
            getViewpointResource:function(viewpointId){
                return _viewpointResourceDictionary.hasOwnProperty(viewpointId) ? _viewpointResourceDictionary[viewpointId] : null;
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
             * @param {string} viewpointId the viewpoint identifier which is used to generate the view. for the meta model editor this is null
             * @param {object} resource the openapp.oo.resource object
             */
            addView : function(viewId, viewpointId, resource){
                if(!_viewResourceDictionary.hasOwnProperty(viewId)){
                    _viewResourceDictionary[viewId] = resource;
                    _viewViewpointDictionary[viewId] = viewpointId;
                    var $option = $(optionTpl({
                        id: viewId
                    }));
                    _$selection.append($option);
                    return true;
                }
                else return false;
            },
            updateView: function(viewId, viewpointId, resource){
                if(_viewResourceDictionary.hasOwnProperty(viewId)){
                    _viewResourceDictionary[viewId] = resource;
                    _viewViewpointDictionary[viewId] = viewpointId;
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
                            var successful = that.addView(data.id, data.viewpoint, context);
                            if(!successful)
                                that.updateView(data.id, data.viewpoint, context)
                        });
                    }
                });
            },
            /**
             * Stores current view in the ROLE Space
             * @param {string} viewId the identifier for the view
             * @param {string} viewpointId Id of the viewpoint
             * @returns {object} jquery promise
             */
            storeView : function (viewId) {
                var resourceSpace = new openapp.oo.Resource(openapp.param.space());
                var deferred = $.Deferred();
                var data = this.viewToJSON(viewId);
                resourceSpace.create({
                    relation : openapp.ns.role + "data",
                    type : CONFIG.NS.MY.VIEW,
                    representation : data,
                    callback : function (resource) {
                        deferred.resolve(resource);
                    }
                });
                return deferred.promise();
            },
            /**
             * Update a view representation in the ROLE Space
             * @param {string} viewId The view identifier
             * @param {string} viewId The Identifier of the view
             * @param {object} resource openapp.oo.resource of the the view
             * @returns {object} jquery promise
             */
            updateViewContent:function(viewId, resource){
                var deferred = $.Deferred();
                var data = this.viewToJSON(viewId);
                resource.setRepresentation(data, 'application/json', function(){
                    deferred.resolve();
                });
                return deferred.promise();
            },
            /**
             * generates the json representation of a view
             * @param viewId the unique name of the view
             * @param viewpointId the unique name of the viewpoint
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