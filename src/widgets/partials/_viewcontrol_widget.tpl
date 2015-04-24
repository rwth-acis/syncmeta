<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/style.css">
<script type="application/javascript">
	 requirejs(['jqueryui',
	 'lodash',
	 'iwcw',
	 'operations/non_ot/UpdateViewListOperation'],
		function($,_,IWC,UpdateViewListOperation){
			$(function(){
				var iwc  = IWC.getInstance("VIEWCONTROL");
				iwc.disableBuffer();
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
									$(appendTo).append($viewEntry);	
								});
							});
						} 
					}); 
				}						
				var GetListEntryTemplate = function(){
					var templateString = '<tr><td class="lblviewname" uri=<<= uri >>><<= name >></td><td><button class="json">JSON</button></td></tr>'.replace(/<</g,"<"+"%").replace(/>>/g,"%"+">");
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
								iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.VIEWCANVAS, operation.toNonOTOperation());
							}
						}); 
					});
			}
				GetList(CONFIG.NS.MY.VIEW, '#viewlist', GetListEntryTemplate());
				GetList(CONFIG.NS.MY.VIEWPOINT, '#viewpointlist', GetListEntryTemplate());
				
				$('#btnRefresh').click(function(){
					var tpl = GetListEntryTemplate();
					$('#viewlist').empty();
					$('#viewpointlist').empty();
					GetList(CONFIG.NS.MY.VIEW, '#viewlist', tpl);
					GetList(CONFIG.NS.MY.VIEWPOINT, '#viewpointlist', tpl);
				})
				
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

			});
	 });
</script>
<style>
	td {
		padding: 5;
	}
</style>
<div id="viewcontrol">
<button id="btnRefresh">Refresh Lists</button><button id="btnDelAllView">Delete all Views</button>
<input type="file" id="btnImport" />
<button id="btnLoadView">Load a View</button>
<button id="btnLoadViewpoint">Load a Viewpoint</button>
	<div>
		<strong>View List</strong>
		<table id="viewlist"></table>
	</div>
	<div>
		<strong>Viewpoint List</strong>
		<table id="viewpointlist"></table>
	</div>
</div>