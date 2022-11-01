import $ from 'jqueryui';

    var resourceSpace = new openapp.oo.Resource(openapp.param.space());

    /**
     * Model
     * @name Model
     */
    function SpaceInfo(){
        var deferred = $.Deferred();
        resourceSpace.getInfo(function(info){
            deferred.resolve(info);
        });
        return deferred.promise();
    }

    export default SpaceInfo();
