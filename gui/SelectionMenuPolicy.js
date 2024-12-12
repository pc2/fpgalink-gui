// var selectionMenu = {
// 		deleteBtn: {
// 			text: "&#10006;",
// 			css: "overlayMenuItem",
// 			onClick: function() {
// 				let command = new draw2d.command.CommandCollection();
// 				let command_delete = new draw2d.command.CommandDelete(figure);
// 				command.add(command_delete);
//
// 				// Update node names on this delete event.
// 				if(figure instanceof NodeShape) {
// 					var fpganodes = canvas.getFigures();
//
// 					var i = 0;
// 					var num_to_delete = parseInt(figure.getName().substring(1));
// 					for(i = 0; i < fpganodes.getSize(); i++) {
// 							var node = fpganodes.get(i);
// 							var nodeLabel = node.getLabel();
// 							var nodeNum = parseInt(nodeLabel.getText().substring(1));
// 							// Update all nodes that have greater num than the node to delete.
// 							if(num_to_delete < nodeNum) {
// 								// n..
// 								var newnum = nodeNum-1;
//
// 								var newname = "n";
// 								if(newnum < 10) {
// 										newname += "0";
// 								}
// 								newname += newnum;
//
// 								var command_rename = new draw2d.command.CommandAttr(nodeLabel, {text: newname});
//
// 								command.add(command_rename);
// 							}
// 					}
// 				}
//
// 				canvas.getCommandStack().execute(command);
// 			}
// 		}
// }


