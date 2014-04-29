<script type="application/javascript">
    requirejs(['jqueryui','lodash'],function($,_){
        $(function(){
            var $list = $("#list"),
            //$reload = $("#reload"),
                    templateString = '<li><a href="<<= url >>" target="_blank"><<= title >></a></li>'.replace(/<</g,"<"+"%").replace(/>>/g,"%"+">"),
                    template = _.template(templateString),

                    getInstances = function(){

                        $list.empty();
                        openapp.resource.get("<%= grunt.config('roleSandboxUrl') %>/spaces",function(spaces){
                            var promises = [],
                                    list = [],
                                    spaceUri,
                                    deferred;

                            for(spaceUri in spaces.data){
                                if(spaces.data.hasOwnProperty(spaceUri)){
                                    deferred = $.Deferred();
                                    openapp.resource.get(spaceUri,(function(deferred){
                                        return function(space){

                                            var resourceUri, resourceObj, values;
                                            for(resourceUri in space.data){
                                                if(space.data.hasOwnProperty(resourceUri)){
                                                    resourceObj = space.data[resourceUri];
                                                    if(resourceObj['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'] &&
                                                            _.isArray(resourceObj['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'])){
                                                        values = _.map(resourceObj['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],function(e){
                                                            return e.value;
                                                        });
                                                        if(_.contains(values,"http://purl.org/role/terms/Data") && _.contains(values,CONFIG.NS.MY.METAMODEL)){
                                                            list.push({url: space.uri, title: spaces.data[space.uri]['http://purl.org/dc/terms/title'][0].value});
                                                        }
                                                    }

                                                }
                                            }
                                            deferred.resolve();
                                        };

                                    })(deferred));
                                    promises.push(deferred.promise());
                                }
                            }
                            $.when.apply($,promises).then(function(){
                                _.map(_.sortBy(list,function(e){return e.title.toLowerCase();}),function(e){
                                    $list.append(template({url: e.url, title: e.title}));
                                })
                            })
                        })
                    };

            //$reload.click(getInstances);

            getInstances();
        });
    });
</script>
<style>
    #list {
        list-style: none;
        padding: 0;
        margin: 0;
        overflow-y: scroll;
        height: 100%;
    }
    a, a:visited, a:hover, a:focus {
        color: #333333;
        white-space: nowrap;
    }
</style>
<!--<button id="reload">Reload</button>-->
<ul id="list"></ul>