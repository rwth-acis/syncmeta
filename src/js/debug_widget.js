requirejs(['jqueryui', 'lodash', 'lib/yjs-sync', 'canvas_widget/GenerateViewpointModel', 'canvas_widget/EntityManager','promise!Guidancemodel'],
 function ($, _, yjsSync, GenerateViewpointModel, EntityManager, guidance) {
    $(function () {
        yjsSync().done(function (y) {
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
                $activityExport = $('#export-activity-list').prop('disabled', false),
                $activityDelete = $('#delete-activity-list').prop('disabled', false),
                feedbackTimeout,

                feedback = function (msg) {
                    $feedback.text(msg);
                    clearTimeout(feedbackTimeout);
                    feedbackTimeout = setTimeout(function () {
                        $feedback.text("");
                    }, 2000);
                };

            var getFileContent = function () {
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
                    } catch (e) {
                        data = [];
                    }
                    deferred.resolve(data);
                };
                fileReader.readAsText(file);
                return deferred.promise();
            };

            $deleteModel.click(function () {
                $exportModel.prop('disabled', true);
                $deleteModel.prop('disabled', true);
                //y.share.data.delete('model');
                y.share.data.set('model', null);
                y.share.canvas.set('ReloadWidgetOperation', 'delete');

                feedback("Done!");

            });

            $deleteMetamodel.click(function () {
                $exportMetamodel.prop('disabled', true);
                $deleteMetamodel.prop('disabled', true);
                //this does not work ??????
                //y.share.data.delete('metamodel');
                y.share.data.set('metamodel', null);
                y.share.canvas.set('ReloadWidgetOperation', 'meta_delete');
                feedback("Done!");
            });

            $deleteGuidancemodel.click(function () {
                $exportGuidancemodel.prop('disabled', true);
                $deleteGuidancemodel.prop('disabled', true);
                y.share.data.set('guidancemodel', null);
                feedback("Done!");
            });

            $activityDelete.click(function(){
                y.share.activity.set('log', null);
                feedback("Done!");
            });

            $exportModel.click(function () {
                var link = document.createElement('a');
                link.download = "model.json";
                link.href = 'data:,' + encodeURI(JSON.stringify(y.share.data.get('model'), null, 4));
                link.click();
            });

            $exportMetamodel.click(function () {
                var link = document.createElement('a');
                link.download = "vls.json";
                link.href = 'data:,' + encodeURI(JSON.stringify(y.share.data.get('metamodel'), null, 4));
                link.click();
            });

            $exportGuidancemodel.click(function () {
                var link = document.createElement('a');
                link.download = "guidance_model.json";
                link.href = 'data:,' + encodeURI(JSON.stringify(y.share.data.get('guidancemodel'), null, 4));
                link.click();

            });

            $activityExport.click(function(){
                var link = document.createElement('a');
                link.download = "activityList.json";
                link.href = 'data:,' + encodeURI(JSON.stringify(y.share.activity.get('log'), null, 4));
                link.click();

            });

            $importModel.click(function () {
                getFileContent().then(function (data) {

                    var initAttributes = function(attrs, map){
                        if(attrs.hasOwnProperty('[attributes]')){
                            var attr = attrs['[attributes]'].list;
                            for(var key in attr){
                                if(attr.hasOwnProperty(key)){
                                    if(attr[key].hasOwnProperty('key')){
                                        var ytext = map.set(attr[key].key.id, Y.Text);
                                        ytext.insert(0, attr[key].key.value);
                                    }
                                    else { 
                                        var ytext = map.set(attr[key].value.id, Y.Text);
                                        ytext.insert(0, attr[key].value.value);
                                    }
                                }
                            }

                        }else{
                            for(var key in attrs){
                                if(attrs.hasOwnProperty(key)){
                                    var value = attrs[key].value;
                                    if(!value.hasOwnProperty('option')){
                                        if(value.value instanceof String){
                                            var ytext = map.set(value.id, Y.Text);
                                            ytext.insert(0, value.value);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(guidance.isGuidanceEditor())
                        y.share.data.set('guidancemodel', data);
                    else
                        y.share.data.set('model', data);
                    for(var key in data.nodes){
                        if (data.nodes.hasOwnProperty(key)) {
                            var entity = data.nodes[key];
                            var map = y.share.nodes.set(key, Y.Map);
                            var attrs = entity.attributes;
                            if(entity.hasOwnProperty('label')){
                                var ytext = map.set(entity.label.value.id, Y.Text);
                                ytext.insert(0, entity.label.value.value);
                            }
                            initAttributes(attrs, map);
                        }
                    }
                    for(var key in data.edges){
                        if (data.edges.hasOwnProperty(key)) {
                            var entity = data.edges[key];
                            var map = y.share.edges.set(key, Y.Map);
                            var attrs = entity.attributes;
                            if(entity.hasOwnProperty('label')){
                                var ytext = map.set(entity.label.value.id, Y.Text);
                                ytext.insert(0, entity.label.value.value);
                            }
                            initAttributes(attrs, map);
                        }
                    }
                    y.share.canvas.set('ReloadWidgetOperation', 'import');
                    feedback("Done!");
                });
            });

            $importMetamodel.click(function () {
                getFileContent().then(function (data) {
                    try {
                        var vls = GenerateViewpointModel(data);
                        //if everything is empty. Maybe it is already a VLS
                        if (_.keys(vls.nodes).length === 0 && _.keys(vls.edges).length === 0 && _.keys(vls.attributes).length === 0)
                            y.share.data.set('metamodel', data);
                        else y.share.data.set('metamodel', vls);
                        feedback("Done!");
                    }
                    catch (e) {
                        y.share.data.set('metamodel', data);
                        feedback("Done!");
                    }
                    y.share.canvas.set('ReloadWidgetOperation', 'meta_import');
                });
            });

            $importGuidancemodel.click(function () {
                getFileContent().then(function (data) {
                    $exportGuidancemodel.prop('disabled', false);
                    $deleteGuidancemodel.prop('disabled', false);
                    EntityManager.setGuidance(guidance);
                    y.share.data.set('guidancemodel', EntityManager.generateLogicalGuidanceRepresentation(data));
                    feedback("Done!");
                });
            });


            var checkExistence = function () {

                if (!y.share.data.get('model')) {
                    $exportModel.prop('disabled', true);
                    $deleteModel.prop('disabled', true);
                } else {
                    $exportModel.prop('disabled', false);
                    $deleteModel.prop('disabled', false);
                }


                if (!y.share.data.get('metamodel')) {
                    $exportMetamodel.prop('disabled', true);
                    $deleteMetamodel.prop('disabled', true);
                } else {
                    $exportMetamodel.prop('disabled', false);
                    $deleteMetamodel.prop('disabled', false);
                }

                if(!y.share.activity.get('log')){
                    $activityExport.prop('disabled', true);
                    $activityDelete.prop('disabled', true);
                }else{
                    $activityExport.prop('disabled', false);
                    $activityDelete.prop('disabled', false);
                }

                if (!y.share.data.get('guidancemodel')) {
                    console.log("No guidance model found!");
                    $exportGuidancemodel.prop('disabled', true);
                    $deleteGuidancemodel.prop('disabled', true);
                } else {
                    console.log("Activate!");
                    $exportGuidancemodel.prop('disabled', false);
                    $deleteGuidancemodel.prop('disabled', false);
                }

            };

            checkExistence();
            setInterval(checkExistence, 10000);
        });
    });
});
