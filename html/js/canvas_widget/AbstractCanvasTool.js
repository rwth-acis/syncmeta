define([],/** @lends AbstractCanvasTool */function () {

    var AbstractCanvasTool;

    //noinspection JSUnusedGlobalSymbols
    /**
     * AbstractCanvasTool
     * @class canvas_widget.AbstractCanvasTool
     * @memberof canvas_widget
     * @constructor
     * @param {string} [name] Name of tool
     * @param {string} [className] Class name assigned to canvas node when tool is mounted
     * @param {string} [description] Description of tool
     */
    AbstractCanvasTool = function(name,className,description){
        /**
         * Canvas that the tool is added to
         * @type {canvas_widget.AbstractCanvas}
         * @private
         */
        var _canvas = null;

        /**
         * Name of tool
         * @type {string}
         * @private
         */
        var _name = name||"AbstractTool";

        /**
         * Class name assigned to canvas node when tool is mounted
         * @type {string}
         * @private
         */
        var _className = className||"tool-abstract";

        /**
         * Description of tool
         * @type {string}
         * @private
         */
        var _description = description||"An abstract canvas tool";

        /**
         * Set canvas that the tool is added to
         * @param {canvas_widget.AbstractCanvas} canvas
         */
        this.setCanvas = function(canvas){
            _canvas = canvas;
        };

        /**
         * Get canvas that the tool is added to
         * @returns {canvas_widget.AbstractCanvas}
         */
        this.getCanvas = function(){
            return _canvas;
        };

        /**
         * Get name of tool
         * @returns {string}
         */
        this.getName = function(){
            return _name;
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get class name assigned to canvas node when tool is mounted
         * @returns {string}
         */
        this.getClassName = function(){
            return _className;
        };

        /**
         * Get description of tool
         * @returns {string}
         */
        this.getDescription = function(){
            return _description;
        };

        /**
         * Mount the tool on canvas
         * @private
         */
        this._mount = function(){
            _canvas.get$canvas().addClass(_className);
        };

        /**
         * Unmount the tool from canvas
         * @private
         */
        this._unmount = function(){
            _canvas.get$canvas().removeClass(_className);
        };
    };

    /**
     * Mount the tool on canvas
     */
    AbstractCanvasTool.prototype.mount = function(){
        this._mount();
    };

    /**
     * Unmount the tool from canvas
     */
    AbstractCanvasTool.prototype.unmount = function(){
        this._unmount();
    };

    return AbstractCanvasTool;

});
