# SyncMeta - Near real-time collaborative modeling framework
## General information

[![Join the chat at https://gitter.im/rwth-acis/syncmeta](https://badges.gitter.im/rwth-acis/syncmeta.svg)](https://gitter.im/rwth-acis/syncmeta?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

For explanations, presentations, demos and links to modeling sandboxes and other stuff please visit the [SyncMeta homepage](http://dbis.rwth-aachen.de/cms/research/ACIS/SyncMeta). 

## Build steps
1. Make sure to have *npm*, *bower* and *grunt* installed
    * Use your favorite package manager or grab *npm* from [here](https://nodejs.org/en/)
    * Use *npm* to install *bower*: ```npm install -g bower```
    * Use *npm* to first install grunt-cli and then grunt itself: ```npm install -g grunt-cli grunt```
2. Install development dependencies: ```npm install```
3. Install dependencies: ```bower install```
4. Copy *.localGruntConfig.json.sample* and name it *.localGruntConfig.json*
5. Change *baseUrl*, *roleSandboxUrl* and *yjsConnectorUrl* in *.localGruntConfig.json* if necessary
6. Run ```grunt build``` to build the widgets.

## Library Documentation

### Widgets
__Note:__ Widgets with a '*' require the openapp library.
  * [Canvas widget](https://rwth-acis.github.io/syncmeta/syncmeta6/widget.xml) The model canvas
  * [Palette widget](https://rwth-acis.github.io/syncmeta/syncmeta6/palette.xml) Palette of elements that can be put on the canvas widget
  * [Activity widget](https://rwth-acis.github.io/syncmeta/syncmeta6/activity.xml) Widget that gives awareness of activities of other users
  * [Attribute widget](https://rwth-acis.github.io/syncmeta/syncmeta6/attribute.xml) Edit model attributes
  * [Import/Export widget](https://rwth-acis.github.io/syncmeta/syncmeta6/debug.xml) Import/Export/Delete (meta-)models and guidance models. Download activity list as JSON
  * [Viewcontrol widget](https://rwth-acis.github.io/syncmeta/syncmeta6/viewcontrol.xml) Import/Export/Delete viewpoint and views.
  * [Export widget](https://rwth-acis.github.io/syncmeta/syncmeta6/export.xml) Export the design to JSON.
  * [IMSLD Export widget](https://rwth-acis.github.io/syncmeta/syncmeta6/imsld_export.xml) Export the design as ZIP (in the IMSLD format) or link the design to [ILDE](http://ilde.upf.edu/)
  * [Instancelist widget](https://rwth-acis.github.io/syncmeta/syncmeta6/instances.xml)* List all generated instances.
  * [Generate Instance widget](https://rwth-acis.github.io/syncmeta/syncmeta6/generated_instances.xml)* Generate a new SyncMeta instance.
 
### Deploy

In order to deploy SyncMeta to [http://role-sandbox.eu/spaces/syncmeta](http://role-sandbox.eu/spaces/syncmeta), 
you have to push your latest changes to the `gh-pages` github branch. 
(See [github pages](https://pages.github.com/) for explanation)

_Attention!_, Please be aware that any changes you commit to the gh-pages branch will affect all ROLE spaces that link to widget definitions in this branch. Therefore only push very goodly tested commits to gh-pages.

### Local Deployment
_Attention!_, We don't recommend to use the Pyhton's SimpleHTTPServer. See this [issue](http://layers.dbis.rwth-aachen.de/jira/browse/SYNCMETA-23) for more information.

If you only want to deploy the SyncMeta widgets just run ```grunt connect``` after building the widgets. It starts a http server on port 8081. 
Otherwise u can use [nginx](http://nginx.org/en/download.html) or [AIDeX Mini-Webserver](http://www.aidex.de/software/webserver/)  

##### Yjs
The current version of SyncMeta needs a y-websockets-server. 
Please have a look a the [README](https://github.com/y-js/y-websockets-server) on how to install y-websocket-server and adjust the ```yjsConnectorUrl``` in the *.localGruntConfig.json* accordingly.

##### Inter-Widget Communication(IWC)
For the __local__ communication between the various widgets of the SyncMeta the new [the IWC library](https://github.com/rwth-acis/InterwidgetCommunication) from the chair is used.

### Versions
Syncmeta uses the awesome [Yjs](http://y-js.org/) framework to provide near-realtime collaborative modeling in the web browser.
The previous version of Syncmeta uses the [OpenCoWeb OT](https://github.com/opencoweb/coweb) framework and is still available in the [opencoweb-ot](https://github.com/rwth-acis/syncmeta/tree/opencoweb-ot) branch.

### Demo Videos
* [SyncMeta vs. SyncLD](https://youtu.be/owLa2jO3NJg) SyncMeta vs. Domain-dependent IMS LD Collaborative Authoring Tool, using OT.
* [SyncMeta](https://youtu.be/La8vw8OAauE) SyncMeta using Operational Transformation.
* [SyncMeta Nudges]https://youtu.be/Clc0q7k75Ko) SyncMeta with Collaborative Modeling Recommendations, using Operational Transformation.
* [Community Application Editor](https://youtu.be/Vuyj2e32ePk) Model-Driven Web Engineering Framework based on SyncMeta, using Operational Transformation.
* [Community Application Editor Live Coding](https://youtu.be/vxW6k_L0iOk) Model-Driven Web Engineering Framework with model to code synchronization, live coding and live preview, based on SyncMeta, using Yjs.
* [Storytelling Tool](https://youtu.be/enKijrMpYe0) Collaborative Storytelling with 3D Objects, realized with SyncMeta using Yjs

