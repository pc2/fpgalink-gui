
example.View = draw2d.Canvas.extend({

    init: function (id) {
        this._super(id);

        this.setScrollArea("#" + id);

        this.currentDropConnection = null;
    },

    /**
     * @method
     * Called if the DragDrop object is moving around.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     *
     * @param {HTMLElement} droppedDomNode The dragged DOM element.
     * @param {Number} x the x coordinate of the drag
     * @param {Number} y the y coordinate of the drag
     *
     * @template
     **/
    onDrag: function (droppedDomNode, x, y) {
    },

    getNodeNameNew: function () {
        var newname = "Node ";
        // var numnodes = this.getFigures().getSize();
        var numnodes = get_number_of_fpga_nodes(this.getFigures());

        if (numnodes < 10) {
            newname += "0";
        }

        return newname + numnodes;
    },

    /**
     * @method
     * Called if the user drop the droppedDomNode onto the canvas.<br>
     * <br>
     * Draw2D use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     *
     * @param {HTMLElement} droppedDomNode The dropped DOM element.
     * @param {Number} x the x coordinate of the drop
     * @param {Number} y the y coordinate of the drop
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @private
     **/
    onDrop: function (droppedDomNode, x, y, shiftKey, ctrlKey) {

        // Switch between types that can be added.
        //   - type "node": n2fpga nodes (with orientation)
        //   - type "label": different labels for decoration
        
        switch($(droppedDomNode).data("type")) {
            case "node-intel" :
                var node = new NodeShape({ "orientation": $(droppedDomNode).data("shape") })
                
                // node.setOrientation(orientation);
                node.setName(this.getNodeNameNew());
                node.addFPGA("acl0", 4);
                node.addFPGA("acl1", 4);
                
                // create a command for the undo/redo support
                var command = new draw2d.command.CommandAdd(this, node, x, y);
                this.getCommandStack().execute(command);
                
                // Workaround to fix size problem
                node.setOrientation(node.orientation);

                break;
            case "node-xilinx":
                var node = new NodeShape({ "orientation": $(droppedDomNode).data("shape") })

                // node.setOrientation(orientation);
                node.setName(this.getNodeNameNew());
                node.addFPGA("acl0", 2);
                node.addFPGA("acl1", 2);
                node.addFPGA("acl2", 2);

                // create a command for the undo/redo support
                var command = new draw2d.command.CommandAdd(this, node, x, y);
                this.getCommandStack().execute(command);

                break;
            case "label" :
                // Add decoration by type.
                switch ($(droppedDomNode).data("shape")) {
                    case "label" :
                        var figure = new draw2d.shape.note.PostIt({
                            text: "label text",
                            color: "#000000",
                            padding: 20
                        });

                        figure.installEditor(new draw2d.ui.LabelInplaceEditor());

                        // create a command for the undo/redo support
                        var command = new draw2d.command.CommandAdd(this, figure, x, y);
                        this.getCommandStack().execute(command);

                        break;
                    default :
                        console.log("unknown shape.");
                }

                break;
            case "node-ethernet-switch":
                var eth_switch = new SwitchShape({ "orientation": $(droppedDomNode).data("shape") })

                // create a command for the undo/redo support
                var command = new draw2d.command.CommandAdd(this, eth_switch, x, y);
                this.getCommandStack().execute(command);

                break;
            default :
                console.log("unknown type: \"" + $(droppedDomNode).data("type") + "\".");
        }

    }
});
