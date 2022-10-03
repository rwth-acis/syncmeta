# SyncMeta - Near real-time collaborative modeling framework

## General information

[![Join the chat at https://gitter.im/rwth-acis/syncmeta](https://badges.gitter.im/rwth-acis/syncmeta.svg)](https://gitter.im/rwth-acis/syncmeta?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

For explanations, presentations, demos and links to modeling sandboxes and other stuff please visit the [SyncMeta homepage](http://dbis.rwth-aachen.de/cms/research/ACIS/SyncMeta).

## Build and Run

First build the Docker image

```sh
cd syncmeta
docker build -t rwthacis/syncmeta .
```

Then you can run the image like this:

```sh
docker run -p 8070:8070 -e WEBHOST=<host_address> -e YJS=<yjs_address> -e OIDC_CLIENT_ID=<oidc_client_id> -d rwthacis/syncmeta
```

After container started to run, application will be accessible via <http://127.0.0.1:8070> \
Also, individual widgets can be accessed via <http://127.0.0.1:8070/widgets/<widget_name>>.

SyncMeta is using [YJS][yjs-github] for interwidget communication, therefore it needs [y-websocket-server][y-websocket-server] instance.
It can be started with following command:

```sh
docker run -p 1234:1234  -d rwthacis/y-websockets-server
```

Then, address of y-websockets-server instance need to be passed to SyncMeta Docker container during initialization with `YJS` environment variable. If websocket server is started with previous command, its address will be `127.0.0.1:1234` and this value need to be passed to SyncMeta Docker container during initialization.

Following environment variables are needed to be passed to container during initialization:

* `WEBHOST`: Url address of SyncMeta application
* `YJS`: Root url address of Yjs websocket server. If it is running behind reverse proxy, relative path need to be provided with the `YJS_RESOURCE_PATH` env variable.
* `OIDC_CLIENT_ID`: OIDC client id which is used in SyncMeta for authentication purpose. Client id can be acquired from Learning Layers after client registration

Following environment variables have default values however they can be changed during initialization:

* `PORT`: Port which Nginx server is listening locally. This port need to be made accessible to outside with port mapping during initialization. Default value is `8070`.
* `YJS_RESOURCE_PATH`: Resource path of Yjs websocker server. If websocket server running behind reverse proxy and `/yjs` path is redirected to websocket server, this env variable need to be `/yjs/socket.io`. Default value is `/socket.io`.

### Same origin

The syncmeta widgets are implemented as iframes which need to access their parent object. Because of the same-origin policy of the browser, both the widgets and app have to be served from the same origin, which in this case is `127.0.0.1:8070`. If you visit the page through `localhost` though, the same-origin policy will prevent the iframes (with origin `127.0.0.1:8070`) from accessing their parent (with origin `localhost:8070`)

## Usage

When application is up and running, you will see two option in the main page as meta modeling space and modeling space. As their names imply, you can create meta model in the meta modeling space and after creating the meta model, it can be uploaded to modeling space with 'Generate Metamodel' button. Created meta model can be tried instantly in the modeling space with this way.

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

[yjs-github]: https://github.com/yjs/yjs
[y-websocket-server]: https://github.com/y-js/y-websockets-server
