define([
    'jqueryui',
    'lodash',
    'text!templates/palette_widget/separator.html'
],/** @lends Separator */function ($,_,separatorHtml) {

    /**
     * Separator
     * @class palette_widget.Separator
     * @memberof palette_widget
     * @constructor
     */
    function Separator(){
        var $node = $(_.template(separatorHtml,{}));
        this.get$node = function(){
            return $node;
        };
    }

    return Separator;

});