
var SelectionMenuPolicy = draw2d.policy.figure.SelectionPolicy.extend({
	NAME: "SelectionMenuPolicy",

    init : function(attr, setter, getter)
    {
		this.overlay = null; // div DOM node

        this._super(attr, setter, getter);
    },

	/**
	 * @method
	 *
	 * @template
	 * @param {draw2d.Canvas} canvas the related canvas
	 * @param {draw2d.Figure} figure the selected figure
	 * @param {boolean} isPrimarySelection
	 */
	onSelect: function(canvas, figure, isPrimarySelection)
	{
		this._super(canvas, figure, isPrimarySelection);

		if (this.overlay === null) {
			this.overlay= $("<div class='overlayMenu'>&#10006;</div>");
			$("body").append(this.overlay);

			this.overlay.on("click",function(){

				var command = new draw2d.command.CommandCollection();
	
				var command_delete = new draw2d.command.CommandDelete(figure);
				command.add(command_delete);
	
				// Update node names on this delete event.
				if(figure instanceof NodeShapeVertical) {
					var fpganodes = canvas.getFigures();
	
					var i = 0;
					var num_to_delete = parseInt(figure.getName().substring(1));
					for(i = 0; i < fpganodes.getSize(); i++) {
							var node = fpganodes.get(i);
							var nodeLabel = node.getLabel();
							var nodeNum = parseInt(nodeLabel.getText().substring(1));
							// Update all nodes that have greater num than the node to delete.
							if(num_to_delete < nodeNum) {
								// n..
								var newnum = nodeNum-1;
				
								var newname = "n";
								if(newnum < 10) {
										newname += "0";
								}
								newname += newnum;
								
								var command_rename = new draw2d.command.CommandAttr(nodeLabel, {text: newname});
		
								command.add(command_rename);
							}
					}
				}
	
				canvas.getCommandStack().execute(command);

				// // use a Command and CommandStack for undo/redo support
				// //
				// var command= new draw2d.command.CommandDelete(figure);
				// canvas.getCommandStack().execute(command);
			})
		}
		this.posOverlay(figure);
	},


	/**
	 * @method
	 *
	 * @param {draw2d.Canvas} canvas the related canvas
	 * @param {draw2d.Figure} figure the unselected figure
	 */
	onUnselect: function(canvas, figure )
	{
		this._super(canvas, figure);

		this.overlay.remove();
		this.overlay=null;
	},


    onDrag: function(canvas, figure)
	{
		this._super(canvas, figure);
		this.posOverlay(figure);
	},

	posOverlay:function(figure)
	{
		this.overlay.css({
			"top":figure.getAbsoluteY()+20,
			"left":figure.getAbsoluteX()+ figure.getWidth()+210
		});
	}
});
