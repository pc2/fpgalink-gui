var defaultRouterClassName = "draw2d.layout.connection.SplineConnectionRouter";
var defaultRouter = new draw2d.layout.connection.SplineConnectionRouter();


function showCustomConfigs(x, y, connection) {

    let canvas = connection.getCanvas();

    // If the document is clicked somewhere
    $(document).bind("mousedown", function (e) {
        // If the clicked element is not the menu, hide the menu
        // and remove the config connection
        if (!$(e.target).parents(".custom-menu.mult").length > 0) {
            $(".custom-menu.mult").hide(100);
            // Also remove it from the stack
            canvas.getCommandStack().undostack.pop();
            canvas.remove(connection);

            $(document).unbind("mousedown");
            $(".custom-menu.mult li").unbind("click");
        }
    });

    // If the menu element is clicked
    $(".custom-menu.mult li").one("click", function () {
        // Get the nodes
        let node1 = connection.sourcePort.parent;
        let node2 = connection.targetPort.parent;

        // Check if either nodes has connections and display 
        // a warning message, if accepted, then remove all
        // current connections
        let node1_connections = node1.getAllConnections();
        let node2_connections = node2.getAllConnections();

        let continueAction = true;

        if ((node1 instanceof NodeShape && node1_connections.length) || (node2 instanceof NodeShape && node2_connections.length)) {
            continueAction = confirm("The current connections will be overrided, do you want to continue?");
        }

        // Remove the config connection from the commands stack
        canvas.getCommandStack().undostack.pop();

        if (!continueAction) {
            // Remove the config connection
            canvas.remove(connection);
            return;
        }

        // Delete current connections if it's not a switch
        if (node1 instanceof NodeShape) {
            delete_connections(node1_connections, canvas);
        }
        if (node2 instanceof NodeShape) {
            delete_connections(node2_connections, canvas);
        }

        // This is the triggered action name
        switch ($(this).attr("data-action")) {
            // Connect the nodes based on the action
            case "one-by-one":
                if (node1 instanceof NodeShape && node2 instanceof NodeShape) {
                    connectBasedOnConfig([node1, node2], "one-by-one");
                } else {
                    // One of the nodes is a switch

                    let node = node1;
                    let eth_switch = node2;

                    if (node1 instanceof SwitchShape) {
                        node = node2;
                        eth_switch = node1;
                    }

                    connectBasedOnConfig([node], "one-by-one", eth_switch)
                }

                break;
        }

        // Remove the config connection without adding it to the command stack
        canvas.remove(connection);


        // Hide it AFTER the action was triggered
        $(".custom-menu.mult").hide(100);
        $(document).unbind("mousedown");
        $(".custom-menu.mult li").unbind("click");
    });



    $(".custom-menu.mult").finish().toggle(100).css({
        top: y + "px",
        left: x + "px"
    });
}


var HoverConnection = draw2d.Connection.extend({

    init: function (sourcePort, targetPort) {
        var self = this;
        this._super({
            router: defaultRouter,
            radius: 5,
            source: sourcePort,
            target: targetPort,
            stroke: 3,
            outlineStroke: 1,
            outlineColor: "#303030",
            color: "b9dd69"
        });

        // Show custom configs only for config ports 
        setTimeout(() => {
            if (self.sourcePort.name.includes("config_port")) {
                let canvasOffset = $("#canvas").offset();
                let x = canvasOffset.left + this.start.x - 60 + ((this.end.x - this.start.x) / 2)
                let y = canvasOffset.top + this.start.y + ((this.end.y - this.start.y) / 2)
                showCustomConfigs(x, y, self);
            }
        }, 10);

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
    onContextMenu: function (x, y) {

        $.contextMenu({
            selector: 'body',
            events:
            {
                hide: function () { $.contextMenu('destroy'); }
            },
            callback: function (key, options) {
                switch (key) {
                    case "red":
                        var cmd = new draw2d.command.CommandAttr(this, { color: ColorEnum.red });
                        this.getCanvas().getCommandStack().execute(cmd);

                        break;
                    case "yellow":
                        var cmd = new draw2d.command.CommandAttr(this, { color: ColorEnum.yellow });
                        this.getCanvas().getCommandStack().execute(cmd);
                        break;
                    case "green":
                        var cmd = new draw2d.command.CommandAttr(this, { color: ColorEnum.green });
                        this.getCanvas().getCommandStack().execute(cmd);
                        break;
                    case "blue":
                        var cmd = new draw2d.command.CommandAttr(this, { color: ColorEnum.blue });
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
            x: x,
            y: y,
            items:
            {
                "red": { name: "Red" },
                "yellow": { name: "Yellow" },
                "green": { name: "Green" },
                "blue": { name: "Blue" },
                "sep1": "---------",
                "delete": { name: "Delete" }
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
