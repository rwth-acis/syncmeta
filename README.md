# SyncMeta - Near real-time collaborative modeling framework
## General information
For explanations, presentations and demos see the [SyncMeta homepage][1]. 
See SyncMeta in action in [Role-SDK](http://role-sandbox.eu/spaces/syncmeta).

## Build steps
1. Make sure to have *npm*, *bower* and *grunt* installed
    * Use your favorite package manager or grab *npm* from [here][2]
    * Use *npm* to install *bower* and *grunt*: ```npm install -g bower grunt```
2. Install development dependencies: ```npm install```
3. Install dependencies: ```bower install```
4. Copy *.localGruntConfig.json.sample* and name it *.localGruntConfig.json*
5. Change *baseUrl* in *.localGruntConfig.json* to the deployment url
6. Run ```grunt build``` to build the widgets.

## Library Documentation
### Namespaces
1. Widgets
  * [Activity widget](https://rwth-acis.github.io/syncmeta/html/activity_widget.html)
  * [Attribute widget](https://rwth-acis.github.io/syncmeta/html/attribute_widget.html)
  * [Canvas widget](https://rwth-acis.github.io/syncmeta/html/canvas_widget.html)
  * [Palette widget](https://rwth-acis.github.io/syncmeta/html/palette_widget.html)
2. Operations
  * [Operations](https://rwth-acis.github.io/syncmeta/html/operations.html)
  * [OT Operations](https://rwth-acis.github.io/syncmeta/html/operations.ot.html)
  * [Non OT Operations](https://rwth-acis.github.io/syncmeta/html/operations.non_ot.html)

### Deploy
In order to deploy SyncMeta to [http://role-sandbox.eu/spaces/syncmeta](http://role-sandbox.eu/spaces/syncmeta), 
you have to push your latest changes to the `gh-pages` github branch. 
(See [github pages](https://pages.github.com/) for explanation)

[1]: http://dbis.rwth-aachen.de/cms/research/ACIS/SyncMeta
[2]: http://nodejs.org/
