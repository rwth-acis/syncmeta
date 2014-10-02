# SyncMeta - Near real-time collaborative modeling framework
## General information
For explanations, presentations and demos see the [SyncMeta homepage][1]

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
  * [Activity widget](activity_widget.html)
  * [Attribute widget](attribute_widget.html)
  * [Canvas widget](canvas_widget.html)
  * [Palette widget](palette_widget.html)
2. Operations
  * [Operations](operations.html)
  * [OT Operations](operations.ot.html)
  * [Non OT Operations](operations.non_ot.html)

[1]: http://dbis.rwth-aachen.de/cms/research/ACIS/SyncMeta
[2]: http://nodejs.org/
