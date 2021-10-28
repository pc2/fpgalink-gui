
example.View = draw2d.Canvas.extend({

	init:function(id){
		this._super(id);

		this.setScrollArea("#"+id);
		
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
    onDrag:function(droppedDomNode, x, y )
    {
    },

    getNodeNameNew : function() {
        var newname = "n";
        var numnodes = this.getFigures().getSize();

        if(numnodes < 10) {
            newname += "0";
        }

        return newname+numnodes;
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
    onDrop : function(droppedDomNode, x, y, shiftKey, ctrlKey) {
        var orientation = $(droppedDomNode).data("shape");
        // var figure = eval("new NodeShapeVertical({orientation:\""+orientation+"\"});");
        var node = new NodeShapeVertical();

        node.setOrientation(orientation);
        node.setName(this.getNodeNameNew());
        node.addFPGA("acl0");
        node.addFPGA("acl1");
        
        // create a command for the undo/redo support
        var command = new draw2d.command.CommandAdd(this, node, x, y);
        this.getCommandStack().execute(command);

        // node.toFront();

    }
});

