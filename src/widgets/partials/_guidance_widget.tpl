<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/style.css">
<link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/bootstrap.min.prefixed.css">
<!-- <link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/font-awesome/css/font-awesome.min.css"> -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
<script src="<%= grunt.config('baseUrl') %>/js/guidance_widget.js"></script>
<div id="guidance">
<div class="bs-btn-group">
	<div class="bs-form-group">
		<label for="strategyButton">Guidance Strategy</label>
  <button id="strategyButton" type="button" class="bs-btn bs-btn-default bs-dropdown-toggle bs-form-control" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Select a strategy<span class="bs-caret"></span>
  </button>
  <ul class="bs-dropdown-menu" id="guidanceSelect">
  </ul>
</div>
</div>
</div>