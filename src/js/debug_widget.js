requirejs(['jqueryui', 'lodash', 'lib/yjs-sync', 'canvas_widget/GenerateViewpointModel'], function($, _, yjsSync, GenerateViewpointModel) {
    $(function() {
        yjsSync().done(function(y) {
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

                feedback = function(msg) {
                    $feedback.text(msg);
                    clearTimeout(feedbackTimeout);
                    feedbackTimeout = setTimeout(function() {
                        $feedback.text("");
                    }, 2000);
                };

            var getFileContent = function() {
                var fileReader,
                    files = $fileObject[0].files,
                    file,
                    deferred = $.Deferred();

                if (!files || files.length === 0) deferred.resolve([]);
                file = files[0];

                fileReader = new FileReader();
                fileReader.onload = function(e) {
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

            $deleteModel.click(function() {
                $exportModel.prop('disabled', true);
                $deleteModel.prop('disabled', true);
                //y.share.data.delete('model');
                y.share.data.set('model', null);
                feedback("Done!");

            });

            $deleteMetamodel.click(function() {
                $exportMetamodel.prop('disabled', true);
                $deleteMetamodel.prop('disabled', true);
                //this does not work ??????
                //y.share.data.delete('metamodel');
                y.share.data.set('metamodel', null);
                feedback("Done!");
            });

            $deleteGuidancemodel.click(function() {
                $exportGuidancemodel.prop('disabled', true);
                $deleteGuidancemodel.prop('disabled', true);
                y.share.data.set('guidancemodel', null);
                feedback("Done!");
            });

            $exportModel.click(function() {
                var link = document.createElement('a');
                link.download = "model.json";
                link.href = 'data:,' + encodeURI(JSON.stringify(y.share.data.get('model'), null, 4));
                link.click();
            });

            $exportMetamodel.click(function() {
                var link = document.createElement('a');
                link.download = "vls.json";
                link.href = 'data:,' + encodeURI(JSON.stringify(y.share.data.get('metamodel'), null, 4));
                link.click();
            });

            $exportGuidancemodel.click(function() {
                var link = document.createElement('a');
                link.download = "guidance_model.json";
                link.href = 'data:,' + encodeURI(JSON.stringify(y.share.data.get('guidancemodel'), null, 4));
                link.click();

            });

            $importModel.click(function() {
                getFileContent().then(function(data) {
                    y.share.data.set('model', data);
                    feedback("Done!");
                });
            });

            $importMetamodel.click(function() {
                getFileContent().then(function(data) {
                    try {
                        var vls = GenerateViewpointModel(data);
                        y.share.data.set('metamodel', vls);
                        feedback("Done!");
                    }
                    catch (e) {
                        y.share.data.set('metamodel', data);
                        feedback("Done!");
                    }

                });
            });

            $importGuidancemodel.click(function() {
                getFileContent().then(function(data) {
                    $exportGuidancemodel.prop('disabled', false);
                    $deleteGuidancemodel.prop('disabled', false);
                    y.share.data.set('guidancemodel', data);
                    feedback("Done!");
                });
            });


            var checkExistence = function() {

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
