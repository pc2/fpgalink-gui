var defaultRouterClassName = "draw2d.layout.connection.SketchConnectionRouter";
var defaultRouter = new draw2d.layout.connection.SketchConnectionRouter();

var HoverConnection = draw2d.Connection.extend({

    init: function ( sourcePort, targetPort) {
        var self = this;
        this._super({
            router: defaultRouter,
            radius: 5,
            source: sourcePort,
            target: targetPort,
            stroke: 3,
            outlineStroke:1,
            outlineColor:"#303030",
            color:"b9dd69"
        });

        // this.installEditPolicy(new SelectionMenuPolicy());

        // this.on("dragEnter", function (emitter, event) {
        //     self.attr({
        //         outlineColor: "#303030",
        //         outlineStroke: 2,
        //         color: "#00a8f0"
        //     });
        // });

        // this.on("dragLeave", function (emitter, event) {
        //     self.attr({
        //         outlineColor: "#303030",
        //         outlineStroke: 0,
        //         color: "#000000"
        //     });
        // });
    },

    /**
     * @method
     * called by the framework if the figure should show the contextmenu.</br>
     * The strategy to show the context menu depends on the plattform. Either loooong press or
     * right click with the mouse.
     *
     * @param {Number} x the x-coordinate to show the menu
     * @param {Number} y the y-coordinate to show the menu
     * @since 1.1.0
     */
    onContextMenu:function(x,y){

        $.contextMenu({
            selector: 'body',
            events:
            {
                hide:function(){ $.contextMenu( 'destroy' ); }
            },
            callback: function(key, options)
            {
            switch(key){
            case "red":
                var cmd = new draw2d.command.CommandAttr(this, {color: '#f3546a'});
                this.getCanvas().getCommandStack().execute(cmd);

                break;
            case "yellow":
                var cmd = new draw2d.command.CommandAttr(this, {color: '#FFFF99'});
                this.getCanvas().getCommandStack().execute(cmd);
                break;
            case "green":
                var cmd = new draw2d.command.CommandAttr(this, {color: '#b9dd69'});
                this.getCanvas().getCommandStack().execute(cmd);
                break;
            case "blue":
                var cmd = new draw2d.command.CommandAttr(this, {color: '#00A8F0'});
                this.getCanvas().getCommandStack().execute(cmd);
                break;
            case "delete":
                // without undo/redo support
            //     this.getCanvas().remove(this);

                // with undo/redo support
                var cmd = new draw2d.command.CommandDelete(this);
                this.getCanvas().getCommandStack().execute(cmd);
            default:
                break;
            }

            }.bind(this),
            x:x,
            y:y,
            items:
            {
                "red":    {name: "Red"},
                "yellow":    {name: "Yellow"},
                "green":  {name: "Green"},
                "blue":   {name: "Blue"},
                "sep1":   "---------",
                "delete": {name: "Delete"}
            }
        });

    }

    /**
     * required to receive dragEnter/dragLeave request.
     * This figure ignores drag/drop events if it is not a valid target
     * for the draggedFigure
     *
     * @param draggedFigure
     * @returns {HoverConnection}
     */
    // delegateTarget: function(draggedFigure)
    // {
    //     return this;
    // }
});
