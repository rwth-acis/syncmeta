<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/style.css">
<script src="<%= grunt.config('baseUrl') %>/js/viewcontrol_widget.js"></script>
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
    <button id="btnLoadViewpoint">Load a Viewpoint</button>
    <button id="btnDelAllView">Delete all Views</button>
</div>
<div class="seperating_box">
    <strong>Viewpoint List</strong>
    <table id="viewpointlist"></table>
</div>
</div>