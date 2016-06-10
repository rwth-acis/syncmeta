requirejs(['jqueryui',
        'lodash',
        'iwcw',
        'lib/yjs-sync',
        'Util',
        'operations/non_ot/UpdateViewListOperation',
        'canvas_widget/GenerateViewpointModel'/*, 'promise!Metamodel'*/],
    function($,_,IWC, yjsSync, Util, UpdateViewListOperation,GenerateViewpointModel/*, metamodel*/){

        yjsSync().done(function(y){
            window.y = y;
            console.info('VIEWCONTROL: Yjs successfully initialized');

            var metamodel = y.share.data.get('metamodel');
            var iwc  = IWC.getInstance("VIEWCONTROL");

            var GetList = function(appendTo, tpl){
                var list = y.share.views.keys();
                for(var i=0;i<list.length;i++) {
                    var data = y.share.views.get(list[i]);
                    if(data) {
                        var $viewEntry = $(tpl({name: data.id}));
                        $viewEntry.find('.json').click(function (event) {
                            var $this = $(this).addClass('loading_button');
                            var viewId = $(event.target).parents('tr').find('.lblviewname').text();
                            var data = y.share.views.get(viewId);
                            var link = document.createElement('a');
                            link.download = data.id + '.json';
                            link.href = 'data:,' + encodeURI(JSON.stringify(data, null, 4));
                            link.click();
                            $this.removeClass('loading_button');

                        });
                        $viewEntry.find('.del').click(function (event) {
                            var viewId = $(event.target).parents('tr').find('.lblviewname').text();
                            y.share.views.set(viewId, null);
                            $('#btnRefresh').click();

                        });
                        $viewEntry.find('.ToSpace').click(function (event) {
                            var viewId = $(event.target).parents('tr').find('.lblviewname').text();
                            var viewpointmodel = GenerateViewpointModel(y.share.views.get(viewId));
                            addMetamodelToYjs($('#space_label_view').val(), viewpointmodel);

                        });
                        /*$viewEntry.find('.patch').click(function(event){
                         var renamingTplStr = '{"id":"<<=id>>","name":"","val":{"id":"<<=id>>[val]","name":"Attribute Name","value":"<<=val>>"},"ref":{"id":"<<=id>>[ref]","name":"Attribute Reference","value":"<<=val>>"},"vis":{"id":"<<=id>>[vis]","name":"Attribute Visibility","value":"show"}}'.replace(/<</g,"<"+"%").replace(/>>/g,"%"+">");
                         var renamingAttrTpl = _.template(renamingTplStr);

                         var resource_uri = $(event.target).parents('tr').find('.lblviewname').attr('uri');

                         require(['promise!Model'], function(model){

                         openapp.resource.get(resource_uri,function(context){
                         openapp.resource.context(context).representation().get(function (rep) {
                         var attr, attributes, attrList, renamingAttr, refKey;
                         var data = rep.data;
                         var nodes = data.nodes;
                         for(var nKey in nodes){
                         if(nodes.hasOwnProperty(nKey) && (nodes[nKey].type === 'ViewObject' || nodes[nKey].type === 'ViewRelationship')){
                         var refNode = model.nodes[nodes[nKey].attributes[nKey+'[target]'].value.value];
                         if(refNode){
                         attributes = nodes[nKey].attributes['[attributes]'];
                         attributes.type = 'RenamingListAttribute';
                         attributes.list  = {};
                         attrList = refNode.attributes['[attributes]'].list;

                         for(var attrKey in attrList){
                         if(attrList.hasOwnProperty(attrKey)){
                         attr = attrList[attrKey];
                         attributes.list[attrKey] = JSON.parse(renamingAttrTpl({id:attrKey, val:attr.key.value}));

                         }
                         }
                         }else{
                         console.error('No reference');
                         }

                         }
                         }
                         openapp.resource.context(context).representation().json(data).put(function(res){
                         console.log(res);
                         });
                         });
                         });
                         });
                         });*/
                        $(appendTo).append($viewEntry);
                    }
                }

            };

            var GetViewpointListEntryTemplate = function(){
                var templateString = '<tr><td class="lblviewname"><<= name >></td><td><button class="json">JSON</button></td><td><button class="del">Del</button></td></tr>'.replace(/<</g,"<"+"%").replace(/>>/g,"%"+">");
                return  _.template(templateString);
            };
            var getFileContent = function(){
                var fileReader,
                    files = $('#btnImport')[0].files,
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

            var LoadFileAndStoreToSpace = function(){
                getFileContent().then(function(data){
                    if(data.id){
                        if(metamodel){
                            try{
                                var vvs = GenerateViewpointModel(data);
                                y.share.views.set(vvs.id,vvs);
                            }
                            catch (e){
                                y.share.views.set(data.id,data);
                            }
                        }
                        else
                            y.share.views.set(data.id,data);

                        $('#btnRefresh').click();
                    }
                });
            };

            //In metamodeling layer
            if(!metamodel){
                $('#div1').show();
            }

            $('#btnLoadViewpoint').click(function(){
                LoadFileAndStoreToSpace();
            });
            GetList('#viewpointlist', GetViewpointListEntryTemplate());

            $('#btnDelAllView').click(function(){
                //TODO
            });


            $('#btnRefresh').click(function(){
                $('#viewpointlist').empty();
                GetList('#viewpointlist', GetViewpointListEntryTemplate());
                var operation = new UpdateViewListOperation();
                iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN, operation.toNonOTOperation());
            });

            function addMetamodelToYjs(roomName, metamodel){
                yjsSync(roomName).done(function(yInstance){
                    yInstance.share.data.set('metamodel',metamodel);
                })
            }
        });
    });