var SelectionMenuPolicy = draw2d.policy.figure.SelectionPolicy.extend({
	NAME: "SelectionMenuPolicy",

	init: function (attr, setter, getter) {
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
	onSelect: function (canvas, figure, isPrimarySelection) {
		this._super(canvas, figure, isPrimarySelection);

		if (this.overlay === null) {
			this.overlay = $("<div class='overlayMenu'></div>");
			let deleteBtn = $("<div class='overlayMenuItem overlayMenuDeleteItem'>&#10006;</div>");
			let rotateLeftBtn = $("<div class='overlayMenuItem'>&#10226;</div>");
			let rotateRightBtn = $("<div class='overlayMenuItem'>&#10227;</div>");
			let nodeOptions = $("<div class='overlayMenuItem options' style='padding-right: 10px;'>&#8942;</div>");
			let labelOptions = $("<div class='overlayMenuItem options' style='padding-right: 10px;'>&#8942;</div>");

			this.overlay.append(deleteBtn);
			this.overlay.append(rotateLeftBtn);
			this.overlay.append(rotateRightBtn);
			
			if (figure instanceof NodeShape) {
				this.overlay.append(nodeOptions);
			}
			
			if (figure instanceof Label) {
				this.overlay.append(labelOptions);
			}
			
			$("body").append(this.overlay);

			rotateLeftBtn.on("click", function () {
				figure.setOrientation(OrientationEnum.next(figure.getOrientation()));
			});

			rotateRightBtn.on("click", function () {
				figure.setOrientation(OrientationEnum.prev(figure.getOrientation()));
			});

			deleteBtn.on("click", function () {

				var command = new draw2d.command.CommandCollection();

				var command_delete = new draw2d.command.CommandDelete(figure);
				command.add(command_delete);

				// Update node names on this delete event.
				if (figure instanceof NodeShape) {
					var fpganodes = canvas.getFigures();

					var i = 0;
					var num_to_delete = parseInt(figure.getName().substring(1));

					for (i = 0; i < fpganodes.getSize(); i++) {
						var node = fpganodes.get(i);

						if (node.NAME != "NodeShape") {
							continue;
						}

						var nodeLabel = node.getLabel();
						var nodeNum = parseInt(node.getName().substring(1));
						// Update all nodes that have greater num than the node to delete.
						if (num_to_delete < nodeNum) {
							// n..
							var newnum = nodeNum - 1;

							var newname = "Node ";
							if (newnum < 10) {
								newname += "0";
							}
							newname += newnum;

							var command_rename = new draw2d.command.CommandAttr(nodeLabel, { text: newname });

							command.add(command_rename);
						}
					}
				} else if (figure instanceof SwitchShape) {
					var switches = canvas.getFigures();

					var i = 0;
					var num_to_delete = parseInt(figure.getText().split(" ")[2]);
					for (i = 0; i < switches.getSize(); i++) {
						var ethSwitch = switches.get(i);

						if (ethSwitch.NAME != "SwitchShape") {
							continue;
						}

						var ethSwitchNum = parseInt(ethSwitch.getText().split(" ")[2]);
						// Update all Switchs that have greater num than the ethSwitch to delete.
						if (num_to_delete < ethSwitchNum) {
							var newnum = ethSwitchNum - 1;

							var newname = "Ethernet Switch ";
							if (newnum < 10) {
								newname += "0";
							}
							newname += newnum;

							var command_rename = new draw2d.command.CommandAttr(ethSwitch, { text: newname });
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

			nodeOptions.on("click", function(ev) {
				
				// If the document is clicked somewhere
				$(document).bind("mousedown", function (e) {
					// If the clicked element is not the menu, hide the menu
					// and remove the config connection
					if (!$(e.target).parents(".custom-menu.single").length > 0) {
						$(".custom-menu.single").hide(100);
						
						$(document).unbind("mousedown");
						$(".custom-menu.single li").unbind("click");
					}
				});

				// Hide Intel-only configs for Xilinx Nodes
				if (figure.getType() == "Xilinx") {
					$(".custom-menu.single .intel-only").hide();
				} else {
					$(".custom-menu.single .intel-only").show();
				}
			
				// If the menu element is clicked
				$(".custom-menu.single li").one("click", function () {
					// This is the triggered action name

					// Check if the node has any connection and display 
					// a warning message, if accepted, then remove all
					// current connections
					let node_connections = figure.getAllConnections();
					let continueAction = true;

					if (node_connections.length) {
						continueAction = confirm("The current connections will be deleted, do you want to continue?");
					}

					if (!continueAction) return;

					// Delete current connections
					delete_connections(node_connections, canvas);
					
					let action = $(this).attr("data-action");
					switch (action) {
						case "loopback":
							connectBasedOnConfig([figure], "loopback");
							break;
						case "channel":
							connectBasedOnConfig([figure], "channel");
							break;
						case "clear":
							break;
						default:
							app.toolbar.createNodesAndConnections(action, 1, [figure], [])
							break;
					}
			
					// Hide it AFTER the action was triggered
					$(".custom-menu.single").hide(100);
					$(document).unbind("mousedown");
					$(".custom-menu.single li").unbind("click");
				});
			
				let { x, y } = ev.target.getBoundingClientRect();
				$(".custom-menu.single").finish().toggle(100).css({
					top: (y + 30) + "px",
					left: x + "px"
				});
			});

			labelOptions.on("click", function(ev) {
				
				// If the document is clicked somewhere
				$(document).bind("mousedown", function (e) {
					// If the clicked element is not the menu, hide the menu
					if (!$(e.target).parents(".custom-menu.label").length > 0) {
						$(".custom-menu.label").hide(100);
						
						$(document).unbind("mousedown");
						$(".custom-menu.label li").unbind("click");
					}
				});
			
				// If the menu element is clicked
				$(".custom-menu.label li").one("click", function () {
					// This is the triggered action name
					let action = $(this).attr("data-action");
					let color = action.split("-")[1];
					
					// Change background color
					if (action.startsWith("bg")) {
						figure.setBackgroundColor(color);
						figure.setColor(color);
					} else {
						figure.setFontColor(color);
					}
					
					
					
					
					
			
					// Hide it AFTER the action was triggered
					$(".custom-menu.label").hide(100);
					$(document).unbind("mousedown");
					$(".custom-menu.label li").unbind("click");
				});
			
				let { x, y } = ev.target.getBoundingClientRect();
				$(".custom-menu.label").finish().toggle(100).css({
					top: (y + 30) + "px",
					left: x + "px"
				});
			});
		}
		this.posOverlay(figure);
	},


	/**
	 * @method
	 *
	 * @param {draw2d.Canvas} canvas the related canvas
	 * @param {draw2d.Figure} figure the unselected figure
	 */
	onUnselect: function (canvas, figure) {
		this._super(canvas, figure);

		this.overlay.remove();
		this.overlay = null;
	},


	onDrag: function (canvas, figure) {
		this._super(canvas, figure);
		this.posOverlay(figure);
	},

	posOverlay: function (figure) {
		this.overlay.css({
			"top": figure.getAbsoluteY() + 10,
			"left": figure.getAbsoluteX() + figure.getWidth() - this.overlay.width() + 205
		});
	}
});
