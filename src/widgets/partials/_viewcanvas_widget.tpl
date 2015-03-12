<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/jquery.contextMenu.css">
<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/style.css">
<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/main_widget.css">
<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/viewcanvas_widget.css">
<script src="<%= grunt.config('baseUrl') %>/js/viewcanvas_widget.js"></script>
<script type="application/javascript">
</script>
<div id="loading" class="loading"></div>
<div class="button_bar left">
	<button id="save"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/save.png" /></button>
	 <span id="feedback"></span>
</div>
<div>
  <button id="showtype"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/hidetype.png" /></button>
  <button id="hidetype"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/showtype.png" /></button>
  <button id="zoomin"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/zoomin.png" /></button>
  <button id="zoomout"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/zoomout.png" /></button>
  <button id="undo"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/undo.png" /></button>
  <button id="redo"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/redo.png" /></button>
</div>
<div>
 <button id="btnCreateViewpoint"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/add196.png" /></button>
  <input id="txtNameViewpoint" type="text" placeholder="name"  style="display: none;">
   <select id="ddmViewpointSelection" style="display: none;"></select>
  <button id="btnAddViewpoint" style="display: none;"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/checked21.png" /></button>
  <button id="btnCancelCreateViewpoint" style="display: none;"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/times1.png" /></button>
  <select id="ddmViewSelection"></select>
   <button id="btnShowViewPoint">Show</button>
  <button id="btnDelViewPoint"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/times1.png" /></button>
  <p id="lblCurrentView">No view selected!</p>
</div>
<div id="canvas-frame">
  <div id="canvas">
  </div>
</div>
<div id="q"></div>	