
/*requirejs.config({
   baseUrl: "js/lib",
   path:{
        jquery: "vendor/jquery",
         yjs: "vendor/yjs/y",
   } 
});*/
//requirejs(['yjs-sync'], function(yjsSync) {


window.syncmeta = {
    ySyncMetaInstance: null,
    /**
     * TODO documentation and implementation
     */
    connect: function(spaceName) {
        if (!ySyncMetaInstance) {
            return yjsSync(spaceName).done(function(y) {
                ySyncMetaInstance = y;
                //TODO newly created nodes and edges need to register observers, too. 

            }).then(function() {
                return true;
            })
        }
        else return new Error('Already connected');
    },
    /**
     * Listen to NodeAddOperations on the SyncMeta canvas widget
     * @param {onNodeCallback} callback - the callback if a node was created on syncmeta canvas widget
     */
    onNodeAdd: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');

        this.ySyncMetaInstance.share.canvas.observe(function(event) {
            if (event.name == 'NodeAddOperation')
                callback(event.value);
        });
    },
    /**
     * @param{function} callback - callback if a users joins the space
     */
    onUserJoin: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');
        this.ySyncMetaInstance.share.userList.observe(function(event) {
            callback(event.value);
        })
    },
    /**
     * Listen to EdgeAddOperation on the SyncMeta canvas widget
     * @param {onEdgeCallback} callback - the callback if a edge was created on syncmeta canvas widget
     */
    onEdgeAdd: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');

        this.ySyncMetaInstance.share.canvas.observe(function(event) {
            if (event.name == 'EdgeAddOperation')
                callback(event.value);
        });
    },
    /**
     * Listen to both EdgeAddOperation and NodeAddOperation
     * @param callback - the callback if edge or node was created on syncmeta canvas widget
     * @see onNodeAdd
     * @see onEdgeAdd
     */
    onEntityAdd: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');

        this.ySyncMetaInstance.share.canvas.observe(function(event) {
            if (event.name == 'NodeAddOperation')
                callback(event.value);
            else if (event.name == 'EdgeAddOperation')
                callback(event.value, event.name);
        });

    },
    /**
     * Listen to selections of entities on the Syncmeta canvas widget
     * @param {onEntitySelectCallback} callback - the callback if a entity was selected
     */
    onEntitySelect: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');

        this.ySyncMetaInstance.share.select.observe(function(event) {
            if (event.value)
                callback(event.value);
        });
    },
    /**
     * Listen to selections of nodes on the Syncmeta canvas widget
     * @param {onEntitySelectCallback} callback - the callback if a node was selected
     */
    onNodeSelect: function(callback) {

        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');
        var that = this;
        this.ySyncMetaInstance.share.select.observe(function(event) {
            if (event.value && that.ySyncMetaInstance.share.nodes.keys().indexOf(event.value) != -1)
                callback(event.value);
        });
    },
    /**
     * Listen to selections of edges on the Syncmeta canvas widget
     * @param {onEntitySelectCallback} callback - the callback if a edge was selected
     */
    onEdgeSelect: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');
        var that = this;
        this.ySyncMetaInstance.share.select.observe(function(event) {
            if (event.value && that.ySyncMetaInstance.share.edges.keys().indexOf(event.value) != -1)
                callback(event.value);
        });
    },
    /**
     * Listen to NodeDeleteOperation
     * @param {onEntityDeleteCallback} callback - the callback if a node was deleted
     */
    onNodeDelete: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');
        this.ySyncMetaInstance.share.nodes.observe(function(event) {
            callback(event.value);
        });

    },
    /**
     * Listen to EdgeDeleteOperations
     * @param {onEntityDeleteCallback} callback - the callback if a edge was deleted
     */
    onEdgeDelete: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');
        this.ySyncMetaInstance.share.edges.observe(function(event) {
            callback(event.value);
        });
    },
    /**
     * Listen to node manipulations
     * @param {array} keys - the operations to listen to. All possible options are  ['NodeMoveOperation', 'NodeResizeOperation', 'NodeMoveZOperation']
     * @parem {function} callback - the callback if one of the operations defined in keys were issued
     * @param {string} id - id of the node to listen to. If null we listen to all
     */
    onNode: function(keys, callback, id) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');
        if (id) {
            this.ySyncMetaInstance.share.nodes.get(id).then(function(ymap) {
                ymap.observe(function(event) {
                    if (keys.indexOf(event.name) != -1) {
                        callback(event.value);
                    }
                })
            })
        } else {
            var nodeIds = this.ySyncMetaInstance.share.nodes.keys();
            for (var i = 0; i < nodeIds.length; i++) {
                if (n = this.ySyncMetaInstance.share.nodes.get(nodeIds[i])) {
                    n.then(function(ymap) {
                        ymap.observe(function(event) {
                            if (keys.indexOf(event.name) != -1) {
                                callback(event.value);
                            }
                        })
                    })
                }
            }
        }
    },
    /**
     * Listen to NodeMoveOperations
     * Equivalent to onNode(['NodeMoveOperation'], callback, id);
     * @param {onNodeMoveCallback} callback - the callback if a node is moved on the canvas
     * @param {string} id - id of the node to listen to. If null we listen to all
     * @see onNode
     */
    onNodeMove: function(callback, id) {
        this.onNode(['NodeMoveOperation'], callback, id);
    },
    /**
     * Listen to NodeResizeOperations
     * Equivalent to onNode(['NodeResizeOperation'], callback, id);
     * @param {onNodeResizeCallback} callback - the callback if a node is resized on the canvas
     * @param {string} id - id of the node to listen to. If null we listen to all
     * @see OnNode
     */
    onNodeResize: function(callback, id) {
        this.onNode(['NodeResizeOperation'], callback, id);
    },
    /**
    * Listen to NodeMoveZOperations
    * Equivalent to onNode(['NodeMoveZOperation'], callback, id);
    * @param {onNodeMoveZCallback} callback - the callback if a node is moved to the back- or foreground on the canvas
    * @param {string} id - id of the node to listen to. If null we listen to all
    * @see OnNode
    */
    onNodeMoveZ: function(callback, id) {
        this.onNode(['NodeMoveZOperation'], callback, id);
    },
    /**
     * Listen to changes on Attributes on nodes or edges
     * @param {string} type - 'nodes' or 'edges'
     * @param {onAttributeChangeCallback} callback - calls back if a attribute is changed
     * @param {string} entityId - id of the node to listen to. If null we listen to all of the specified type
     */
    onAttributeChange: function(type, callback, entityId) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');

        var listenToAttributes = function(ymapPromise, entityId) {
            var listentoAttributesHelper = function(attrId, attrPromise, entityId) {
                if (attrPromise instanceof Promise) {
                    attrPromise.then(function(ytext) {
                        ytext.observe(function(event) {
                            callback(event.object.toString(), entityId, attrId);
                        });
                    })
                }
            };

            ymapPromise.then(function(ymap) {
                ymap.observe(function(event) {
                    if (event.name.search(/\w*\[\w*\]/g) != -1) {
                        callback(event.value.value, entityId, event.value.entityId);
                    }
                });
                var keys = ymap.keys();
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i].search(/\w*\[\w*\]/g) != -1) {
                        listentoAttributesHelper(keys[i], ymap.get(keys[i]), entityId);
                    }
                }
            });
        };
        if (!entityId) {
            //listen to everything OR return
            var nodeIds = this.ySyncMetaInstance.share[type].keys();
            for (var i = 0; i < nodeIds.length; i++) {
                if (p = this.ySyncMetaInstance.share[type].get(nodeIds[i])) {
                    listenToAttributes(p, nodeIds[i]);
                }
            }
        }
        else if (p = this.ySyncMetaInstance.share[type].get(entityId)) {
            listenToAttributes(p, entityId);
        }
    },
    /**
     * Listen to changes on Attributes on nodes
     * Equivalent to onAttributeChange('nodes', callback, entityId);
     * @param {onAttributeChangeCallback} callback - calls back if a attribute is changed
     * @param {string} entityId - id of the node to listen to. If null we listen to all of the specified type 
     * @see OnAttributeChange
     */
    onNodeAttributeChange: function(callback, entityId) {
        this.onAttributeChange('nodes', callback, entityId);
    },
     /**
     * Listen to changes on Attributes on edges
     * Equivalent to onAttributeChange('edges', callback, entityId);
     * @param {onAttributeChangeCallback} callback - calls back if a attribute is changed
     * @param {string} entityId - id of the edge to listen to. If null we listen to all of the specified type 
     * @see OnAttributeChange
     */
    onEdgeAttributeChange: function(callback, entityId) {
        this.onAttributeChange('edges', callback, entityId);
    }

    /**
     * @callback onNodeCallback
     * @param {object} event - the NodeAddOperation event
     * @param {string} event.id - the id of the created node
     * @param {string} event.type - the type of the node
     * @param {string} event.oType - the original type (only set in views, then type is the view type)
     * @param {integer} event.top - y position in the canvas
     * @param {integer} event.left - x position in the canvas
     * @param {integer} event.width - width of the node
     * @param {integer} event.height - height of the node
     * @param {integer} event.zIndex - depth value of the node 
     * @param {object} event.json - the json representation. Only used for import of (meta-)models. Should be always null
     * @param {string} event.jabberId - jabberId of the user who created the node
     * 
     */

    /**
     * @callback onEdgeCallback
     * @param {object} event - the EdgeAddOperation event
     * @param {string} event.id - the id of the created edge
     * @param {string} event.jabberId - jabberId of the user who created the edge
     * @param {string} event.type - the type of the edge
     * @param {string} event.oType - the original type (only set in views, then type is the view type)
     * @param {object} event.json - the json representation. Only used for import of (meta-)models. Should be always null
     * @param {string} event.source - the source of the edge
     * @param {string} event.target - the target of the edge
     */

    /**
     * @callback onEntitySelectCallback
     * @param {string} id - the id of the selected entity (node/edge)
     */

    /**
     * @callback onEntityDeleteCallback
     * @param {string} id - the id of the deleted entity (node/edge)
     */

    /**
     * @callback onNodeMoveCallback
     * @param {object} event - the node move operation
     * @param {string} event.id - the id of node
     * @param {string} event.jabberId - the jabberId of the user
     * @param {integer} event.offsetX
     * @param {integer} event.offsetY
     */

    /**
     *@callback onNodeResizeCallback
     * @param {object} event - the node resize operation
     * @param {string} event.id - the id of node
     * @param {string} event.jabberId - the jabberId of the user    
     * @param {integer} event.offsetX
     * @param {integer} event.offsetY 
     * */

    /**
     * @callback onNodeMoveZCallback
     * @param {object} event - the NodeMoveZOperation
     * @param {string} event.id - the id of the node
     * @param {integer} event.offsetZ - the offset of the z coordinate
     */
    
    /**
     * @callback onAttributeChangeCallback
     * @param {string} value - the new value of the attribute
     * @param {string} entityId - the id of the entity (node/edge) the attribute belongs to
     * @param {string} attrId - the id of the attribute
     */
}
//});


