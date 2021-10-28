
const OrientationEnum = Object.freeze({"north":"north", "east":"east", "south":"south", "west":"west"});

ChannelShape = draw2d.shape.basic.Label.extend({
	NAME: "ChannelShape",
	
    init : function(attr) {
    	this._super($.extend({},attr));

        // ch0, ch1, ch2, ch3"
        this.links_to_channel;

        // Shape for view.
        this.connector;
        this.isDrawn = false;
    },

    setLinks_to_channel : function(partner) {
        this.links_to_channel = partner; 
    },

    getLinks_to_channel : function() {
        return this.links_to_channel; 
    },

    setIsDrawn : function(isDrawn) {
        this.isDrawn = isDrawn;
    },

    getIsDrawn : function() {
        return this.isDrawn; 
    },

    setConnector : function(connector) {
        this.connector = connector;
    },

    getConnector : function() {
        return this.connector; 
    }
});

FPGAShapeVertical = draw2d.shape.layout.VerticalLayout.extend({
	NAME: "FPGAShapeVertical",
	
    init : function(attr) {
    	this._super($.extend({bgColor:"#dbddde", color:"#d7d7d7", stroke:0, radius:3},attr));  

        this.nodeLabel = new draw2d.shape.basic.Label({
            text:"aclX",
            stroke:0,
            radius:0,
            bgColor:"#f7f7f7",
            padding:{left:25, top:5, right:25, bottom:5},
            fontColor:"#4a4a4a"
            // resizeable:true,
            // editor:new draw2d.ui.LabelEditor()
        });
            
        this.add(this.nodeLabel);

        // Children links.
        // this.channels = [];
    },

    addChannel : function() {
        // addChannel : function(fpgashapeVertical, string_channel) {
        var channelshape = new ChannelShape({
            text:"ch"+(this.getChildren().getSize()-1),
            stroke:0,
            radius:0,
            bgColor:null,
            padding:{left:25, top:3, right:27, bottom:5},
            fontColor:"#4a4a4a"
            // resizeable:true,
            // editor:new draw2d.ui.LabelEditor()
        });
    
        // Add channel.
        var port_locator;
        switch (this.getParent().getOrientation()) {
            case OrientationEnum.north:
                port_locator = new draw2d.layout.locator.TopLocator();
                break;
            case OrientationEnum.east:
                port_locator = new draw2d.layout.locator.RightLocator();
                break;
            case OrientationEnum.south:
                port_locator = new draw2d.layout.locator.BottomLocator();
                break;
            case OrientationEnum.west:
                port_locator = new draw2d.layout.locator.LeftLocator();
                break;
            default:
                port_locator = new draw2d.layout.locator.RightLocator();
                break;
        }
        var port = channelshape.createPort("hybrid", port_locator);

        port.setName("inout_"+channelshape.id);

        port.setMaxFanOut(1);

        var show = function(){this.setVisible(true);};
        var hide = function(){this.setVisible(false);};

        port.on("connect", hide, port);
        port.on("disconnect", show, port);
        
        // Add to model.
        // this.channels.push(channelshape);

        // Add to view.
        this.add(channelshape);

        // Add to map.
        // TODO: port map
        // fpganodes.addPort("inout_"+channelshape.id, linkdata);

        // Triggered if connected.
        // port.on("connect", function(emitterPort, connection) {
        //     // Skip if target undefined.
        //     // if (typeof connection.connection.targetPort !== 'undefined') {
        //     if (connection.connection.targetPort) {
        //         var channel = fpganodes.getPort(connection.connection.sourcePort.name);
        //         var channel_partner = fpganodes.getPort(connection.connection.targetPort.name);

        //         // Connect them.
        //         channel.setLinks_to_channel(channel_partner);
        //         channel_partner.setLinks_to_channel(channel);
        //     }
        // });

        return channelshape;
    },

    getChannelFromFpgalink : function(string_channel) {
        // ch0, ch1, ch2, ch3"
        // n00, ..
        var num = parseInt(string_channel.substring(2));

        return this.getChildren().get(num+1);
    },

    /**
     * @method
     * Set the name of the DB table. Visually it is the header of the shape
     * 
     * @param name
     */
    setName: function(name)
    {
        this.nodeLabel.setText(name);
        
        return this;
    },

    getName: function() {
        return this.nodeLabel.getText();
    },

    getLabel : function() {
        return this.nodeLabel;
    }

});

