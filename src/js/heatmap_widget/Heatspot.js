define([
    'lodash',
    'text!templates/heatmap_widget/heatspot.html',
    'classjs'
],function(_, heatspotHtml) {

    var Heatspot = Class.extend({
        init: function(x, y, width, height, color){
            this.$node = $(_.template(heatspotHtml, {"color": color}));
            this.opacity = 1;
            this.$node.css({
                top: y,
                left: x,
                width: width,
                height: height
            });

            var that = this;

            this.interval = setInterval(function(){
                that.opacity -= 0.01;
                that.$node.css("opacity", that.opacity);
                if(that.opacity <= 0){
                    clearInterval(that.interval)
                    that.remove();
                }
            }, 1000)
        },
        get$node: function(){
            return this.$node;
        },
        remove: function(){
            this.$node.remove();
        }
       
    });

    return Heatspot;

});
