
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

    getSwitchNameNew: function () {
        var newname = "Ethernet Switch ";
        var numnodes = get_number_of_switch_nodes(this.getFigures());

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

        // This function is available in the Utils.js
        createNodes($(droppedDomNode).data("type"), $(droppedDomNode).data("shape"), x, y);
    }
});
