define([
    'lodash',
    'iwcw',
    'operations/non_ot/ToolSelectOperation'
],/** @lends Palette */function(_,IWCW,ToolSelectOperation) {

    /**
     * Palette
     * @class palette_widget.Palette
     * @memberof palette_widget
     * @constructor
     */
    function Palette($palette,$info){
        var that = this;

        /**
         * Tools added to palette
         * @type {Object}
         * @private
         */
        var _tools = {};

        /**
         * Separators added to palette
         * @type {Object}
         * @private
         */
        var _separators = [];

        /**
         * Tool currently selected
         * @type String
         * @private
         */
        var _currentToolName = null;

        /**
         * Inter widget communication wrapper
         * @type {Object}
         * @private
         */
        var _iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.PALETTE);

        /**
         * Apply a tool selection
         * @param {String} name
         */
        var processToolSelection = function(name){
            var tool;
            if(_tools.hasOwnProperty(name)){
                if(_currentToolName) {
                    _tools[_currentToolName].unselect();
                    $info.text("");
                }
                tool = _tools[name];
                tool.select();
                $info.text(tool.getDescription());
                _currentToolName = name;
            }
        };

        /**
         * Callback for a local Tool Select Operation
         * @param {operations.non_ot.ToolSelectOperation} operation
         */
        var toolSelectionCallback = function (operation) {
            if (operation instanceof ToolSelectOperation) {
                processToolSelection(operation.getSelectedToolName());
            }
        };

        /**
         * Add tool tool to palette
         * @param {palette_widget.AbstractTool} tool
         */
        this.addTool = function(tool){
            var name = tool.getName();
            var $node;
            if(!_tools.hasOwnProperty(name)){
                _tools[name] = tool;
                $node = tool.get$node();
                $node.on("mousedown",function(ev){
                    if (ev.which != 1) return;
                    that.selectTool(name);
                });
                $palette.append($node);
            }
        };

        /**
         * Add separator to palette
         * @param {palette_widget.Separator} separator
         */
        this.addSeparator = function(separator){
            if(!_.contains(_separators,separator)){
                _separators.push(separator);
                $palette.append(separator.get$node());
            }
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get tool by name
         * @param {string} name
         * @returns {palette_widget.AbstractTool}
         */
        this.getTool = function(name){
            if(_tools.hasOwnProperty(name)){
                return _tools[name];
            }
            return null;
        };

        /**
         * Select tool by name
         * @param {string} name
         */
        this.selectTool = function(name){
            if(_tools.hasOwnProperty(name)){
                processToolSelection(name);
                var operation = new ToolSelectOperation(name);
                _iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.toNonOTOperation());
            }
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get currently selected tool
         * @returns {palette_widget.AbstractTool}
         */
        this.getCurrentToolName = function(){
            return _currentToolName;
        };

        /**
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function(){
            _iwc.registerOnDataReceivedCallback(toolSelectionCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function(){
            _iwc.unregisterOnDataReceivedCallback(toolSelectionCallback);
        };

        if(_iwc){
            this.registerCallbacks();
        }
    }

    return Palette;

});
