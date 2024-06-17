const OrientationEnum = Object.freeze({
    "north": "north",
    "east": "east",
    "south": "south",
    "west": "west",
    "next": function (orientation) {
        return {
            [OrientationEnum.north]: OrientationEnum.east,
            [OrientationEnum.east]: OrientationEnum.south,
            [OrientationEnum.south]: OrientationEnum.west,
            [OrientationEnum.west]: OrientationEnum.north
        }[orientation]
    },
    "prev": function (orientation) {
        return {
            [OrientationEnum.north]: OrientationEnum.west,
            [OrientationEnum.west]: OrientationEnum.south,
            [OrientationEnum.south]: OrientationEnum.east,
            [OrientationEnum.east]: OrientationEnum.north
        }[orientation]
    }
});

const NodeTypeEnum = Object.freeze({
    "intel": "intel",
    "xilinx": "xilinx"
});

//Gray rectangel
ChannelShape = draw2d.shape.basic.Label.extend({
    NAME: "ChannelShape",
    ORIENTATION_PROPERTIES: function (isSibling) {
        return {
            [OrientationEnum.north]: {
                "rotationAngle": -90,
                "padding": isSibling ? { left: 5, top: 25, right: 5, bottom: 25 } : { left: 20, top: 25, right: 5, bottom: 25 },
                "locator": new draw2d.layout.locator.BottomLocator(),
            },
            [OrientationEnum.east]: {
                "rotationAngle": 0,
                "padding": isSibling ? { left: 25, top: 10, right: 25, bottom: 10 } : { left: 27, top: 0, right: 25, bottom: 5 },
                "locator": new draw2d.layout.locator.RightLocator(),
            },
            [OrientationEnum.south]: {
                "rotationAngle": -90,
                "padding": isSibling ? { left: 5, top: 25, right: 5, bottom: 25 } : { left: 20, top: 25, right: 5, bottom: 25 },
                "locator": new draw2d.layout.locator.TopLocator(),
            },
            [OrientationEnum.west]: {
                "rotationAngle": 0,
                "padding": isSibling ? { left: 25, top: 10, right: 25, bottom: 10 } : { left: 27, top: 0, right: 25, bottom: 5 },
                "locator": new draw2d.layout.locator.LeftLocator(),
            },
        }
    },

    init: function (attr) {
        let self = this
        this._super($.extend({}, attr));
        this.parentFPGA = attr.parentFPGA;

        // ch0, ch1, ch2, ch3"
        this.linksToChannel;

        // Shape for view.
        this.connector;
        this.isDrawn = false;

        let siblingChannel = attr.siblingChannel
        this.siblingChannel = siblingChannel

        let port = this.createPort("hybrid");
        port.setName("inout_" + this.id);
        port.setMaxFanOut(1);
        if (siblingChannel) port.siblingChannel = siblingChannel

        port.on("connect", function () {
            this.setVisible(false);
            if (siblingChannel) siblingChannel.setVisible(false)
        }, port)
        port.on("disconnect", function () {
            this.setVisible(true);
            let portClass = this
            if (siblingChannel) {
                siblingChannel.setVisible(false)
                if (portClass.siblingChannel.getHybridPort(0).connections.data.length) {
                    setTimeout(() => {
                        if (portClass.connections.data?.[0]?.sourcePort != portClass) {
                            let chnl1 = portClass.parent
                            let chnl2 = portClass.siblingChannel.getHybridPort(0).connections.data[0]?.sourcePort.parent

                            let connection = portClass.siblingChannel.getHybridPort(0).connections.data[0]

                            if (connection) {
                                var cmd = new draw2d.command.CommandDelete(connection);
                                connection.getCanvas().getCommandStack().execute(cmd);
                                app.toolbar.connectChannels(chnl1, chnl2)
                            }
                        }
                    }, 10)
                }
            }
            else self.setVisible(false)
        }, port);


        port.on("dragstart", function (e) {
            if (siblingChannel) {
                siblingChannel.setVisible(true)
                siblingChannel.setVisible(true)
            }
        }, port);
        port.on("dragend", function () {
            if (siblingChannel) siblingChannel.setVisible(false)
        }, port);

        // this.orientation = attr.orientation;
        this.setOrientation(attr.orientation, false);
        // this.getFPGA().channelLayout.add(this);
    },

    setLinksToChannel: function (partner) {
        this.linksToChannel = partner;
    },

    getLinksToChannel: function () {
        return this.linksToChannel;
    },

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

    getFPGA: function () {
        return this.getParent().getParent();
    },

    getOrientation: function () {
        return this.orientation;
    },

    setOrientation: function (orientation, repaint = true) {
        this.orientation = orientation;
        let prop = this.ORIENTATION_PROPERTIES(this.siblingChannel)[orientation];
        this.getHybridPort(0).setLocator(prop.locator);
        this.rotationAngle = prop.rotationAngle;
        this.height = 0;
        this.setPadding(prop.padding);
        if (repaint) {
            this.repaint();
        }
    }
});

