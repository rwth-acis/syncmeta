<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/js/lib/vendor/test/mocha.css">
<script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/jquery.js"></script>
<script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/test/mocha.js"></script>
<script src="<%= grunt.config('baseUrl') %>/test/test_widget.js"></script>
<script src="<%= grunt.config('baseUrl') %>/plugin/syncmeta-plugin.js"></script>

<style>
    #wrapper {
        max-height: 500px;
        overflow-y: scroll;
    }
</style>
<div id="wrapper">
    <div id="mocha"></div>
    <div id="messages"></div>
    <div id="fixtures"></div>
</div>


