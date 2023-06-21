# SyncMeta - Near real-time collaborative modeling framework

For the full documentation, please visit the [SyncMeta Documentation](https://github.com/rwth-acis/syncmeta/wiki).
## Build and Run

The easiest way to build and run Syncmeta is to use Docker. If you don't have Docker installed, you can find the installation instructions [here](https://docs.docker.com/get-docker/).

### Using Docker

Run the following command

```sh
docker compose -f "docker-compose.yml" up -d --build
```

This will build the Syncmeta Docker image and run the containers for Syncmeta and the y-websocket. After the container started to run, the application will be accessible via <http://127.0.0.1:8000>

### Dev server

There is also the possibility to launch a local dev server. On the first usage, you need to install the dependencies for the `example-app` and the `widgets`. Navigate to the respective folders and run `npm i`.

Now, navigate back to the `example-app` folder of the repository and run

```sh
npm run dev
```

This will run watchers that will rerun the build process on any changes you make to the app or widgets.

The application will be accessible via <http://127.0.0.1:8000>

## Usage

When the application is up and running, you will see two options on the main page: the meta-modeling space and the modeling space. As their names imply, you can create the metamodel in the meta modeling space and after creating the meta model, it can be uploaded to the modeling space with the 'Generate Metamodel' button. The created metamodel can be tried instantly in the modeling space in this way.

## Updating and Publishing

We follow a SemVer-like versioning scheme, where new releases are tagged with a version number.
If you want to publish a new release, you need to create a new tag and push it to the repository. Furthermore, you need to update the version number in the `package.json` file to match the tag you just created.
The repository is configured to automatically bundle the widgets and publish them to NPM if you publish a new release.
The CI is configured in `.github\workflows\npm-publish.yml`.
The CI checks if the tag matches the version number in the `package.json` file and if so, it will publish the widgets to NPM.

## Demo Videos

* [SyncMeta vs. SyncLD](https://youtu.be/owLa2jO3NJg) SyncMeta vs. Domain-dependent IMS LD Collaborative Authoring Tool, using OT.
* [SyncMeta](https://youtu.be/La8vw8OAauE) SyncMeta using Operational Transformation.
* [SyncMeta Nudges](https://youtu.be/Clc0q7k75Ko) SyncMeta with Collaborative Modeling Recommendations, using Operational Transformation.
* [Community Application Editor](https://youtu.be/Vuyj2e32ePk) Model-Driven Web Engineering Framework based on SyncMeta, using Operational Transformation.
* [Community Application Editor Live Coding](https://youtu.be/vxW6k_L0iOk) Model-Driven Web Engineering Framework with model-to-code synchronization, live coding and live preview, based on SyncMeta, using Yjs.
* [Storytelling Tool](https://youtu.be/enKijrMpYe0) Collaborative Storytelling with 3D Objects realized with SyncMeta using Yjs
