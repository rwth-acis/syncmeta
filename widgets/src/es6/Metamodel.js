import $ from 'jqueryui';

    var resourceSpace = new openapp.oo.Resource(openapp.param.space());

    /**
     * Metamodel
     * @name Metamodel
     */
    function Metamodel(){
        var deferred = $.Deferred();
        //noinspection JSUnusedGlobalSymbols
        resourceSpace.getSubResources({
            relation: openapp.ns.role + "data",
            type: CONFIG.NS.MY.METAMODEL,
            onAll: function(data) {
                if(data === null || data.length === 0){
                    deferred.resolve([]);
                } else {
                    data[0].getRepresentation("rdfjson",function(representation){
                        if(!representation){
                            deferred.resolve([]);
                        } else {
                            deferred.resolve(representation);
                        }
                    });
                }
            }
        });
        return deferred.promise();
    }

    export default Metamodel();
