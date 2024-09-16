SwitchShape = draw2d.shape.basic.Label.extend({
    NAME: "SwitchShape",

    ORIENTATION_PROPERTIES: Object.freeze({
        [OrientationEnum.north]: {
            "rotationAngle": 0,
            "padding": { left: 40, top: 5, right: 40, bottom: 5 },
            "locator": new draw2d.layout.locator.BottomLocator(),
        },
        [OrientationEnum.east]: {
            "rotationAngle": -90,
            "padding": { left: 40, top: 5, right: 40, bottom: 5 },
            "locator": new draw2d.layout.locator.RightLocator(),
        },
        [OrientationEnum.south]: {
            "rotationAngle": 0,
            "padding": { left: 40, top: 5, right: 40, bottom: 5 },
            "locator": new draw2d.layout.locator.TopLocator(),
        },
        [OrientationEnum.west]: {
            "rotationAngle": -270,
            "padding": { left: 40, top: 5, right: 40, bottom: 5 },
            "locator": new draw2d.layout.locator.LeftLocator(),
        },
    }),

    init: function (attr) {
        this._super($.extend({}, attr));

        // Allows multiple connections. 
        this.linksToChannel = [];

        // Shape for view.
        this.connector;
        this.isDrawn = false;

    
        // Create 8 normal ports
        for (let i = 0; i < 8; i++) {
            let port = this.createPort("hybrid");
            port.setName(`inout_${i}` + this.id);

            port.on("dragstart", function (e) {
                toggle_config_ports(app.view.figures.data, false);
            }, port);

            port.on("dragend", function (e) {
                toggle_config_ports(app.view.figures.data, true);
            }, port);
        }

        // Create config port
        let config_port = this.createPort("hybrid");
        config_port.setName(`config_port_` + this.id);
        config_port.setBackgroundColor("#00FF00");
        config_port.setColor("#000000");

        config_port.on("dragstart", function (e) {
            toggle_non_config_ports(app.view.figures.data, "hide", "Switch");
        }, config_port);

        config_port.on("dragend", function (e) {
            toggle_non_config_ports(app.view.figures.data, "show", "Switch");
        }, config_port);




        this.setOrientation(attr.orientation, false);
        this.installEditPolicy(new SelectionMenuPolicy());
    },

    setLinksToChannel: function (partner) {
        this.linksToChannel.push(partner);
    },

    // TODO: update to array structure of switch.
    // getLinksToChannel: function () {
    //     return this.linksToChannel;
    // },

    setIsDrawn: function (isDrawn) {
        this.isDrawn = isDrawn;
    },

    getIsDrawn: function () {
        return this.isDrawn;
    },

    setConnector: function (connector) {
        this.connector = connector;
    },

    getConnector: function () {
        return this.connector;
    },

    getAllConnections: function () {
        let connections = [];

        let ports = this.hybridPorts.data;
        // -1 is to skip last port which is the config port
        for (let i = 0; i < ports.length - 1; i++) {
            const p = ports[i];
            connections.push(...p.connections.data);
        }

        return connections;
    },

    getName: function() {
        return "eth" + this.getText().substr(-2);
    },

    getOrientation: function () {
        return this.orientation;
    },

    setPortLocator: function (original_port, port, coordinates) {
        
        var originalLocator = this.getHybridPort(original_port).getLocator();
        var CustomLocator = draw2d.layout.locator.Locator.extend({
            init: function () {
                this._super();
            },

            relocate: function (index, target) {
                originalLocator.relocate(index, target);

                var x = target.getX() + coordinates.x ?? 0;
                var y = target.getY() + coordinates.y ?? 0;

                target.setPosition(x, y);
            }
        });
        let orientationToDirection = {
            "south": 0,
            "east": 1,
            "north": 2,
            "west": 3,
        }
        port.setConnectionDirection(orientationToDirection[this.getOrientation()]);
        port.setLocator(new CustomLocator());
    },

    setOrientation: function (orientation, repaint = true) {
        this.orientation = orientation;
        let prop = this.ORIENTATION_PROPERTIES[orientation];
        let self = this;

        function setAllPortsLocator(flipCoord) {
            let c1 = flipCoord ? 'x' : 'y';
            let c2 = flipCoord ? 'y' : 'x';
            self.setPortLocator(0, self.getHybridPort(1), { [c1]: 20, [c2]: 0 });
            self.setPortLocator(0, self.getHybridPort(2), { [c1]: 40, [c2]: 0 });
            self.setPortLocator(0, self.getHybridPort(3), { [c1]: 60, [c2]: 0 });
            self.setPortLocator(0, self.getHybridPort(4), { [c1]: 80, [c2]: 0 });
            self.setPortLocator(0, self.getHybridPort(5), { [c1]: 100, [c2]: 0 });
            self.setPortLocator(0, self.getHybridPort(6), { [c1]: 120, [c2]: 0 });
            self.setPortLocator(0, self.getHybridPort(7), { [c1]: 140, [c2]: 0 });
        }

        this.getHybridPort(0).setLocator(prop.locator);
        if (this.orientation == OrientationEnum.north || this.orientation == OrientationEnum.south) {
            this.setPortLocator(0, this.getHybridPort(0), { x: -70, y: 0 });
            setAllPortsLocator(true);
        } else if (this.orientation == OrientationEnum.east) {
            this.setPortLocator(0, this.getHybridPort(0), { x: -77, y: -70 });
            setAllPortsLocator(false);
        } else if (this.orientation == OrientationEnum.west) {
            this.setPortLocator(0, this.getHybridPort(0), { x: 77, y: -70 });
            setAllPortsLocator(false);
        }

        this.setRotationAngle(prop.rotationAngle);
        this.height = 0;
        this.setPadding(prop.padding);

        if (repaint) {
            this.repaint();
        }
    }
});

