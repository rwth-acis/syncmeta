# SyncMeta - Near real-time collaborative modeling framework
## General information
For explanations, presentations, demos and links to modeling sandboxes and other stuff please visit the [SyncMeta homepage][1]. 

## Build steps
1. Make sure to have *npm*, *bower* and *grunt* installed
    * Use your favorite package manager or grab *npm* from [here][2]
    * Use *npm* to install *bower*: ```npm install -g bower```
    * Use *npm* to first install grunt-cli and then grunt itself: ```npm install -g grunt-cli grunt```
2. Install development dependencies: ```npm install```
3. Install dependencies: ```bower install```
4. Copy *.localGruntConfig.json.sample* and name it *.localGruntConfig.json*
5. Copy *.dbis.secret.json.sample* and name it *.dbis.secret.json* (or update *Gruntfile.js* accordingly)
6. Change *baseUrl* in *.localGruntConfig.json* to the deployment url
7. Run ```grunt build``` to build the widgets.

## Library Documentation
### Widgets
  * [Canvas widget](https://rwth-acis.github.io/syncmeta/html/widget.xml) The model canvas
  * [Palette widget](https://rwth-acis.github.io/syncmeta/html/palette.xml) Palette of elements that can be put on the canvas widget
  * [Activity widget](https://rwth-acis.github.io/syncmeta/html/activity.xml) Widget that gives awareness of activities of other users
  * [Attribute widget](https://rwth-acis.github.io/syncmeta/html/attribute.xml) Edit model attributes
  * [Export widget](https://rwth-acis.github.io/syncmeta/html/export.xml) Export the design to JSON.
  * [IMSLD Export widget](https://rwth-acis.github.io/syncmeta/html/imsld_export.xml) Export the design as ZIP (in the IMSLD format) or link the design to [ILDE](http://ilde.upf.edu/)
  * [Instancelist widget](https://rwth-acis.github.io/syncmeta/html/instances.xml) List all generated instances.
  * [Generate Instance widget](https://rwth-acis.github.io/syncmeta/html/generated_instances.xml) Generate a new SyncMeta instance.
  
### Deploy

In order to deploy SyncMeta to [http://role-sandbox.eu/spaces/syncmeta](http://role-sandbox.eu/spaces/syncmeta), 
you have to push your latest changes to the `gh-pages` github branch. 
(See [github pages](https://pages.github.com/) for explanation)

_Attention!_, Please be aware that any changes you commit to the gh-pages branch will affect all ROLE spaces that link to widget definitions in this branch. Therefore only push very goodly tested commits to gh-pages.
