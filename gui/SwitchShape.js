// 
SwitchShape = draw2d.shape.basic.Label.extend({
    NAME: "SwitchShape",

    ORIENTATION_PROPERTIES: Object.freeze({
        [OrientationEnum.north]: {
            "rotationAngle": 0,
            "padding": { left: 25, top: 5, right: 25, bottom: 5 },
            "locator": new draw2d.layout.locator.BottomLocator(),
        },
        [OrientationEnum.east]: {
            "rotationAngle": 0,
            "padding": { left: 25, top: 5, right: 25, bottom: 5 },
            "locator": new draw2d.layout.locator.RightLocator(),
        },
        [OrientationEnum.south]: {
            "rotationAngle": 0,
            "padding": { left: 25, top: 5, right: 25, bottom: 5 },
            "locator": new draw2d.layout.locator.TopLocator(),
        },
        [OrientationEnum.west]: {
            "rotationAngle": 0,
            "padding": { left: 25, top: 5, right: 25, bottom: 5 },
            "locator": new draw2d.layout.locator.LeftLocator(),
        },
    }),

    init: function (attr) {
        this._super($.extend({}, attr));
        
        this.setText("Ethernet Switch");

        // Allows multiple connections. 
        this.linksToChannel = [];

        // Shape for view.
        this.connector;
        this.isDrawn = false;
        let port = this.createPort("hybrid");
        port.setName("inout_" + this.id);
        // port.setMaxFanOut(1);
        // port.on("connect", function () {
        //     this.setVisible(false);
        // }, port);
        // port.on("disconnect", function () {
        //     this.setVisible(true);
        // }, port);

        // this.orientation = attr.orientation;
        this.setOrientation(attr.orientation, false);
        // this.getFPGA().channelLayout.add(this);
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

    getOrientation: function () {
        return this.orientation;
    },

    setOrientation: function (orientation, repaint = true) {
        this.orientation = orientation;
        let prop = this.ORIENTATION_PROPERTIES[orientation];
        this.getHybridPort(0).setLocator(prop.locator);
        this.rotationAngle = prop.rotationAngle;
        this.height = 0;
        this.setPadding(prop.padding);

        if (repaint) {
            this.repaint();
        }
    }
});

