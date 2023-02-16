# SyncMeta - Near real-time collaborative modeling framework

 <a href="https://github.com/rwth-acis/syncmeta/releases">
        <img alt="GitHub release" src="https://img.shields.io/github/release/rwth-acis/syncmeta.svg">
</a>

## General information

Syncmeta is a modeling framework, which can be used to create models and metamodels using a graphical user interface (canvas).
The models are defined using the syncmeta metamodeling language.

## Build and Run

### Using Docker

Run the following command

```sh
docker compose -f "docker-compose.yml" up -d --build
```

This will build the Syncmeta Docker image and run the containers for Syncmeta and the y-websocket.

After container started to run, application will be accessible via <http://127.0.0.1:8000>

### Dev server

There is also the possibility to launch a local dev server. The dev server sits at the root of the repository. If you are using the app for the first time make sure to run `npm i` first.
On the first usage, you also need to install the dependencies for the `app` and the `widgets`. Navigate to the respective folders and run `npm i`.

Now, navigate back to the root folder of the repository and run

```sh
npm run dev
```

This will run watchers that will rerun the build process on any changes you make to the app or widgets.

The application will be accessible via <http://127.0.0.1:8000>

## Usage

When application is up and running, you will see two option in the main page as meta modeling space and modeling space. As their names imply, you can create metamodel in the meta modeling space and after creating the meta model, it can be uploaded to modeling space with 'Generate Metamodel' button. Created metamodel can be tried instantly in the modeling space in this way.

Please note that this is currently broken. So export the metamodel using the debug widget and then delete the current model and then import the exported metamodel.

## Library Documentation

Syncmeta is built using a modular widget system. Each widget is defined as its own LitElement, so you can import only the ones required.
If you want all main widgets in one container, you can import the widget.container element

### Widgets

The most important widget, which is always required is the canvas widget or main widget. This widget will be used to create our (meta-) models.

The palette widget can be used to more easily select tools to work on the canvas.

The attribute widget displays the attributes of the currently selected element in the canvas. This makes it easier to modify them.

The Import/Export widget can be used to import or export various aspects of the app. Most notably the metamodel, the model and the activity list.

The activity widget logs the activities of the users of the app.

### Inter-Widget Communication(IWC)

For the __local__ communication between the various widgets of the SyncMeta the IWC is used. This module allows each syncmeta widget to communicate with all other widgets. This is done through PostMessage calls on the widget. 
If you develop custom widgets you need to follow the same naming conventions in order to receive messages. The naming convention is described in the following file {}

### Versions

Syncmeta uses the awesome [Yjs](http://y-js.org/) framework to provide near-realtime collaborative modeling in the web browser.

### Demo Videos

* [SyncMeta vs. SyncLD](https://youtu.be/owLa2jO3NJg) SyncMeta vs. Domain-dependent IMS LD Collaborative Authoring Tool, using OT.
* [SyncMeta](https://youtu.be/La8vw8OAauE) SyncMeta using Operational Transformation.
* [SyncMeta Nudges](https://youtu.be/Clc0q7k75Ko) SyncMeta with Collaborative Modeling Recommendations, using Operational Transformation.
* [Community Application Editor](https://youtu.be/Vuyj2e32ePk) Model-Driven Web Engineering Framework based on SyncMeta, using Operational Transformation.
* [Community Application Editor Live Coding](https://youtu.be/vxW6k_L0iOk) Model-Driven Web Engineering Framework with model to code synchronization, live coding and live preview, based on SyncMeta, using Yjs.
* [Storytelling Tool](https://youtu.be/enKijrMpYe0) Collaborative Storytelling with 3D Objects, realized with SyncMeta using Yjs
