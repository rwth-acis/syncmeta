<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/style.css">
<script type="application/javascript">
	 requirejs(['jqueryui',
	 'lodash',
	 'iwcw',
	 'Util',
	 'operations/non_ot/UpdateViewListOperation',
	 'canvas_widget/GenerateViewpointModel',
	 'promise!Metamodel'],
		function($,_,IWC, Util, UpdateViewListOperation,GenerateViewpointModel, metamodel){
				
			
				var iwc  = IWC.getInstance("VIEWCONTROL");

				
				var _viewList = {};
				var _viewpointList = {};
				
				var GetList = function(type, appendTo, tpl){	
					var space = new openapp.oo.Resource(openapp.param.space());
					space.getSubResources({
						relation: openapp.ns.role + "data", type: type,
						onEach: function(item) {
							openapp.resource.get(item.uri,function(context){
								openapp.resource.context(context).representation().get(function (rep) {
									var $viewEntry = $(tpl({name: rep.data.id, uri: rep.uri}));
									$viewEntry.find('.json').click(function(event){
										var $this = $(this).addClass('loading_button');
										var resource_uri = $(event.target).parents('tr').find('.lblviewname').attr('uri');
										openapp.resource.get(resource_uri,function(context){
											openapp.resource.context(context).representation().get(function (rep) {
												var link = document.createElement('a');
												link.download = rep.data.id + '.json';
												link.href = 'data:,'+encodeURI(JSON.stringify(rep.data,null,4));
												link.click();
												$this.removeClass('loading_button');
											});
										});
									});
									$viewEntry.find('.del').click(function(event){
										var resource_uri = $(event.target).parents('tr').find('.lblviewname').attr('uri');
										openapp.resource.del(resource_uri);
										$('#btnRefresh').click();
										
									});
									$viewEntry.find('.ToSpace').click(function(event){
										var resource_uri = $(event.target).parents('tr').find('.lblviewname').attr('uri');
										openapp.resource.get(resource_uri,function(context){
											openapp.resource.context(context).representation().get(function (rep) {
												var viewpointmodel = GenerateViewpointModel(rep.data);
												var spaceUri = $('#space_link_input_view').text() + "spaces/"+ $('#space_label_view').val();
												addMetamodelToSpace(spaceUri, viewpointmodel, CONFIG.NS.MY.VIEWPOINT);
											})
										});
									});
									$viewEntry.find('.patch').click(function(event){
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
									});
									$(appendTo).append($viewEntry);	
								});
							});
						} 
					}); 
				}						
				var GetViewListEntryTemplate = function(){
					var templateString = '<tr><td class="lblviewname" uri=<<= uri >>><<= name >></td><td><button class="json">JSON</button></td><td><button class="del">Del</button></td><td><button class="ToSpace">Add To Space</button></td><td><button class="patch">Patch</button></td></tr>'.replace(/<</g,"<"+"%").replace(/>>/g,"%"+">");
					return tpl = _.template(templateString);
				}
				var GetViewpointListEntryTemplate = function(){
                	var templateString = '<tr><td class="lblviewname" uri=<<= uri >>><<= name >></td><td><button class="json">JSON</button></td><td><button class="del">Del</button></td></tr>'.replace(/<</g,"<"+"%").replace(/>>/g,"%"+">");
                    return tpl = _.template(templateString);
                }
				var getFileContent = function($node){
				var fileReader,
                    files = $node[0].files,
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
			var LoadFileAndStoreToSpace = function(type){
				getFileContent($('#btnImport')).then(function(data){
						var space = new openapp.oo.Resource(openapp.param.space());
						 space.create({
							relation: openapp.ns.role + "data",
							type: type,
							representation: data,
							callback: function(subres){
								$('#btnRefresh').click();
								var operation = new UpdateViewListOperation();
								iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN, operation.toNonOTOperation());
							}
						}); 
					});
			}

        //In metamodeling layer
	    if(metamodel.constructor === Object){
	        $('#viewlist').parent().hide();
	        $('#btnLoadView').hide();
	        $('#btnDelAllView').hide();
	    }
	    else{
	        $('#viewpointlist').parent().hide();
	        $('#btnLoadViewpoint').hide();
	        $('#div1').show();
	    }

		GetList(CONFIG.NS.MY.VIEW, '#viewlist', GetViewListEntryTemplate());
		GetList(CONFIG.NS.MY.VIEWPOINT, '#viewpointlist', GetViewpointListEntryTemplate());



		$('#btnRefresh').click(function(){
		    if(metamodel.constructor !== Object){
			    $('#viewlist').empty();
			    GetList(CONFIG.NS.MY.VIEW, '#viewlist', GetViewListEntryTemplate());
			}else{
			    $('#viewpointlist').empty();
                GetList(CONFIG.NS.MY.VIEWPOINT, '#viewpointlist', GetViewpointListEntryTemplate());
			}
			var operation = new UpdateViewListOperation();
			iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN, operation.toNonOTOperation());
		});
				
		$('#btnLoadView').click(function(){
			LoadFileAndStoreToSpace(CONFIG.NS.MY.VIEW);
		});
				
		$('#btnLoadViewpoint').click(function(){
			LoadFileAndStoreToSpace(CONFIG.NS.MY.VIEWPOINT);
		});
				
		$('#btnDelAllView').click(function(){
		    var space = new openapp.oo.Resource(openapp.param.space());
            space.getSubResources({
            	relation: openapp.ns.role + "data", type: CONFIG.NS.MY.VIEW,
               	onEach: function(item) {
                   	    openapp.resource.del(item.uri);
                   	}
            });
		});
		
	  function addMetamodelToSpace(spaceURI,metamodel, type){
                var deferred = $.Deferred();
                var deferred2 = $.Deferred();
                openapp.resource.post(
                        spaceURI,
                        function(data){
                            deferred.resolve(data.uri);
                        },{
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate":"http://purl.org/role/terms/data",
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type":type
                        });
                deferred.promise().then(function(dataURI){
                    openapp.resource.put(
                            dataURI,
                            function(resp){
                                deferred2.resolve();
                            },{
                                "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate":"http://purl.org/openapp/representation"
                            },JSON.stringify(metamodel));
                });
                return deferred2.promise();
            }
	 });
</script>
<style>
	td {
		padding: 5;
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
</style>
<div id="viewcontrol">
<div class="seperating_box" style="display:none" id="div1">
<h5>Add a Viewpoint to a Model Editor instance</h5>
<strong>Editor space url:</strong>
    <br/>
    <span id="space_link_input_view"><%= grunt.config('roleSandboxUrl') %>/<input size="16" type="text" id="space_label_view" /></span>
    <br/>
</div>
<div class="seperating_box">
    <h5>Select a JSON file</h5>
    <input type="file" id="btnImport" />
</div>
<div class="seperating_box">
<h5>Control Elements</h5>
    <button id="btnRefresh">Refresh Lists</button>
    <button id="btnLoadView">Load a View</button>
    <button id="btnLoadViewpoint">Load a Viewpoint</button>
    <button id="btnDelAllView">Delete all Views</button>
</div>
<div class="seperating_box">
    <strong>View List</strong>
    <table id="viewlist"></table>
</div>
<div class="seperating_box">
    <strong>Viewpoint List</strong>
    <table id="viewpointlist"></table>
</div>
</div>