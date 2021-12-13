<script src="<%= grunt.config('baseUrl') %>/js/debug_widget.js"></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css"
/>
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
  rel="stylesheet"
  integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
  crossorigin="anonymous"
/>

<div class="seperating_box">
  <h5>Select a JSON file</h5>
  <div class="input-group">
    <input
      class="form-control"
      type="file"
      id="file-object"
      value="Load a file"
    />
    <button
      class="btn btn-secondary"
      id="import-model"
      title="Import a model to the canvas"
    >
      Import
    </button>
  </div>
</div>

<div id="modelDiv" class="seperating_box mb-2">
  <h5>Model Operations</h5>

  <button
    class="btn btn-secondary"
    id="export-model"
    title="export the model as JSON"
  >
    <i class="bi bi-box-arrow-up-right"></i> Export
  </button>
  <button class="btn btn-danger" id="delete-model" title="delete the model">
    <i class="bi bi-trash"></i> Delete
  </button>
</div>

<p class="hint text-muted">
  After import or delete refresh the canvas widget to apply the new model. After
  deleting and importing a new VLS refresh the whole role space.
</p>
<p id="feedback"></p>
