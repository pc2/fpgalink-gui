Label = draw2d.shape.basic.Label.extend({
    NAME: "Label",

    ORIENTATION_PROPERTIES: Object.freeze({
        [OrientationEnum.north]: {
            "rotationAngle": 0,
            "padding": { left: 10, top: 5, right: 10, bottom: 5 },
            "locator": new draw2d.layout.locator.BottomLocator(),
        },
        [OrientationEnum.east]: {
            "rotationAngle": -90,
            "padding": { left: 10, top: 5, right: 10, bottom: 5 },
            "locator": new draw2d.layout.locator.RightLocator(),
        },
        [OrientationEnum.south]: {
            "rotationAngle": 0,
            "padding": { left: 10, top: 5, right: 10, bottom: 5 },
            "locator": new draw2d.layout.locator.TopLocator(),
        },
        [OrientationEnum.west]: {
            "rotationAngle": -270,
            "padding": { left: 10, top: 5, right: 10, bottom: 5 },
            "locator": new draw2d.layout.locator.LeftLocator(),
        },
    }),

    init: function (attr) {
        this._super($.extend({
            text: "Label text",
            radius: 4,
            bgColor: "#5b5b5b",
            color: "#5b5b5b",
            fontColor: "white",
            resizeable: true,
        }, attr));


        this.setOrientation(attr.orientation, false);
        this.installEditPolicy(new SelectionMenuPolicy());
        this.installEditor(new draw2d.ui.LabelInplaceEditor());
    },

    setLinksToChannel: function (partner) {
        this.linksToChannel.push(partner);
    },

    getOrientation: function () {
        return this.orientation;
    },


    setOrientation: function (orientation, repaint = true) {
        this.orientation = orientation;
        let prop = this.ORIENTATION_PROPERTIES[orientation];
        this.rotationAngle = prop.rotationAngle;
        this.height = 0;
        this.setPadding(prop.padding);
        if (repaint) {
            this.repaint();
        }
    }
});