// white rectangel class
FPGAShape = draw2d.shape.layout.FlexGridLayout.extend({
    NAME: "FPGAShape",

    ORIENTATION_PROPERTIES: Object.freeze({
        [OrientationEnum.north]: {
            // labelPadding: {left: 50, top: 5, right: 25, bottom: 5},
            labelRow: 0,
            channelLayoutRow: 1,
            arrangement: ["row", "col"],
        },
        [OrientationEnum.east]: {
            // labelPadding: {left: 25, top: 5, right: 25, bottom: 5},
            labelRow: 0,
            channelLayoutRow: 1,
            arrangement: ["col", "row"],
        },
        [OrientationEnum.south]: {
            // labelPadding: {left: 50, top: 5, right: 25, bottom: 5},
            labelRow: 1,
            channelLayoutRow: 0,
            arrangement: ["row", "col"],
        },
        [OrientationEnum.west]: {
            // labelPadding: {left: 25, top: 5, right: 25, bottom: 5},
            labelRow: 0,
            channelLayoutRow: 1,
            arrangement: ["col", "row"],
        },
    }),

    init: function (attr) {
        this._super($.extend({
            bgColor: "#dbddde",
            color: "#d7d7d7",
            stroke: 0,
            radius: 3,
            rows: "grow, grow",
            columns: "grow"
        }, attr));

        this.fpgaLabel = new draw2d.shape.basic.Label({
            text: attr.name,
            stroke: 0,
            radius: 0,
            bgColor: "#f7f7f7",
            fontColor: "#4a4a4a",
            resizeable: true,
            // editor:new draw2d.ui.LabelEditor()
        });

        this.channelLayout = new draw2d.shape.layout.FlexGridLayout({
            rows: "grow",
            columns: "grow"
        });

        let prop = this.ORIENTATION_PROPERTIES[attr.orientation];
        this.add(this.fpgaLabel, { col: 0, row: prop.labelRow });
        this.add(this.channelLayout, { col: 0, row: prop.channelLayoutRow });
        this.orientation = attr.orientation;

        // Children links.
        // this.channels = [];
        for (let i = 0; i < attr.channelsCount; i++) {
            this.addChannel(i);
        }

        // this.getNode().fpgaLayout.add(this, this.getNode().fpgaLayout);
    },

    addChannel: function (i) {
        orientation = this.getOrientation();
        let prop = this.ORIENTATION_PROPERTIES[orientation];
        let channel = new ChannelShape({
            text: "Channel" + i,
            stroke: 0,
            radius: 0,
            bgColor: null,
            // padding:{left:25, top:3, right:27, bottom:5},
            fontColor: "#4a4a4a",
            // resizeable:true,
            // editor:new draw2d.ui.LabelEditor()
            orientation: this.orientation,
            visible: false
        });


        this.channelLayout.add(channel, {
            [prop.arrangement[0]]: 0,
            [prop.arrangement[1]]: i
        });

        let channel2 = new ChannelShape({
            text: "Channel" + i,
            stroke: 1,
            radius: 0,
            bgColor: null,
            // padding:{left:25, top:3, right:27, bottom:5},
            fontColor: "#4a4a4a",
            // resizeable:true,
            // editor:new draw2d.ui.LabelEditor()
            orientation: this.orientation,
            siblingChannel: channel
        });

        this.channelLayout.add(channel2, {
            [prop.arrangement[0]]: 0,
            [prop.arrangement[1]]: i
        });



        if (this.getChannels().getSize() > 0) {
            let gridDef = this.channelLayout.gridDef;
            gridDef[`def_${prop.arrangement[1]}s`].push(-1);
        }

        return channel;
    },

    getChannels: function () {
        return this.channelLayout.getChildren();
    },

    getChannelFromFpgalink: function (string_channel, isSibling) {
        // ch0, ch1, ch2, ch3"
        // n00, ..
        
        var num = parseInt(string_channel.substring(2)) * 2 + (isSibling ? 0 : 1);
        return this.getChildren().get(1).getChildren().get(num);
    },

    /**
     * @method
     * Set the name of the DB table. Visually it is the header of the shape
     *
     * @param name
     */
    setName: function (name) {
        this.fpgaLabel.setText(name);
        return this;
    },

    getName: function () {
        return this.fpgaLabel.getText();
    },

    getLabel: function () {
        return this.nodeLabel;
    },

    getNode: function () {
        return this.getParent().getParent();
    },

    getOrientation: function () {
        return this.orientation;
    },

    setOrientation: function (orientation, repaint = true) {
        this.orientation = orientation;
        let prop = this.ORIENTATION_PROPERTIES[orientation];
        let gridDef = this.channelLayout.gridDef;
        this.fpgaLabel.__cellConstraint.row = prop.labelRow;
        this.channelLayout.__cellConstraint.row = prop.channelLayoutRow;

        

        gridDef[`def_${prop.arrangement[0]}s`] = Array(1).fill(-1);
        gridDef[`def_${prop.arrangement[1]}s`] = Array(this.getChannels().getSize()).fill(-1);
        this.getChannels().each(function (i, ch) {
            ch.__cellConstraint[prop.arrangement[0]] = 0;
            ch.__cellConstraint[prop.arrangement[1]] = Math.floor(i / 2);
            ch.setOrientation(orientation, false);
        });


        if (repaint) {
            this.gridDef.layoutRequired = true;
            this.relocateChildrenEventCallback();
        }
    }
});

