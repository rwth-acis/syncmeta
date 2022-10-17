import $ from 'jqueryui';
import jsPlumb from 'jsplumb';
import AbstractCanvasTool from 'canvas_widget/AbstractCanvasTool';
import EntityManager from 'canvas_widget/EntityManager';

    NodeTool.prototype = new AbstractCanvasTool();
    NodeTool.prototype.constructor = NodeTool;
    /**
     * NodeTool
     * @class canvas_widget.NodeTool
     * @extends canvas_widget.AbstractCanvasTool
     * @memberof canvas_widget
     * @constructor
     */
    function NodeTool(name,className,description,containment,defaultWidth,defaultHeight){
        AbstractCanvasTool.call(
            this,
            name,
            className||"tool-node",
            description||"Add a node"
        );

        var _defaultWidth = defaultWidth||100,
            _defaultHeight = defaultHeight||50;

        /**
         * Mount the tool on canvas
         */
        this.mount = function(defaultLabel, defaultAttributeValues){
            var $canvas = this.getCanvas().get$canvas();
            var that = this;
            AbstractCanvasTool.prototype.mount.call(this);

            //Enable Node Addition
            $canvas.on("mouseup.nodeadd",function(ev){
                var offsetClick,
                    offsetCanvas;

                if (ev.which != 1) return;

                offsetCanvas = $canvas.offset();
                var zoom = that.getCanvas().getZoom();
                var nodeX = (ev.pageX - offsetCanvas.left) / zoom - _defaultWidth / 2;
                var nodeY = (ev.pageY - offsetCanvas.top) / zoom - _defaultHeight / 2;

                //if(this == ev.target){
                    that.getCanvas().createNode(that.getName(),nodeX,nodeY,_defaultWidth,_defaultHeight, null, containment, null, null, null, defaultLabel, defaultAttributeValues);
                    //that.canvas.callListeners(CONFIG.CANVAS.LISTENERS.NODEADD,that.name,ev.originalEvent.offsetX,ev.originalEvent.offsetY,_defaultWidth,_defaultHeight);
                //}
                that.getCanvas().resetTool();
            });

            $canvas.bind("contextmenu", function(ev){
                if(ev.target == this){
                    ev.preventDefault();
                    that.getCanvas().resetTool();
                    return false;
                }
                return true;
            });

            $canvas.find(".node")
                .bind("contextmenu", function(ev){
                ev.preventDefault();
                that.getCanvas().resetTool();
                that.getCanvas().select(EntityManager.findNode($(this).attr("id")));
                return false;
            });
        };

        /**
         * Unmount the tool from canvas
         */
        this.unmount = function(){
            var $canvas = this.getCanvas().get$canvas();
            AbstractCanvasTool.prototype.unmount.call(this);

            //Disable Node Addition
            $canvas.off("mouseup.nodeadd");

            $canvas.unbind("contextmenu");
            $canvas.find(".node").unbind("contextmenu");
        };

    }

    export default NodeTool;


