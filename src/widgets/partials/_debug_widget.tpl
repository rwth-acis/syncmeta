<script type="application/javascript">
    requirejs(['jqueryui','lodash'],function($,_){
        $(function(){		
            var $deleteMetamodel = $("#delete-meta-model").prop('disabled', true),
                $exportMetamodel = $("#export-meta-model").prop('disabled', true),
                $importMetamodel = $("#import-meta-model"),
                $deleteModel = $("#delete-model").prop('disabled', true),
                $exportModel = $("#export-model").prop('disabled', true),
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
                });
            });

            $deleteMetamodel.click(function(){
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
                });
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
                getData(CONFIG.NS.MY.MODEL).then(function(modelUris){
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

            $exportMetamodel.click(function(){
                getData(CONFIG.NS.MY.METAMODEL).then(function(modelUris){
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
                    if(modelUris.length > 0){
                        _.map(modelUris,function(uri){
                            openapp.resource.del(uri);
                        });
                    }
                    getFileContent().then(function(data){
                        resourceSpace.create({
                            relation: openapp.ns.role + "data",
                            type: CONFIG.NS.MY.MODEL,
                            representation: data,
                            callback: function(){
                                $exportModel.prop('disabled', false);
                                $deleteModel.prop('disabled', false);
                                feedback("Done!");
                            }
                        });
                    });
                });
            });

            $importMetamodel.click(function(){
                getData(CONFIG.NS.MY.METAMODEL).then(function(modelUris){
                    if(modelUris.length > 0){
                        _.map(modelUris,function(uri){
                            openapp.resource.del(uri);
                        });
                    }
                    getFileContent().then(function(data){
                        resourceSpace.create({
                            relation: openapp.ns.role + "data",
                            type: CONFIG.NS.MY.METAMODEL,
                            representation: data,
                            callback: function(){
                                $exportModel.prop('disabled', false);
                                $deleteModel.prop('disabled', false);
                                feedback("Done!");
                            }
                        });
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
			
            checkExistence();
            setInterval(checkExistence,10000);

        });
    });
</script>

<style>
    textarea, button {
        width: 100px;
    }
	 .seperating_box {
        border: 1px solid;
        border-radius: 7px; 
        margin: 18px 20px 7px 7px;
        padding: 7px 20px 7px 7px;
        position: relative;
    }
	.seperating_box > h5 {
        font-weight: normal;
        font-style: italic;
        position: absolute;
        top: -40px;
        left: 4px;
    }
	.hint {
		font-size: 10;
	}
</style>

<div class="seperating_box">
<h5> Select a JSON file </h5>
<input type="file" id="file-object" value="Load a file" />
</div>

<div id="modelDiv" class="seperating_box">
<h5> Import/Export/Delete a <strong>(Meta-)Model</strong> </h5>
<button id="import-model" title="Import a model to the canvas">Import</button>
<button id="export-model" title="export the model as JSON">Export</button>
<button id="delete-model" title="delete the model">Delete</button>
</div>

<div id="vlsDiv" class="seperating_box">
<h5> Import/Export/Delete a <strong>VLS</strong> (Model Editor only) </h5>
<button id="import-meta-model" title="Refresh the role space to apply the new VLS.">Import</button>
<button id="export-meta-model" title="Download the VLS as JSON">Export </button>
<button id="delete-meta-model" title="Refresh the role space.">Delete</button>
<button id="import-guidance-model">Import Guidancemodel</button>
<button id="export-guidance-model">Export Guidancemodel</button>
<button id="delete-guidance-model">Delete Guidancemodel</button>
</div>
<p class="hint">After import or delete refresh the canvas widget to apply the new model. After deleting and importing a new VLS refresh the whole role space.</p>
<p id="feedback"></p>