requirejs(['jqueryui','lodash','lib/yjs-sync'],function($,_,yjsSync){
    $(function(){
        yjsSync().done(function(y){
            window.y = y;
            console.info('DEBUG: Yjs successfully initialized');

            var $deleteMetamodel = $("#delete-meta-model").prop('disabled', false),
                $exportMetamodel = $("#export-meta-model").prop('disabled', false),
                $importMetamodel = $("#import-meta-model"),
                $deleteModel = $("#delete-model").prop('disabled', false),
                $exportModel = $("#export-model").prop('disabled', false),
                $importModel = $("#import-model"),
                $deleteGuidancemodel = $("#delete-guidance-model").prop('disabled', true),
                $exportGuidancemodel = $("#export-guidance-model").prop('disabled', true),
                $importGuidancemodel = $("#import-guidance-model"),
                $fileObject = $("#file-object"),
                $feedback = $("#feedback"),
                feedbackTimeout,

                feedback = function(msg){
                    $feedback.text(msg);
                    clearTimeout(feedbackTimeout);
                    feedbackTimeout = setTimeout(function(){
                        $feedback.text("");
                    },2000);
                },

                resourceSpace = new openapp.oo.Resource(openapp.param.space());

            var getFileContent = function(){
                var fileReader,
                    files = $fileObject[0].files,
                    file,
                    deferred = $.Deferred();

                if (!files || files.length === 0) deferred.resolve([]);
                file = files[0];

                fileReader = new FileReader();
                fileReader.onload = function (e) {
                    var data = e.target.result;
                    try {
                        data = JSON.parse(data);
                    } catch (e){
                        data = [];
                    }
                    deferred.resolve(data);
                };
                fileReader.readAsText(file);
                return deferred.promise();
            };

            var getData = function(type){
                var spaceUri = openapp.param.space(),
                    listOfDataUris = [],

                    promises = [],
                    mainDeferred = $.Deferred(),
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

                                    if(_.contains(values,"http://purl.org/role/terms/Data") && _.contains(values,type)){
                                        listOfDataUris.push(resourceUri);
                                    }

                                }

                            }
                        }
                        deferred.resolve();
                    };

                })(deferred));
                promises.push(deferred.promise());

                $.when.apply($,promises).then(function(){
                    mainDeferred.resolve(listOfDataUris);
                });

                return mainDeferred.promise();
            };

            $deleteModel.click(function(){
                //y.share.data.delete('model');
                y.share.data.set('model', null);
                feedback("Done!");
                /*
                 getData(CONFIG.NS.MY.MODEL).then(function(modelUris){
                 if(modelUris.length > 0){
                 _.map(modelUris,function(uri){
                 openapp.resource.del(uri,function(){
                 feedback("Done!");
                 });
                 });
                 } else {
                 feedback("No Model!");
                 }
                 });*/
            });

            $deleteMetamodel.click(function(){
                //this does not work ??????
                //y.share.data.delete('metamodel');
                y.share.data.set('model', null);
                feedback("Done!");
                /*
                 getData(CONFIG.NS.MY.METAMODEL).then(function(modelUris){
                 if(modelUris.length > 0){
                 _.map(modelUris,function(uri){
                 openapp.resource.del(uri,function(){
                 $exportMetamodel.prop('disabled', true);
                 $deleteMetamodel.prop('disabled', true);
                 feedback("Done!");
                 });
                 });
                 } else {
                 feedback("No Model!");
                 }
                 });*/
            });

            $deleteGuidancemodel.click(function(){
                getData(CONFIG.NS.MY.GUIDANCEMODEL).then(function(modelUris){
                    if(modelUris.length > 0){
                        _.map(modelUris,function(uri){
                            openapp.resource.del(uri,function(){
                                $exportGuidancemodel.prop('disabled', true);
                                $deleteGuidancemodel.prop('disabled', true);
                                feedback("Done!");
                            });
                        });
                    } else {
                        feedback("No Model!");
                    }
                });
            });

            $exportModel.click(function(){
                var link = document.createElement('a');
                link.download = "model.json";
                link.href = 'data:,'+encodeURI(JSON.stringify(y.share.data.get('model'),null,4));
                link.click();
                /*getData(CONFIG.NS.MY.MODEL).then(function(modelUris){
                 if(modelUris.length > 0){
                 $.get(modelUris[0]+"/:representation").done(function(data){
                 var link = document.createElement('a');
                 link.download = "export.json";
                 link.href = 'data:,'+encodeURI(JSON.stringify(data,null,4));
                 link.click();
                 });
                 } else {
                 feedback("No Model!");
                 }
                 });*/
            });

            $exportMetamodel.click(function(){
                var link = document.createElement('a');
                link.download = "vls.json";
                link.href = 'data:,'+encodeURI(JSON.stringify(y.share.data.get('metamodel'),null,4));
                link.click();
                /*getData(CONFIG.NS.MY.METAMODEL).then(function(modelUris){
                 if(modelUris.length > 0){
                 $.get(modelUris[0]+"/:representation").done(function(data){
                 var link = document.createElement('a');
                 link.download = "export.json";
                 link.href = 'data:,'+encodeURI(JSON.stringify(data,null,4));
                 link.click();
                 });
                 } else {
                 feedback("No Model!");
                 }
                 });*/
            });

            $exportGuidancemodel.click(function(){
                getData(CONFIG.NS.MY.GUIDANCEMODEL).then(function(modelUris){
                    if(modelUris.length > 0){
                        $.get(modelUris[0]+"/:representation").done(function(data){
                            var link = document.createElement('a');
                            link.download = "export.json";
                            link.href = 'data:,'+encodeURI(JSON.stringify(data,null,4));
                            link.click();
                        });
                    } else {
                        feedback("No Model!");
                    }
                });
            });

            $importModel.click(function(){
                getData(CONFIG.NS.MY.MODEL).then(function(modelUris){
                    getFileContent().then(function(data){
                        y.share.data.set('model',data);
                        feedback("Done!");
                    });
                });
            });

            $importMetamodel.click(function(){
                getData(CONFIG.NS.MY.METAMODEL).then(function(modelUris){
                    getFileContent().then(function(data){
                        y.share.data.set('metamodel',data);
                        feedback("Done!");
                    });
                });
            });

            $importGuidancemodel.click(function(){
                getData(CONFIG.NS.MY.GUIDANCEMODEL).then(function(modelUris){
                    if(modelUris.length > 0){
                        _.map(modelUris,function(uri){
                            openapp.resource.del(uri);
                        });
                    }
                    getFileContent().then(function(data){
                        resourceSpace.create({
                            relation: openapp.ns.role + "data",
                            type: CONFIG.NS.MY.GUIDANCEMODEL,
                            representation: data,
                            callback: function(){
                                $exportGuidancemodel.prop('disabled', false);
                                $deleteGuidancemodel.prop('disabled', false);
                                feedback("Done!");
                            }
                        });
                    });
                });
            });

            var checkExistence = function(){
                getData(CONFIG.NS.MY.MODEL).then(function(modelUris){
                    if(modelUris.length === 0){
                        $exportModel.prop('disabled', true);
                        $deleteModel.prop('disabled', true);
                    } else {
                        $exportModel.prop('disabled', false);
                        $deleteModel.prop('disabled', false);
                    }
                });

                getData(CONFIG.NS.MY.METAMODEL).then(function(modelUris){
                    if(modelUris.length === 0){
                        $exportMetamodel.prop('disabled', true);
                        $deleteMetamodel.prop('disabled', true);
                    } else {
                        $exportMetamodel.prop('disabled', false);
                        $deleteMetamodel.prop('disabled', false);
                    }
                });

                getData(CONFIG.NS.MY.GUIDANCEMODEL).then(function(modelUris){
                    if(modelUris.length === 0){
                        console.log("No guidance model found!");
                        $exportGuidancemodel.prop('disabled', true);
                        $deleteGuidancemodel.prop('disabled', true);
                    } else {
                        console.log("Activate!");
                        $exportGuidancemodel.prop('disabled', false);
                        $deleteGuidancemodel.prop('disabled', false);
                    }
                });
            };

            //checkExistence();
            //setInterval(checkExistence,10000);
        });
    });
});
