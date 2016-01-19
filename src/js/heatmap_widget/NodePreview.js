define([
    'lodash',
    'text!templates/heatmap_widget/heatspot.html',
    'classjs'
],function(_, heatspotHtml) {

    return Class.extend({
        init: function(id, x, y, width, height, scaleFactor, color){
            this.$node = $(heatspotHtml);
            this.originalX = x;
            this.originalY = y;
            this.originalWidth = width;
            this.originalHeight = height;
            this.scaleFactor = scaleFactor;
            this.draw();

            this.$node.addClass(id);

            if(color){

                this.setColor(color);
            }

            //var that = this;

            // this.interval = setInterval(function(){
            //     that.opacity -= 0.01;
            //     that.$node.css("opacity", that.opacity);
            //     if(that.opacity <= 0){
            //         clearInterval(that.interval)
            //         that.remove();
            //     }
            // }, 1000)
        },
        get$node: function(){
            return this.$node;
        },
        remove: function(){
            this.$node.remove();
        },
        moveX: function(x){
            this.originalX += x;
            this.draw();
        },
        moveY: function(y){
            this.originalY += y;
            this.draw();
        },
        changeWidth: function(offsetWidth){
            this.originalWidth += offsetWidth;
            this.draw();
        },
        changeHeight: function(offsetHeight){
            this.originalHeight += offsetHeight;
            this.draw();
        },
        setScaleFactor: function(scaleFactor){
            this.scaleFactor = scaleFactor;
            this.draw();
        },
        draw: function(){
            this.$node.css({
                top: this.originalY * this.scaleFactor,
                left: this.originalX * this.scaleFactor,
                width: this.originalWidth * this.scaleFactor,
                height: this.originalHeight * this.scaleFactor
            });
        },
        setColor: function(color){
            this.$node.find(".background").css({
                opacity: 1,
                "background-color": color
            });
        },
        resetColor: function(){
            this.$node.find(".background").css({
                opacity: 0
            });
        }
       
    });
});
