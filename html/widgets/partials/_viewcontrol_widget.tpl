<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/style.css">
<script type="application/javascript">
	 requirejs(['jqueryui','lodash'],function($,_){
			
			
			$(function(){
				var getCurrentSpaceURI = function(space){
					var deferred = $.Deferred();
					space.getInfo(function(info) {
						var spaceuri = info[openapp.ns.conserve+ "owner"].substring(0,info[openapp.ns.conserve + "owner"].lastIndexOf("/"));
						deferred.resolve(spaceuri);
					});
					return deferred.promise();
				};
				function addWidgetToSpace(spaceURI,widgetURL){
					var deferred = $.Deferred();
					openapp.resource.post(
                        spaceURI,
                        function(data){
                            deferred.resolve(data.uri);
                        },{
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate":"http://purl.org/role/terms/tool",
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type":"http://purl.org/role/terms/OpenSocialGadget",
                            "http://www.w3.org/2000/01/rdf-schema#seeAlso":widgetURL
                        }
					);
					return deferred.promise();
				};
				
				var iwcClient;
				gadgets.util.registerOnLoadHandler(function(){
					iwcClient = new iwc.Client();
					iwcClient.connect(); 
				});
				var space = new openapp.oo.Resource(openapp.param.space());
				var templateString = '<tr><td class="lblviewname" uri=<<= uri >>><<= name >></td><td><input class="btnViewListShow" type="button" value="Show"></td><td><input type="button" class="btnViewListDel" value="Delete"></td></tr>'.replace(/<</g,"<"+"%").replace(/>>/g,"%"+">");
				var tpl = _.template(templateString);
				
				space.getSubResources({
					relation: openapp.ns.role + "data", type: "my:ns:item",
					onEach: function(item) {
						_uri = item.uri;
						item.getRepresentation("rdfjson",function(rep){
							var $viewEntry = $(tpl({name: rep.name, uri: _uri}));
							$viewEntry.find('.btnViewListDel').click(function(evt){
								var resource_uri = $(evt.target).parents('tr').find('.lblviewname').attr('uri');
								openapp.resource.del(resource_uri,function(data){
									window.location.reload();
									//alert("Deleted resource: " + resource_uri);
								});
							});
							$viewEntry.find('.btnViewListShow').click(function(evt){
								getCurrentSpaceURI(space).then(function(currentSpaceURI){
									addWidgetToSpace(currentSpaceURI, "<%= grunt.config('baseUrl') %>/viewcanvas.xml").then(function(){	
										var viewpointName = $(evt.target).parents('tr').find('.lblviewname').text();
										var intent = { 
											"component": "",
											"data": viewpointName,
											"dataType":"text/json",
											"action":"ACTION_UPDATE",
											"flags" :["PUBLISH_GLOBAL"],
											"extras" :{"ns":"my:ns:item"} 
										};
										//iwcClient.publish(intent); 
									});
								});
							});
							$('#viewlist').append($viewEntry);
							
						});	
					} 
				}); 
				
				$('#btnCreateView').click(function(){
					var text = {"name":$('#txtCreateView').val()};
					space.create({
						relation: openapp.ns.role + "data",
						type: "my:ns:item", 
						representation: text,
						callback: function(subres){ 						
							window.location.reload();
							alert("Successfully stored");
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
	<p id="createview">
		<input type="text" id="txtCreateView" size="10" maxlength="30">
		<input type="button" id="btnCreateView" value="CreateView">
	</p>
	<div id="viewlist">
		<strong>Viewpoint List</strong>
		<table id="viewlist"></table>
	</div>
</div>