// Visualization of Node.
NodeShapeVertical = draw2d.shape.layout.VerticalLayout.extend({

	NAME: "NodeShapeVertical",

    init : function(attr)
    {
        
    	this._super($.extend({bgColor:"#dbddde", color:"#d7d7d7", stroke:0, radius:3},attr));  

        this.installEditPolicy(new SelectionMenuPolicy());

        // this.header = new draw2d.shape.layout.HorizontalLayout({
        //     stroke: 0,
        //     radius: 0,
        //     bgColor: "#1E90FF"
        // });

        this.nodeLabel = new draw2d.shape.basic.Label({
            text:"Node", 
            stroke:1,
            fontColor:"#000",  
            bgColor:"#1E90FF", 
            radius: this.getRadius(), 
            padding:{left:25, right:25}
            // resizeable:true,
            // editor:new draw2d.ui.LabelInplaceEditor()
        });
            
        this.add(this.nodeLabel);
        // this.header.add(this.nodeLabel);     

        // var img1 = new draw2d.shape.icon.Contract({ minWidth:20, minHeight:20, width:20, height:20});
        // var img2 = new draw2d.shape.icon.Expand({  minWidth:20, minHeight:20, width:20, height:20, visible:false });

        // var toggle=function() {
        //     // FPGAShapeVertical
		//     var fpga0 = this.getChildren().get(1);
		//     var fpga1 = this.getChildren().get(2);

        //     fpga0.portRelayoutRequired=true;
        //     fpga1.portRelayoutRequired=true;

		//     fpga0.setVisible(!fpga0.isVisible());
		//     fpga1.setVisible(!fpga1.isVisible());

        //     fpga0.portRelayoutRequired=true;
        //     fpga0.layoutPorts();

        //     fpga1.portRelayoutRequired=true;
        //     fpga1.layoutPorts();

        //     img1.setVisible(!img1.isVisible());
        //     img2.setVisible(!img2.isVisible());
        // }.bind(this);
        
        // img1.on("click",toggle);
        // img2.on("click",toggle);
        // this.nodeLabel.on("click",toggle);
        // img1.addCssClass("pointer");
        // img2.addCssClass("pointer");
        // this.header.add(img1);
        // this.header.add(img2);

        // this.add(this.header);

        // this.on("removed", function(emitter, obj) {
        // });
    },

 
    addFPGA : function(string_acl) {
        var fpgalabel = new FPGAShapeVertical();
        
        fpgalabel.setName(string_acl);

        // Add to view.
        this.add(fpgalabel);

        // Add channel to fpga.
        var i = 0;
        for(i = 0; i<4; i++) {
            fpgalabel.addChannel();
        }

        return fpgalabel;
    },

    setOrientation : function(orientation) {
        // Set orientation: east or west.
        this.orientation = orientation;
    },

    getOrientation : function() {
        return this.orientation;
    },

    getFPGAFromFpgalink : function(string_acl) {
        // acl0 = FPGA 0
        // acl1 = FPGA 1
        if(string_acl == "acl0") {
            return this.getChildren().get(1);
        } else if (string_acl == "acl1") {
            return this.getChildren().get(2);
        } else {
            alert("getFPGAFromFpgalink fails with input \""+string_acl+"\"");
            return ;
        }
    },

    /**
     * @method
     * Add an entity to the db shape
     * 
     * @param {String} txt the label to show
     * @param {Number} [optionalIndex] index where to insert the entity
     */
     addEntity: function(txt)
     {
        var label = new draw2d.shape.basic.Label({
            text:txt,
            stroke:0,
            radius:0,
            bgColor:null,
            padding:{left:10, top:3, right:10, bottom:5},
            fontColor:"#4a4a4a"
            // resizeable:true,
            // editor:new draw2d.ui.LabelEditor()
        });
 
        var input = label.createPort("input");
        var output= label.createPort("output");
        
        input.setName("input_"+label.id);
        output.setName("output_"+label.id);
                
        this.add(label);

        return label;
     },

//     /**
//      * @method
//      * Add an entity to the db shape
//      * 
//      * @param {String} txt the label to show
//      * @param {Number} [optionalIndex] index where to insert the entity
//      */
//     addEntity: function(txt, optionalIndex)
//     {
// 	   	 var label = new draw2d.shape.basic.Label({
// 	   	     text:txt,
// 	   	     stroke:0,
// 	   	     radius:0,
// 	   	     bgColor:null,
// 	   	     padding:{left:10, top:3, right:10, bottom:5},
// 	   	     fontColor:"#4a4a4a",
// 	   	     resizeable:true,
//              editor:new draw2d.ui.LabelEditor()
// 	   	 });

// //        label.installEditor(new draw2d.ui.LabelEditor());
// 	     var input = label.createPort("input");
// 	     var output= label.createPort("output");
	     
//          input.setName("input_"+label.id);
//          output.setName("output_"+label.id);
         
//          var _table=this;
//          label.on("contextmenu", function(emitter, event){
//              $.contextMenu({
//                  selector: 'body', 
//                  events:
//                  {  
//                      hide:function(){ $.contextMenu( 'destroy' ); }
//                  },
//                  callback: $.proxy(function(key, options) 
//                  {
//                     switch(key){
//                     case "rename":
//                         setTimeout(function(){
//                             emitter.onDoubleClick();
//                         },10);
//                         break;
//                     case "new":
//                         setTimeout(function(){
//                             _table.addEntity("_new_").onDoubleClick();
//                         },10);
//                         break;
//                     case "delete":
//                         // with undo/redo support
//                         var cmd = new draw2d.command.CommandDelete(emitter);
//                         emitter.getCanvas().getCommandStack().execute(cmd);
//                     default:
//                         break;
//                     }
                 
//                  },this),
//                  x:event.x,
//                  y:event.y,
//                  items: 
//                  {
//                      "rename": {name: "Rename"},
//                      "new":    {name: "New Entity"},
//                      "sep1":   "---------",
//                      "delete": {name: "Delete"}
//                  }
//              });
//          });
         
// 	     if($.isNumeric(optionalIndex)){
//              this.add(label, null, optionalIndex+1);
// 	     }
// 	     else{
// 	         this.add(label);
// 	     }

// 	     return label;
//     },
    
    /**
     * @method
     * Remove the entity with the given index from the DB table shape.<br>
     * This method removes the entity without care of existing connections. Use
     * a draw2d.command.CommandDelete command if you want to delete the connections to this entity too
     * 
     * @param {Number} index the index of the entity to remove
     */
    removeEntity: function(index)
    {
        this.remove(this.children.get(index+1).figure);
    },

    /**
     * @method
     * Returns the entity figure with the given index
     * 
     * @param {Number} index the index of the entity to return
     */
    getEntity: function(index)
    {
        return this.children.get(index+1).figure;
    },
     

     /**
      * @method
      * Set the name of the DB table. Visually it is the header of the shape
      * 
      * @param name
      */
     setName: function(name)
     {
         this.nodeLabel.setText(name);
         
         return this;
     },

     getName: function() {
         return this.nodeLabel.getText();
     },

     getLabel : function() {
        return this.nodeLabel;
     },
     
     /**
      * @method 
      * Return an objects with all important attributes for XML or JSON serialization
      * 
      * @returns {Object}
      */
     getPersistentAttributes : function()
     {
        // alert("getPersistentAttributes called");

        var memento = this._super();

        memento.name = this.nodeLabel.getText();
        memento.entities = [];

        this.children.each(function(i,e) {
            
            if(i>0){ // skip the header of the figure
                memento.entities.push({
                    text:e.figure.getText(),
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
     setPersistentAttributes : function(memento)
     {
        // alert("setPersistentAttributes called");

         this._super(memento);
         
         this.setName(memento.name);

         if(typeof memento.entities !== "undefined"){
             $.each(memento.entities, $.proxy(function(i,e){
                 var entity =this.addEntity(e.text);
                 entity.id = e.id;
                 entity.getInputPort(0).setName("input_"+e.id);
                 entity.getOutputPort(0).setName("output_"+e.id);
             },this));
         }

         return this;
     }

});
