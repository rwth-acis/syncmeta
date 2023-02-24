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
After the container started to run, the application will be accessible via <http://127.0.0.1:8000>

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

When the application is up and running, you will see two options on the main page metamodeling space and modeling space. As their names imply, you can create metamodel in the meta modeling space and after creating the meta model, it can be uploaded to the modeling space with the 'Generate Metamodel' button. Created metamodel can be tried instantly in the modeling space in this way.

Please note that this is currently broken. So export the metamodel using the debug widget and then delete the current model and then import the exported metamodel.

## Library Documentation

Syncmeta is built using a modular widget system. Each widget is defined as its own LitElement, so you can import only the ones required.
If you want all main widgets in one container, you can import the widget container.

```javascript
import "./widgets/src/widgets/widget.container.ts"
```

### Widgets

Widgets are contained in the following folder: `widgets/src/widgets/partials`

The most important widget, which is always required is the canvas widget or main widget (`widgets/src/widgets/partials/main.widget.ts`). This widget will be used to create our (meta-) models.

The palette widget (`widgets/src/widgets/partials/palette.widget.ts`) can be used to more easily select tools to work on the canvas.

The attribute widget (`widgets/src/widgets/partials/attribute.widget.ts`) displays the attributes of the currently selected element in the canvas. This makes it easier to modify them.

The Import/Export widget (`widgets/src/widgets/partials/debug.widget.ts`) can be used to import or export various aspects of the app. Most notably the metamodel, the model and the activity list.

The activity widget (`widgets/src/widgets/partials/activity.widget.ts`) logs the activities of the users of the app and displays them as a list. It also shows a list of online users.

### Inter-Widget Communication(IWC)

For the __local__ communication between the various widgets of the SyncMeta the IWC is used. This module allows each syncmeta widget to communicate with all other widgets. This is done through PostMessage calls on the widget.

### Developing your own widgets

If you develop custom widgets you need to follow the same naming conventions in order to receive messages.
The `config` object in `widgets/src/es6/config.js` declares a field `WIDGET.NAME`. Add your custom widget name there. The naming convention is described in the function `getWidgetTagName` of the following file `widgets/src/es6/config.js`. It follows the pattern `<custom-name>-widget` where `<custom-name>`is the custom name you gave your widget. You may want to use that function and the property in the config for declaring the LitElement.

Furthermore, each widget extends the SyncMetaWidget superclass.

An example could look as follows

```js
// config.js
export const CONFIG = {
  ...,
  WIDGET: {
    NAME: {
      MAIN: "Canvas",
      ...,
      MY_FANCY_NAME: "My Fancy Widget",
      ...
    },
  },
  ...
}
```

```js
// your.fancy.widget.ts
const tagName = getWidgetTagName(CONFIG.WIDGET.NAME.YOUR_FANCY_NAME)

@customElement(tagName)
class MyFancyWidget extends SyncMetaWidget(
  LitElement,
  tagName
)

```

### Authentication

Syncmeta creates profiles for each user based on information provided by third party providers. The following information is required:

* `email`: the email of the user
* `preferred_username`: the username which will be used as a display name
* `sub`: the oidc sub of the user

It fetches the information from the url under `localStorage.getItem("userinfo_endpoint")`. As authentication the access token `localStorage.getItem("access_token")` is used. If you use syncmeta widgets outside of this project, make sure that they are available in localstorage.
The data fetched from the endpoint is supposed to contain json in the following format

```js
{
  email: "<alice@example.org>"
  preferred_username: "some_username"
  sub: "some_sub"
}
```

### Versions

Syncmeta uses the awesome [Yjs](http://y-js.org/) framework to provide near-realtime collaborative modeling in the web browser.

### Demo Videos

* [SyncMeta vs. SyncLD](https://youtu.be/owLa2jO3NJg) SyncMeta vs. Domain-dependent IMS LD Collaborative Authoring Tool, using OT.
* [SyncMeta](https://youtu.be/La8vw8OAauE) SyncMeta using Operational Transformation.
* [SyncMeta Nudges](https://youtu.be/Clc0q7k75Ko) SyncMeta with Collaborative Modeling Recommendations, using Operational Transformation.
* [Community Application Editor](https://youtu.be/Vuyj2e32ePk) Model-Driven Web Engineering Framework based on SyncMeta, using Operational Transformation.
* [Community Application Editor Live Coding](https://youtu.be/vxW6k_L0iOk) Model-Driven Web Engineering Framework with model to code synchronization, live coding and live preview, based on SyncMeta, using Yjs.
* [Storytelling Tool](https://youtu.be/enKijrMpYe0) Collaborative Storytelling with 3D Objects, realized with SyncMeta using Yjs