////******************************************************************************** */
// Visualization of Node.
// Blue rectangel
NodeShape = draw2d.shape.layout.FlexGridLayout.extend({
    NAME: "NodeShape",

    ORIENTATION_PROPERTIES: Object.freeze({
        [OrientationEnum.north]: {
            // labelPadding: {left: 100, right: 100},
            labelRow: 0,
            fpgaLayoutRow: 1,
            arrangement: ["row", "col"],
        },
        [OrientationEnum.east]: {
            // labelPadding: {left: 25, right: 25},
            labelRow: 0,
            fpgaLayoutRow: 1,
            arrangement: ["col", "row"],
        },
        [OrientationEnum.south]: {
            // labelPadding: {left: 100, right: 100},
            labelRow: 1,
            fpgaLayoutRow: 0,
            arrangement: ["row", "col"],
        },
        [OrientationEnum.west]: {
            // labelPadding: {left: 25, right: 25},
            labelRow: 0,
            fpgaLayoutRow: 1,
            arrangement: ["col", "row"],
        },
    }),

    init: function (attr) {
        this._super($.extend({
            bgColor: "#dbddde",
            color: "#d7d7d7",
            stroke: 0,
            radius: 3,
            rows: "grow, grow",
            columns: "grow, grow"
        }, attr));

        this.nodeLabel = new draw2d.shape.basic.Label({
            text: "Node",
            stroke: 1,
            fontColor: "#000",
            bgColor: "#1F96FF",
            radius: this.getRadius(),
            // padding:{left:25, right:25},
            resizeable: true,
            // editor:new draw2d.ui.LabelInplaceEditor()
        });

        this.fpgaLayout = new draw2d.shape.layout.FlexGridLayout({
            rows: "grow",
            columns: "grow"
        });

        let orientation = attr == undefined ? OrientationEnum.east : attr.orientation;
        let prop = this.ORIENTATION_PROPERTIES[orientation];
        this.add(this.nodeLabel, { column: 0, row: prop.labelRow });
        this.add(this.fpgaLayout, { column: 0, row: prop.fpgaLayoutRow });

        this.installEditPolicy(new SelectionMenuPolicy());
        this.orientation = orientation;
    },

    addFPGA: function (string_acl, channelsCount) {
        orientation = this.getOrientation();
        let prop = this.ORIENTATION_PROPERTIES[orientation];
        let fpga = new FPGAShape({
            "orientation": this.orientation,
            "name": "FPGA" + string_acl.substring(3),
            "channelsCount": channelsCount
        });

        if (this.getFPGAs().getSize() > 0) {
            let gridDef = this.fpgaLayout.gridDef;
            gridDef[`def_${prop.arrangement[1]}s`].push(-1);
        }

        // this.fpgaLayout._layout();
        this.fpgaLayout.add(fpga, {
            [prop.arrangement[0]]: 0,
            [prop.arrangement[1]]: this.getFPGAs().getSize(),
        });
        return fpga;
    },

    setOrientation: function (orientation, repaint = true) {
        /*
            This uses a trick: sets the column and row of each element and
            redraws the node. Pay attention to `__cellConstraint` and `gridDef`.
            Pro: faster. Con: hacks draw2d and uses private members.
        */
        this.orientation = orientation;
        let prop = this.ORIENTATION_PROPERTIES[orientation];
        let gridDef = this.fpgaLayout.gridDef;
        this.nodeLabel.__cellConstraint.row = prop.labelRow;
        this.fpgaLayout.__cellConstraint.row = prop.fpgaLayoutRow;

        gridDef[`def_${prop.arrangement[0]}s`] = Array(1).fill(-1);
        gridDef[`def_${prop.arrangement[1]}s`] = Array(this.getFPGAs().getSize()).fill(-1);

        this.getFPGAs().each(function (i, fpga) {
            fpga.__cellConstraint[prop.arrangement[0]] = 0;
            fpga.__cellConstraint[prop.arrangement[1]] = i;
            fpga.setOrientation(orientation, false);
        });

        this.height = 0;
        this.width = 0;

        if (repaint) {
            this.gridDef.layoutRequired = true;
            this.relocateChildrenEventCallback();
        }
    },

    getFPGAs: function () {
        return this.fpgaLayout.getChildren();
    },

    getOrientation: function () {
        return this.orientation;
    },

    getFPGAFromFpgalink: function (string_acl) {
        // acl0 = FPGA 0
        // acl1 = FPGA 1
        if (string_acl == "acl0") {
            return this.getChildren().get(1).getChildren().get(0);
        } else if (string_acl == "acl1") {
            return this.getChildren().get(1).getChildren().get(1);
        } else if (string_acl == "acl2") {
            return this.getChildren().get(1).getChildren().get(2);
        } else {
            alert("getFPGAFromFpgalink fails with input \"" + string_acl + "\"");
            return;
        }
    },

    /**
     * @method
     * Add an entity to the db shape
     *
     * @param {String} txt the label to show
     * @param {Number} [optionalIndex] index where to insert the entity
     */
    addEntity: function (txt) {
        var label = new draw2d.shape.basic.Label({
            text: txt,
            stroke: 0,
            radius: 0,
            bgColor: null,
            padding: { left: 15, top: 3, right: 15, bottom: 5 },
            fontColor: "#4a4a4a"
            // resizeable:true,
            // editor:new draw2d.ui.LabelEditor()
        });

        var input = label.createPort("input");
        var output = label.createPort("output");

        input.setName("input_" + label.id);
        output.setName("output_" + label.id);

        this.add(label);

        return label;
    },

    /**
     * @method
     * Remove the entity with the given index from the DB table shape.<br>
     * This method removes the entity without care of existing connections. Use
     * a draw2d.command.CommandDelete command if you want to delete the connections to this entity too
     *
     * @param {Number} index the index of the entity to remove
     */
    removeEntity: function (index) {
        this.remove(this.children.get(index + 1).figure);
    },

    /**
     * @method
     * Returns the entity figure with the given index
     *
     * @param {Number} index the index of the entity to return
     */
    getEntity: function (index) {
        return this.children.get(index + 1).figure;
    },


    /**
     * @method
     * Set the name of the DB table. Visually it is the header of the shape
     *
     * @param name
     */
    setName: function (name) {
        this.nodeLabel.setText(name);

        return this;
    },

    getName: function () {
        return "n" + this.nodeLabel.getText().substring(4);
    },

    getLabel: function () {
        return this.nodeLabel;
    },

    /**
     * @method
     * Return an objects with all important attributes for XML or JSON serialization
     *
     * @returns {Object}
     */
    getPersistentAttributes: function () {
        // alert("getPersistentAttributes called");

        var memento = this._super();

        memento.name = this.nodeLabel.getText();
        memento.entities = [];

        this.children.each(function (i, e) {

            if (i > 0) { // skip the header of the figure
                memento.entities.push({
                    text: e.figure.getText(),
                    id: e.figure.id
                });
            }
        });

        return memento;
    },

    /**
     * @method
     * Read all attributes from the serialized properties and transfer them into the shape.
     *
     * @param {Object} memento
     * @return
     */
    setPersistentAttributes: function (memento) {
        // alert("setPersistentAttributes called");

        this._super(memento);

        this.setName(memento.name);

        if (typeof memento.entities !== "undefined") {
            $.each(memento.entities, $.proxy(function (i, e) {
                var entity = this.addEntity(e.text);
                entity.id = e.id;
                entity.getInputPort(0).setName("input_" + e.id);
                entity.getOutputPort(0).setName("output_" + e.id);
            }, this));
        }

        return this;
    }
});
