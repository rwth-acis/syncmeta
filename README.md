# SyncMeta - Near real-time collaborative modeling framework

## Build and Run

### Using Docker

Run the following command

```sh
docker compose -f "docker-compose.yml" up -d --build
```

This will build the Syncmeta Docker image and run the containers for Syncmeta and the y-websocket.

After container started to run, application will be accessible via <http://127.0.0.1:8000>

### Dev server

There is also the possibility to launch a local dev server.
On first usage, you need to install the dependencies for the `example-app` and the `widgets`. Navigate to the respective folders and run `npm i`.

Now, navigate back to the `example-app` folder of the repository and run

```sh
npm run dev
```

This will run watchers that will rerun the build process on any changes you make to the app or widgets.

The application will be accessible via <http://127.0.0.1:8000>

## Usage

When application is up and running, you will see two option in the main page as meta modeling space and modeling space. As their names imply, you can create meta model in the meta modeling space and after creating the meta model, it can be uploaded to modeling space with 'Generate Metamodel' button. Created meta model can be tried instantly in the modeling space with this way.

## Updating and Publishing

We follow a SemVer-like versioning scheme, where new releases are tagged with a version number.
If you want to publish a new release, you need to create a new tag and push it to the repository. Furthermore, you need to update the version number in the `package.json` file to match the tag you just created.
The repository is configured to automatically bundle the widgets and publish them to NPM if you publish a new release.
The CI is configured in `.github\workflows\npm-publish.yml`.
The CI checks if the tag matches the version number in the `package.json` file and if so, it will publish the widgets to NPM.

## Library Documentation

### Widgets

* [Canvas widget](https://rwth-acis.github.io/syncmeta/syncmeta6/widget.xml) The model canvas
* [Palette widget](https://rwth-acis.github.io/syncmeta/syncmeta6/palette.xml) Palette of elements that can be put on the canvas widget
* [Activity widget](https://rwth-acis.github.io/syncmeta/syncmeta6/activity.xml) Widget that gives awareness of activities of other users
* [Attribute widget](https://rwth-acis.github.io/syncmeta/syncmeta6/attribute.xml) Edit model attributes
* [Import/Export widget](https://rwth-acis.github.io/syncmeta/syncmeta6/debug.xml) Import/Export/Delete (meta-)models and guidance models. Download activity list as JSON
* [Viewcontrol widget](https://rwth-acis.github.io/syncmeta/syncmeta6/viewcontrol.xml) Import/Export/Delete viewpoint and views.
* [Export widget](https://rwth-acis.github.io/syncmeta/syncmeta6/export.xml) Export the design to JSON.
* [IMSLD Export widget](https://rwth-acis.github.io/syncmeta/syncmeta6/imsld_export.xml) Export the design as ZIP (in the IMSLD format) or link the design to [ILDE](http://ilde.upf.edu/)

### Inter-Widget Communication(IWC)

For the __local__ communication between the various widgets of the SyncMeta the new [the IWC library](https://github.com/rwth-acis/InterwidgetCommunication) from the chair is used.

### Versions

Syncmeta uses the awesome [Yjs](http://y-js.org/) framework to provide near-realtime collaborative modeling in the web browser.
The previous version of Syncmeta uses the [OpenCoWeb OT](https://github.com/opencoweb/coweb) framework and is still available in the [opencoweb-ot](https://github.com/rwth-acis/syncmeta/tree/opencoweb-ot) branch.

### Demo Videos

* [SyncMeta vs. SyncLD](https://youtu.be/owLa2jO3NJg) SyncMeta vs. Domain-dependent IMS LD Collaborative Authoring Tool, using OT.
* [SyncMeta](https://youtu.be/La8vw8OAauE) SyncMeta using Operational Transformation.
* [SyncMeta Nudges](https://youtu.be/Clc0q7k75Ko) SyncMeta with Collaborative Modeling Recommendations, using Operational Transformation.
* [Community Application Editor](https://youtu.be/Vuyj2e32ePk) Model-Driven Web Engineering Framework based on SyncMeta, using Operational Transformation.
* [Community Application Editor Live Coding](https://youtu.be/vxW6k_L0iOk) Model-Driven Web Engineering Framework with model to code synchronization, live coding and live preview, based on SyncMeta, using Yjs.
* [Storytelling Tool](https://youtu.be/enKijrMpYe0) Collaborative Storytelling with 3D Objects, realized with SyncMeta using Yjs
