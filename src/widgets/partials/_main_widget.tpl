<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/jquery.contextMenu.css">
<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/bootstrap.min.prefixed.css">
<!-- <link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/font-awesome/css/font-awesome.min.css"> -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/style.css">
<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/main_widget.css">
<script src="<%= grunt.config('baseUrl') %>/js/main_widget.js"></script>
<div id="loading" class="loading"></div>
<div class="button_bar left">
  <button id="save"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/save.png" /></button>
  <!--<button id="save_image"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/save_image.png" /></button>-->
  <!--<button id="generate" style="display: none"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/generate.png" /></button>-->
  <span id="feedback"></span>
  <strong id="lblCurrentView">View:<span id="lblCurrentViewId"></span></strong>
</div>
<div id="dialog" style="display:none" title="Generate editor">
    <p><strong>Editor space url:</strong>
        <br/>
        <span id="space_link_input"><%= grunt.config('roleSandboxUrl') %>/<input size="16" type="text" id="space_label" /></span>
        <span id="space_link_text" style="display: none"><a id="space_link" target="_blank" href="#"></a></span>
        <br/>
        <span id="space_link_comment" style="color: #FF3333; display: none">Space already exists, will be overwritten!</span>
    </p>
    <p><strong>Editor space title:</strong><input size="32" type="text" id="space_title" /></p>
</div>
<div class="button_bar right">
  <button id="viewsHide"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/viewHide.png"/></button>
   <button id="viewsShow"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/viewShow.png"/></button>
  <button id="showtype"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/hidetype.png" /></button>
  <button id="hidetype"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/showtype.png" /></button>
  <button id="zoomin"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/zoomin.png" /></button>
  <button id="zoomout"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/zoomout.png" /></button>
  <button id="undo"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/undo.png" /></button>
  <button id="redo"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/redo.png" /></button>
</div>
<div id="ViewCtrlContainer" class="button_bar left">
 <button id="btnCreateViewpoint"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/add196.png" /></button>
  <input id="txtNameViewpoint" type="text" placeholder="name"  style="display: none;">
   <select id="ddmViewpointSelection" style="display: none;"></select>
  <button id="btnAddViewpoint" style="display: none;"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/checked21.png" /></button>
  <button id="btnCancelCreateViewpoint" style="display: none;"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/times1.png" /></button>
  <select id="ddmViewSelection"></select>
   <button id="btnShowView">Show</button>
   <button id="btnRefreshView" style="display: none;">Refresh</button>
  <button id="btnDelViewPoint"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/times1.png" /></button>
</div>
<div class="ui-state-error ui-corner-all" style="margin-top: 20px; padding: 0 .7em; display:none">
		<p id="errorMsg"><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>
		<strong>SYNCMETA!</strong></p>
	</div>
<div id="canvas-frame">
  <div id="canvas">
  </div>
</div>
<div id="q"></div>

