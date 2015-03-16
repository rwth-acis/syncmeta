define([],/** @lends AbstractCanvas */function () {

    /**
     * AbstractCanvas
     * @class canvas_widget.AbstractCanvas
     * @memberof canvas_widget
     * @constructor
     * @param {jQuery} $node jQuery selector of canvas node
     */
    function AbstractCanvas($node){
        var that = this;

        /**
         * Tools added to canvas
         * @type {Object}
         * @private
         */
        var _tools = {};

        /**
         * Name of tool currently mounted
         * @type {string}
         * @private
         */
        var _currentToolName = null;

        /**
         * jQuery object of DOM node representing the canvas
         * @type {jQuery}
         * @private
         */
        var _$node = $node;

        /**
         * Get jQuery object of DOM node representing the canvas
         * @returns {jQuery} jQuery object of DOM node representing the canvas
         */
        this.get$canvas = function(){
            return _$node;
        };

        /**
         * Add tool to canvas
         * @param {string} name Name of tool
         * @param {canvas_widget.AbstractCanvasTool} tool Canvas tool
         */
        this.addTool = function(name,tool){
            if(!_tools.hasOwnProperty(name) && typeof tool.mount === 'function' && typeof tool.unmount === 'function' && typeof tool.setCanvas === 'function'){
                tool.setCanvas(this);
                _tools[name] = tool;
            }
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get tool added to canvas by its name
         * @param {string} name Name of tool
         * @returns {canvas_widget.AbstractCanvasTool} Canvas tool
         */
        this.getTool = function(name){
            if(_tools.hasOwnProperty(name)){
                return _tools[name];
            }
            return null;
        };

        /**
         * Mount a canvas tool previously added to the canvas
         * @param {string} name Name of tool
         */
        this.mountTool = function(name){
            if(_currentToolName && _tools[_currentToolName]) _tools[_currentToolName].unmount();
            if(_tools.hasOwnProperty(name)){
                _tools[name].mount();
            }
            _currentToolName = name;
        };

        /**
         * Unmount and mount currenty mounted tool again
         */
        this.remountCurrentTool = function(){
            that.mountTool(_currentToolName);
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get name of tool currently mounted
         * @returns {string}
         */
        this.getCurrentToolName = function(){
            return _currentToolName;
        };

        this.removeTools = function(){
            _tools = {};
        }
    }

    return AbstractCanvas;

});
