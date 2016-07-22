
window.syncmeta = {
    ySyncMetaInstance: null,
    connect: function(spaceName) {
        if (!ySyncMetaInstance) {
            //TODO connect to y space
        }
        else new Error('Already connected');
    },
    /**
     * @param{function} callback
     */
    onNodeAdd: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');

        this.ySyncMetaInstance.share.canvas.observe(function(event) {
            if (event.name == 'NodeAddOperation')
                callback(event.value);
        });
    },
    onUserJoin: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');
        this.ySyncMetaInstance.share.userList.observe(function(event) {
            callback(event.value);
        })
    },
    onEdgeAdd: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');

        this.ySyncMetaInstance.share.canvas.observe(function(event) {
            if (event.name == 'EdgeAddOperation')
                callback(event.value);
        });
    },
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
    onEntitySelect: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');

        this.ySyncMetaInstance.share.select.observe(function(event) {
            if (event.value)
                callback(event.value);
        });
    },
    onNodeSelect: function(callback) {

        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');
        var that = this;
        this.ySyncMetaInstance.share.select.observe(function(event) {
            if (event.value && that.ySyncMetaInstance.share.nodes.keys().indexOf(event.value) != -1)
                callback(event.value);
        });
    },
    onEdgeSelect: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');
        var that = this;
        this.ySyncMetaInstance.share.select.observe(function(event) {
            if (event.value && that.ySyncMetaInstance.share.edges.keys().indexOf(event.value) != -1)
                callback(event.value);
        });
    },
    onNodeDelete: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');
        this.ySyncMetaInstance.share.nodes.observe(function(event) {
            callback(event.value);
        });

    },
    onEdgeDelete: function(callback) {
        if (!this.ySyncMetaInstance)
            return new Error('No Connection to Yjs space');
        this.ySyncMetaInstance.share.edges.observe(function(event) {
            callback(event.value);
        });
    },
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
    onNodeMove: function(callback, id) {
        this.onNode(['NodeMoveOperation'], callback, id);
    },
    onNodeResize: function(callback, id) {
        this.onNode(['NodeResizeOperation'], callback, id);
    },
    onNodeMoveZ: function(callback, id) {
        this.onNode(['NodeMoveZOperation'], callback, id);
    }
}
