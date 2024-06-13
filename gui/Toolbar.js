
example.Toolbar = Class.extend({

	init: function (elementId, app, view) {
		this.html = $("#" + elementId);
		this.view = view;

		// register this class as event listener for the canvas
		// CommandStack. This is required to update the state of
		// the Undo/Redo Buttons.
		//
		view.getCommandStack().addEventListener(this);

		// Register a Selection listener for the state handling
		// of the Delete Button
		//
		view.on("select", $.proxy(this.onSelectionChanged, this));

		// Inject the UNDO Button and the callbacks
		//
		this.undoButton = $("<button>Undo</button>");
		this.html.append(this.undoButton);
		this.undoButton.button().click($.proxy(function () {
			this.view.getCommandStack().undo();
			// console.log(this.view);
		}, this)).button("option", "disabled", true);

		// Inject the REDO Button and the callback
		//
		this.redoButton = $("<button>Redo</button>");
		this.html.append(this.redoButton);
		this.redoButton.button().click($.proxy(function () {
			this.view.getCommandStack().redo();
		}, this)).button("option", "disabled", true);

		this.delimiter = $("<span class='toolbar_delimiter'>&nbsp;</span>");
		this.html.append(this.delimiter);

		// // Inject the DELETE Button
		// //
		// this.deleteButton  = $("<button>Delete</button>");
		// this.html.append(this.deleteButton);
		// this.deleteButton.button().click($.proxy(function() {
		// 	var command = new draw2d.command.CommandCollection();
		// 	var element_to_delete = this.view.getPrimarySelection();

		// 	var command_delete = new draw2d.command.CommandDelete(element_to_delete);
		// 	command.add(command_delete);

		// 	// Update node names on this delete event.
		// 	if(element_to_delete instanceof NodeShapeVertical) {
		// 		var fpganodes = view.getFigures();

		// 		var i = 0;
		// 		var num_to_delete = parseInt(element_to_delete.getName().substring(1));
		// 		for(i = 0; i < fpganodes.getSize(); i++) {
		// 				var node = fpganodes.get(i);
		// 				var nodeLabel = node.getLabel();
		// 				var nodeNum = parseInt(nodeLabel.getText().substring(1));
		// 				// Update all nodes that have greater num than the node to delete.
		// 				if(num_to_delete < nodeNum) {
		// 					// n..
		// 					var newnum = nodeNum-1;

		// 					var newname = "n";
		// 					if(newnum < 10) {
		// 							newname += "0";
		// 					}
		// 					newname += newnum;

		// 					var command_rename = new draw2d.command.CommandAttr(nodeLabel, {text: newname});

		// 					command.add(command_rename);
		// 				}
		// 		}
		// 	}

		// 	this.view.getCommandStack().execute(command);

		// },this)).button( "option", "disabled", true );

		// this.delimiter  = $("<span class='toolbar_delimiter'>&nbsp;</span>");
		// this.html.append(this.delimiter);

		// Inject the SRUN Button
		//
		this.srunImportIntelButton = $("<button>IMPORT INTEL</button>");
		this.html.append(this.srunImportIntelButton);
		this.srunImportIntelButton.button().click($.proxy(function () {
			var srun_raw = prompt("Enter command, f.e. srun", "FPGALINK0=n2fpga03:acl1:ch0-n2fpga03:acl1:ch1  FPGALINK1=n2fpga02:acl0:ch0-n2fpga02:acl0:ch1  FPGALINK2=n2fpga02:acl0:ch2-n2fpga02:acl0:ch3  FPGALINK3=n2fpga03:acl1:ch2-n2fpga03:acl1:ch3");

			this.srunApply(srun_raw, NodeTypeEnum.intel);

		}, this)).button("option", "enabled", true);

		this.srunImportXilinxButton = $("<button>IMPORT XILINX</button>");
		this.html.append(this.srunImportXilinxButton);
		this.srunImportXilinxButton.button().click($.proxy(function () {
			var srun_raw = prompt("Enter command, f.e. srun", " -N 2 --fpgalink=n01:acl1:ch1-n00:acl2:ch1 --fpgalink=n01:acl2:ch0-n01:acl2:ch1 --fpgalink=n00:acl1:ch0-n00:acl1:ch1 --fpgalink=n01:acl0:ch0-n01:acl0:ch1 --fpgalink=n00:acl0:ch0-n01:acl1:ch0 --fpgalink=n00:acl0:ch1-n00:acl2:ch0");

			this.srunApply(srun_raw, NodeTypeEnum.xilinx);

		}, this)).button("option", "enabled", true);


		this.delimiter = $("<span class='toolbar_delimiter'>&nbsp;</span>");
		this.html.append(this.delimiter);

		// Inject the srun EXPORT Button
		//
		this.srunExportInput = $("<input type=\"text\" size=\"4\" value=\"\" id=\"srunExportInput\">");
		this.html.append(this.srunExportInput);
		this.srunExportButton = $("<button>Copy --fpgalink</button>");
		this.html.append(this.srunExportButton);
		this.srunExportButton.button().click($.proxy(function () {

			var copyText = document.getElementById("srunExportInput");
			copyText.select();
			copyText.setSelectionRange(0, 99999)
			document.execCommand("copy");
		}, this)).button("option", "enabled", true);

		this.delimiter = $("<span class='toolbar_delimiter'>&nbsp;</span>");
		this.html.append(this.delimiter);

		// Inject the url EXPORT Button
		//
		this.urlExportInput = $("<input type=\"text\" size=\"4\" value=\"\" id=\"urlExportInput\">");
		this.html.append(this.urlExportInput);
		this.urlExportButton = $("<button>Copy URL</button>");
		this.html.append(this.urlExportButton);
		this.urlExportButton.button().click($.proxy(function () {

			var copyText = document.getElementById("urlExportInput");
			copyText.select();
			copyText.setSelectionRange(0, 99999)
			document.execCommand("copy");
		}, this)).button("option", "enabled", true);

		this.delimiter = $("<span class='toolbar_delimiter'>&nbsp;</span>");
		this.html.append(this.delimiter);

		// Export SVG.
		this.svgExportButton = $("<button>Export SVG</button>");
		this.html.append(this.svgExportButton);

		this.svgExportButton.button().click($.proxy(function () {

			var tDimension = new draw2d.geo.Rectangle(0, 0, view.getWidth(), view.getHeight());

			view.setDimension();

			var writer = new draw2d.io.svg.Writer();
			writer.marshal(view, function (svg) {
				$("#svg_output").text(svg);
			});

			view.setDimension(tDimension);

			$('#svg_output_div').show();

		}, this)).button("option", "enabled", true);

	},

	getNodeIdFpgalink: function (string_n) {
		// n00, ..
		return parseInt(string_n.substring(1));
	},

	/**
	 * @method
	 * Called if the selection in the cnavas has been changed. You must register this
	 * class on the canvas to receive this event.
	 *
		 * @param {draw2d.Canvas} emitter
		 * @param {Object} event
		 * @param {draw2d.Figure} event.figure
	 */
	onSelectionChanged: function (emitter, event) {
		// this.deleteButton.button( "option", "disabled", event.figure===null );
	},

	/**
	 * @method
	 * Sent when an event occurs on the command stack. draw2d.command.CommandStackEvent.getDetail()
	 * can be used to identify the type of event which has occurred.
	 *
	 * @template
	 *
	 * @param {draw2d.command.CommandStackEvent} event
	 **/
	stackChanged: function (event) {
		this.undoButton.button("option", "disabled", !event.getStack().canUndo());
		this.redoButton.button("option", "disabled", !event.getStack().canRedo());
	},

	srunApply: function (srun_raw, node_type) {
		// Get number of fpganodes: -N 1
		var srun_N_needle = "-N ";
		var srun_N = -1;
		var fpgalinks = [];
		let with_ethernet = false;

		// Look for -N argument.
		var i = 0;
		if ((i = srun_raw.indexOf(srun_N_needle)) > -1) {
			var next_space = srun_raw.indexOf(" ", i + srun_N_needle.length);
			next_space = next_space > -1 ? next_space : srun_raw.length;
			srun_N = parseInt(srun_raw.substring(i + srun_N_needle.length, next_space));
		} else {
			// -N not available. Pre-process command:

			// Pre-process command for "n2fpga.." node id to replace with "n.." node names.
			var regFPGA = /((n2fpga\d{2}):(acl[012]{1}):(ch[0123]{1})|eth)-((n2fpga\d{2}):(acl[012]{1}):(ch[0123]{1})|eth)/g;
			var resultFPGA;
			const mapFPGA = new Map();

			while ((resultFPGA = regFPGA.exec(srun_raw)) !== null) {
				// fpgalinks.push(result);
				if (resultFPGA[1] != "eth") {
					mapFPGA.set(resultFPGA[2], 1);
				} else {
					with_ethernet = true;
				}
				if (resultFPGA[5] != "eth") {
					mapFPGA.set(resultFPGA[6], 1);
				} else {
					with_ethernet = true;
				}
				// console.log(resultFPGA);
			}

			// console.log(mapFPGA);

			var replace_runner = 0;
			for (let key of mapFPGA.keys()) {
				srun_raw = srun_raw.replaceAll(key, "n" + replace_runner.toString().padStart(2, '0'));

				// console.log("replace " + key +" with n"+ replace_runner.toString().padStart(2, '0'));
				replace_runner += 1;
			}

			// console.log(srun_raw);

			// salloc: SPANK_FPGALINK0=n00:acl0:ch3-n00:acl1:ch3 salloc: SPANK_FPGALINK1=n00:acl0:ch2-n00:acl1:ch2 salloc: SPANK_FPGALINK2=n00:acl0:ch0-n00:acl1:ch0 salloc: SPANK_FPGALINK3=n00:acl0:ch1-n00:acl1:ch1

			var reg = /((n[01]{1}\d{1}):(acl[012]{1}):(ch[0123]{1})|eth)-((n[01]{1}\d{1}):(acl[012]{1}):(ch[0123]{1})|eth)/g;
			var result;
			const mapN = new Map();

			// result: Array(9) [ "n00:acl0:ch1-n00:acl2:ch0", "n00:acl0:ch1", "n00", "acl0", "ch1", "n00:acl2:ch0", "n00", "acl2", "ch0" ]
			while ((result = reg.exec(srun_raw)) !== null) {
				fpgalinks.push(result);

				if (result[1] != "eth") {
					mapN.set(result[2], 1);
				} else {
					with_ethernet = true;
				}
				if (result[5] != "eth") {
					mapN.set(result[6], 1);
				} else {
					with_ethernet = true;
				}
				
				// console.log(result);
			}

			// console.log(mapN.size);
			srun_N = mapN.size;
		}

		// Create Ethernet switch if required.
		var eth_switch = null;
		if (with_ethernet) {
			var pos_y = 20;
			var pos_x = 200;

			eth_switch = new SwitchShape({ "orientation": OrientationEnum.north })

			// create a command for the undo/redo support
			var command = new draw2d.command.CommandAdd(this.view, eth_switch, pos_x, pos_y);
			this.view.getCommandStack().execute(command);
		}

		// Create fpganodes.
		var fpganodes = [];
		var pos_y = 20;
		var pos_x = 20;
		for (i = 0; i < srun_N; i++) {
			var orientation = OrientationEnum.east;
			if (i % 2 == 1) {
				orientation = OrientationEnum.west;
			}
			// var node = new NodeShapeVertical();
			var node = new NodeShape({ orientation: orientation });

			// node.setOrientation(orientation);
			node.setName(this.view.getNodeNameNew());

			let num_fpgas = node_type == NodeTypeEnum.intel ? 2 : 3;
			let num_channels = node_type == NodeTypeEnum.intel ? 4 : 2;

			for(var f = 0; f < num_fpgas; f++) {
				node.addFPGA("acl"+f, num_channels);
			}

			fpganodes.push(node);

			// create a command for the undo/redo support
			// pos_x += 100;

			var command = new draw2d.command.CommandAdd(this.view, node, pos_x, pos_y);
			this.view.getCommandStack().execute(command);

			if (i % 2 == 0) {
				pos_x += 600;
			} else {
				pos_x = 20;

				pos_y += 300;
			}

		}

		// Get pre-defined links: --fpgalink="pair" or ="clique" or ...
		// Idea: copy raw string and consume needle until all needles are consumed.
		var srun_fpgalinks_needle = "--fpgalink=";

		var srun_raw_copy = srun_raw;
		var fromIndex = 0;
		while ((i = srun_raw_copy.indexOf(srun_fpgalinks_needle)) > -1) {
			var next_space = srun_raw_copy.indexOf(" ", i + srun_fpgalinks_needle.length);
			// Check if space symbol is available at end.
			next_space = next_space > -1 ? next_space : srun_raw_copy.length;

			// Get text after needle.
			var full_match = srun_raw_copy.substring(i + srun_fpgalinks_needle.length, next_space);

			// Remove quote symbol at beginning and end.
			full_match = full_match.substring(0, 1) == "\"" ? full_match.substring(1) : full_match;
			full_match = full_match.substring(full_match.length - 1) == "\"" ? full_match.substring(0, full_match.length - 1) : full_match;

			// Look for topologies or custom links.
			switch (full_match) {
				case "pair":
					// Idea:
					//
					// Within each node, all channels of one FPGA board are connected to the
					// respective channel of the other FPGA board.
					// No connections between nodes are made.

					// Go over all nodes
					for (i = 0; i < srun_N; i++) {
						var node = fpganodes[i];
						// var shape = node.getShape();

						// Connect all channels from first FPGA to second FPGA.
						var fpga0 = node.getFPGAFromFpgalink("acl0");
						var fpga1 = node.getFPGAFromFpgalink("acl1");

						// Go over all channels of FPGA.
						var k = 0;
						for (k = 0; k < 4; k++) {
							this.connectChannels(fpga0.getChannelFromFpgalink("ch" + k), fpga1.getChannelFromFpgalink("ch" + k));
						}
					}

					// Arrange nodes for better visualization.
					this.arrangeTopology("pair", fpganodes);

					break;
				case "clique":
					// Only clique of 2 nodes is supported.
					if (srun_N != 2) {
						alert("Only clique of 2 nodes is supported.");

						break;
					}

					// Get both nodes.
					var n00 = fpganodes[0];
					var n01 = fpganodes[1];

					// Get all fpgas
					var fpga_n00_0 = n00.getFPGAFromFpgalink("acl0");
					var fpga_n00_1 = n00.getFPGAFromFpgalink("acl1");
					var fpga_n01_0 = n01.getFPGAFromFpgalink("acl0");
					var fpga_n01_1 = n01.getFPGAFromFpgalink("acl1");

					// Connect channels specific to clique
					this.connectChannels(fpga_n00_0.getChannelFromFpgalink("ch0"), fpga_n01_0.getChannelFromFpgalink("ch0"));
					this.connectChannels(fpga_n00_0.getChannelFromFpgalink("ch1"), fpga_n00_1.getChannelFromFpgalink("ch1"));
					this.connectChannels(fpga_n00_0.getChannelFromFpgalink("ch2"), fpga_n01_1.getChannelFromFpgalink("ch2"));
					this.connectChannels(fpga_n00_0.getChannelFromFpgalink("ch3"), fpga_n01_1.getChannelFromFpgalink("ch3"));

					this.connectChannels(fpga_n00_1.getChannelFromFpgalink("ch0"), fpga_n01_1.getChannelFromFpgalink("ch0"));
					this.connectChannels(fpga_n00_1.getChannelFromFpgalink("ch2"), fpga_n01_0.getChannelFromFpgalink("ch2"));
					this.connectChannels(fpga_n00_1.getChannelFromFpgalink("ch3"), fpga_n01_0.getChannelFromFpgalink("ch3"));

					this.connectChannels(fpga_n01_0.getChannelFromFpgalink("ch1"), fpga_n01_1.getChannelFromFpgalink("ch1"));

					// Arrange nodes for better visualization.
					this.arrangeTopology("clique", fpganodes);

					break;
				// Ring
				case "ringO":
					// Idea:
					// Special handling for first and last node in ring (peel, remainder),
					// Loop for in-between nodes.
					var j;
					for (j = 0; j < srun_N; j++) {
						// Get both nodes.
						// Previous
						var nPrev;
						if (j == 0) {
							nPrev = fpganodes[0];
						} else {
							nPrev = fpganodes[j - 1];
						}
						// current node
						var nCurrent = fpganodes[j];
						// next
						var nNext;
						if (j == srun_N - 1) {
							nNext = fpganodes[j];
						} else {
							nNext = fpganodes[j + 1];
						}

						// Get all fpgas.
						var fpga_nPrev_acl0 = nPrev.getFPGAFromFpgalink("acl0");
						var fpga_nPrev_acl1 = nPrev.getFPGAFromFpgalink("acl1");
						var fpga_nCurrent_acl0 = nCurrent.getFPGAFromFpgalink("acl0");
						var fpga_nCurrent_acl1 = nCurrent.getFPGAFromFpgalink("acl1");
						var fpga_nNext_acl0 = nNext.getFPGAFromFpgalink("acl0");
						var fpga_nNext_acl1 = nNext.getFPGAFromFpgalink("acl1");

						// Connect channels specific to rinO
						//
						// A.
						var A_src = fpga_nCurrent_acl0.getChannelFromFpgalink("ch1");
						var A_dst;
						if (j == srun_N - 1) {
							A_dst = fpga_nCurrent_acl1.getChannelFromFpgalink("ch0");
						} else {
							A_dst = fpga_nNext_acl0.getChannelFromFpgalink("ch0");;
						}
						//
						// B.
						var B_src = fpga_nCurrent_acl1.getChannelFromFpgalink("ch1");
						var B_dst;
						if (j == 0) {
							B_dst = fpga_nCurrent_acl0.getChannelFromFpgalink("ch0");
						} else {
							B_dst = fpga_nPrev_acl1.getChannelFromFpgalink("ch0");;
						}
						//
						// C.
						var C_src = fpga_nCurrent_acl0.getChannelFromFpgalink("ch3");
						var C_dst;
						if (j == srun_N - 1) {
							C_dst = fpga_nCurrent_acl1.getChannelFromFpgalink("ch2");
						} else {
							C_dst = fpga_nNext_acl0.getChannelFromFpgalink("ch2");;
						}
						//
						// D.
						var D_src = fpga_nCurrent_acl1.getChannelFromFpgalink("ch3");
						var D_dst;
						if (j == 0) {
							D_dst = fpga_nCurrent_acl0.getChannelFromFpgalink("ch2");
						} else {
							D_dst = fpga_nPrev_acl1.getChannelFromFpgalink("ch2");;
						}

						this.connectChannels(A_src, A_dst);
						this.connectChannels(B_src, B_dst);
						this.connectChannels(C_src, C_dst);
						this.connectChannels(D_src, D_dst);

						// // Set color for up.
						// C_src.getConnector().setColor(ColorEnum.red);
						// D_src.getConnector().setColor(ColorEnum.red);
					}

					// Arrange nodes for better visualization.
					this.arrangeTopology("ringO", fpganodes);

					break;
				case "ringN":
					// ringN, going down in acl0 column and back up in acl1 column
					// Idea:
					// Special handling for first and last node in ring (peel, remainder),
					// Loop for in-between nodes.
					var j;
					for (j = 0; j < srun_N; j++) {
						// Get nodes.
						var nFirst = fpganodes[0];
						// Previous
						var nPrev;
						if (j == 0) {
							nPrev = fpganodes[0];
						} else {
							nPrev = fpganodes[j - 1];
						}
						// current node
						var nCurrent = fpganodes[j];
						// next
						var nNext;
						if (j == srun_N - 1) {
							nNext = fpganodes[j];
						} else {
							nNext = fpganodes[j + 1];
						}

						// Get all fpgas.
						var fpga_nFirst_acl0 = nFirst.getFPGAFromFpgalink("acl0");
						var fpga_nFirst_acl1 = nFirst.getFPGAFromFpgalink("acl1");
						var fpga_nPrev_acl0 = nPrev.getFPGAFromFpgalink("acl0");
						var fpga_nPrev_acl1 = nPrev.getFPGAFromFpgalink("acl1");
						var fpga_nCurrent_acl0 = nCurrent.getFPGAFromFpgalink("acl0");
						var fpga_nCurrent_acl1 = nCurrent.getFPGAFromFpgalink("acl1");
						var fpga_nNext_acl0 = nNext.getFPGAFromFpgalink("acl0");
						var fpga_nNext_acl1 = nNext.getFPGAFromFpgalink("acl1");

						// Connect channels specific to rinO
						//
						// A.
						var A_src = fpga_nCurrent_acl0.getChannelFromFpgalink("ch1");
						var A_dst;
						if (j == srun_N - 1) {
							A_dst = fpga_nFirst_acl1.getChannelFromFpgalink("ch0");
						} else {
							A_dst = fpga_nNext_acl0.getChannelFromFpgalink("ch0");;
						}
						//
						// B.
						var B_src = fpga_nCurrent_acl1.getChannelFromFpgalink("ch1");
						var B_dst;
						if (j == srun_N - 1) {
							B_dst = fpga_nFirst_acl0.getChannelFromFpgalink("ch0");
						} else {
							B_dst = fpga_nNext_acl1.getChannelFromFpgalink("ch0");;
						}
						//
						// C.
						var C_src = fpga_nCurrent_acl0.getChannelFromFpgalink("ch3");
						var C_dst;
						if (j == srun_N - 1) {
							C_dst = fpga_nFirst_acl1.getChannelFromFpgalink("ch2");
						} else {
							C_dst = fpga_nNext_acl0.getChannelFromFpgalink("ch2");;
						}
						//
						// D.
						var D_src = fpga_nCurrent_acl1.getChannelFromFpgalink("ch3");
						var D_dst;
						if (j == srun_N - 1) {
							D_dst = fpga_nFirst_acl0.getChannelFromFpgalink("ch2");
						} else {
							D_dst = fpga_nNext_acl1.getChannelFromFpgalink("ch2");;
						}

						this.connectChannels(A_src, A_dst);
						this.connectChannels(B_src, B_dst);
						this.connectChannels(C_src, C_dst);
						this.connectChannels(D_src, D_dst);

						// Set color for up.
						// C_src.getConnector().setColor(ColorEnum.red);
						// D_src.getConnector().setColor(ColorEnum.red);
					}

					// Arrange nodes for better visualization.
					this.arrangeTopology("ringN", fpganodes);

					break;
				case "ringZ":
					// Ring with two links per direction, acl0 and acl1 neighbors
					// Idea:
					// Special handling for first and last node in ring (peel, remainder),
					// Loop for in-between nodes.
					var j;
					for (j = 0; j < srun_N; j++) {
						// Get nodes.
						var nFirst = fpganodes[0];
						// Previous
						var nPrev;
						if (j == 0) {
							nPrev = fpganodes[0];
						} else {
							nPrev = fpganodes[j - 1];
						}
						// current node
						var nCurrent = fpganodes[j];
						// next
						var nNext;
						if (j == srun_N - 1) {
							nNext = fpganodes[j];
						} else {
							nNext = fpganodes[j + 1];
						}

						// Get all fpgas.
						var fpga_nFirst_acl0 = nFirst.getFPGAFromFpgalink("acl0");
						var fpga_nFirst_acl1 = nFirst.getFPGAFromFpgalink("acl1");
						var fpga_nPrev_acl0 = nPrev.getFPGAFromFpgalink("acl0");
						var fpga_nPrev_acl1 = nPrev.getFPGAFromFpgalink("acl1");
						var fpga_nCurrent_acl0 = nCurrent.getFPGAFromFpgalink("acl0");
						var fpga_nCurrent_acl1 = nCurrent.getFPGAFromFpgalink("acl1");
						var fpga_nNext_acl0 = nNext.getFPGAFromFpgalink("acl0");
						var fpga_nNext_acl1 = nNext.getFPGAFromFpgalink("acl1");

						// Connect channels specific to rinO
						//
						// A.
						var A_src = fpga_nCurrent_acl0.getChannelFromFpgalink("ch1");
						var A_dst = fpga_nCurrent_acl1.getChannelFromFpgalink("ch0");
						//
						// B.
						var B_src = fpga_nCurrent_acl1.getChannelFromFpgalink("ch1");
						var B_dst;
						if (j == srun_N - 1) {
							B_dst = fpga_nFirst_acl0.getChannelFromFpgalink("ch0");
						} else {
							B_dst = fpga_nNext_acl0.getChannelFromFpgalink("ch0");;
						}
						//
						// C.
						var C_src = fpga_nCurrent_acl0.getChannelFromFpgalink("ch3");
						var C_dst = fpga_nCurrent_acl1.getChannelFromFpgalink("ch2");;
						//
						// D.
						var D_src = fpga_nCurrent_acl1.getChannelFromFpgalink("ch3");
						var D_dst;
						if (j == srun_N - 1) {
							D_dst = fpga_nFirst_acl0.getChannelFromFpgalink("ch2");
						} else {
							D_dst = fpga_nNext_acl0.getChannelFromFpgalink("ch2");;
						}

						this.connectChannels(A_src, A_dst);
						this.connectChannels(B_src, B_dst);
						this.connectChannels(C_src, C_dst);
						this.connectChannels(D_src, D_dst);

						// Set color for up.
						// C_src.getConnector().setColor(ColorEnum.red);
						// D_src.getConnector().setColor(ColorEnum.red);
					}

					// Arrange nodes for better visualization.
					this.arrangeTopology("ringZ", fpganodes);

					break;
				// Torus
				case "torus2":
					// Torus with 2 FPGAs per row.
					this.torusTopo(srun_N, 2, fpganodes);

					// Arrange nodes for better visualization.
					this.arrangeTopology("torus2", fpganodes);

					break;
				case "torus3":
					// At least 2 nodes are required.
					if (srun_N < 2) {
						alert("Topology torus3 requires at least 2 nodes.");
						break;
					}

					this.torusTopo(srun_N, 3, fpganodes);

					// Arrange nodes for better visualization.
					this.arrangeTopology("torus3", fpganodes);

					break;
				case "torus4":
					// At least 2 nodes are required.
					if (srun_N < 2) {
						alert("Topology torus4 requires at least 2 nodes.");
						break;
					}

					this.torusTopo(srun_N, 4, fpganodes);

					// Arrange nodes for better visualization.
					this.arrangeTopology("torus4", fpganodes);

					break;
				case "torus5":
					// At least 3 nodes are required.
					if (srun_N < 3) {
						alert("Topology torus5 requires at least 3 nodes.");
						break;
					}

					this.torusTopo(srun_N, 5, fpganodes);

					// Arrange nodes for better visualization.
					this.arrangeTopology("torus5", fpganodes);
					break;
				case "torus6":
					// At least 3 nodes are required.
					if (srun_N < 3) {
						alert("Topology torus6 requires at least 3 nodes.");
						break;
					}

					this.torusTopo(srun_N, 6, fpganodes);

					// Arrange nodes for better visualization.
					this.arrangeTopology("torus6", fpganodes);

					break;

				// Custom link with format: n00:acl0:ch0-n00:acl1:ch0
				default:
					// Parse and add fpga links: n00:acl0:ch0-n00:acl1:ch0
					var links = full_match.split("-");

					// Point 1 (think of source).
					// value: n00:acl0:ch0 or eth (for Ethernet switch).
					var link_p1 = links[0].split(":");
					// Point 2 (think of destination).
					// value: n00:acl0:ch0 or eth (for Ethernet switch).
					var link_p2 = links[1].split(":");

					// Channels to connect. Logic is required to differentiate if
					//   the channel is between FPGAs or to/from Ethernet switch.
					let chan0;
					let chan1;

					if (link_p1.length == 3) {
						// Channel is from FPGA node.
						// Get node.
						var tnode_p1 = fpganodes[this.getNodeIdFpgalink(link_p1[0])];
						// Get FPGA.
						var tfpga_p1 = tnode_p1.getFPGAFromFpgalink(link_p1[1]);

						// Get channel.
						chan0 = tfpga_p1.getChannelFromFpgalink(link_p1[2]);
					} else {
						// Channel is to ethernet switch.
						chan0 = eth_switch;
					}

					if (link_p2.length == 3) {
						// Channel is to FPGA node.

						// Get node.
						var tnode_p2 = fpganodes[this.getNodeIdFpgalink(link_p2[0])];
						// Get FPGA.
						var tfpga_p2 = tnode_p2.getFPGAFromFpgalink(link_p2[1]);
						var isSibling = link_p2[0] == link_p1[0] && link_p2[1] == link_p1[1] && link_p2[2] == link_p1[2];
						chan1 = tfpga_p2.getChannelFromFpgalink(link_p2[2], isSibling);
					} else {
						// Channel is to ethernet switch.
						chan1 = eth_switch;
					}

					// Get channels, connect and draw them.
					this.connectChannels(chan0, chan1);

					// if(link_p1[2] == "ch0") {
					// 	tfpga_p1.getChannelFromFpgalink(link_p1[2]).getConnector().setColor(ColorEnum.red);
					// }

					break;
			}

			// Remove found link.
			srun_raw_copy = srun_raw_copy.substring(next_space);
		}

		
		// Parse and add fpga links: n00:acl0:ch0-n00:acl1:ch0
		if (srun_raw.indexOf(srun_fpgalinks_needle) == -1) {
			// Array(7) [ "n00:acl1:ch0-n00:acl1:ch1", "00", "1", "0", "00", "1", "1" ]
			// Array(9)["n00:acl0:ch1-eth", "n00:acl0:ch1", "n00", "acl0", "ch1", "eth", undefined, undefined, undefined]
			for (var i = 0; i < fpgalinks.length; i++) {
				// Parse and add fpga links: n00:acl0:ch0-n00:acl1:ch0
				var links = fpgalinks[i][0].split("-");

				// Point 1 (think of source).
				// value: n00:acl0:ch0 or eth (for Ethernet switch).
				var link_p1 = links[0].split(":");
				// Point 2 (think of destination).
				// value: n00:acl0:ch0 or eth (for Ethernet switch).
				var link_p2 = links[1].split(":");

				// Channels to connect. Logic is required to differentiate if
				//   the channel is between FPGAs or to/from Ethernet switch.
				let chan0;
				let chan1;

				if (link_p1.length == 3) {
					// Channel is from FPGA node.
					// Get node.
					var tnode_p1 = fpganodes[this.getNodeIdFpgalink(link_p1[0])];
					// Get FPGA.
					var tfpga_p1 = tnode_p1.getFPGAFromFpgalink(link_p1[1]);

					// Get channel.
					chan0 = tfpga_p1.getChannelFromFpgalink(link_p1[2]);
				} else {
					// Channel is to ethernet switch.
					chan0 = eth_switch;
				}

				if (link_p2.length == 3) {
					// Channel is to FPGA node.

					// Get node.
					var tnode_p2 = fpganodes[this.getNodeIdFpgalink(link_p2[0])];
					// Get FPGA.
					var tfpga_p2 = tnode_p2.getFPGAFromFpgalink(link_p2[1]);

					chan1 = tfpga_p2.getChannelFromFpgalink(link_p2[2]);
				} else {
					// Channel is to ethernet switch.
					chan1 = eth_switch;
				}

				// Get channels, connect and draw them.
				this.connectChannels(chan0, chan1);
			}
		}

		
		
	},

	makeGrid: function (N, width) {
		var grid = [];
		var height = parseInt(N * 2 / width);
		var fpgas = [];

		var i = 0;
		for (i = 0; i < N; i++) {
			fpgas.push(pad_node_name(i) + ":acl0");
			fpgas.push(pad_node_name(i) + ":acl1");
		}

		// console.log(fpgas);
		// console.log("Setting up torus with width "+(width)+" and height "+(height));

		var pos = 0;
		var rowindex = 0;
		for (rowindex = 0; rowindex < height; rowindex++) {
			row = [];
			var colindex = 0;
			for (colindex = 0; colindex < width; colindex++) {
				row.push(fpgas[pos]);
				pos = pos + 1;
			}
			grid.push(row)
		}

		// console.log("Torus topology with width "+(width)+" and height "+(height))
		// console.log("Torus topology information: columns from north to south, rows from west to east, end connected back to start")

		// this.printTopo(grid, 'acl:ch', ' - ', 'myprefix')

		return grid
	},

	torusTopo: function (srun_N, width, fpganodes) {
		var grid = this.makeGrid(srun_N, width);

		// var pairs = [];

		var rowindex = 0;
		for (rowindex = 0; rowindex < grid.length; rowindex++) {
			var row = grid[rowindex];

			var i = 0;
			for (i = 0; i < row.length; i++) {

				// Point 1.
				// value: n00:acl0
				var link_p1 = row[i].split(":");
				// 0: n00
				// 1: acl0
				// Get node.
				var tnode_p1 = fpganodes[this.getNodeIdFpgalink(link_p1[0])];
				// Get FPGA.
				var tfpga_p1 = tnode_p1.getFPGAFromFpgalink(link_p1[1]);

				// Point 2.
				var link_p2 = (grid[(rowindex + 1) % (grid.length)][i]).split(":");
				// 0: n00
				// 1: acl0
				// Get node.
				var tnode_p2 = fpganodes[this.getNodeIdFpgalink(link_p2[0])];
				// Get FPGA.
				var tfpga_p2 = tnode_p2.getFPGAFromFpgalink(link_p2[1]);

				// Point 2.
				var link_p3 = (row[(i + 1) % (row.length)]).split(":");
				// 0: n00
				// 1: acl0
				// Get node.
				var tnode_p3 = fpganodes[this.getNodeIdFpgalink(link_p3[0])];
				// Get FPGA.
				var tfpga_p3 = tnode_p3.getFPGAFromFpgalink(link_p3[1]);


				// pairs.push([row[i]+':ch1', grid[(rowindex+1)%(grid.length)][i]+':ch0'])
				// pairs.push([row[i]+':ch3', row[(i+1)%(row.length)]+':ch2'])

				// Get channels, connect and draw them.
				this.connectChannels(tfpga_p1.getChannelFromFpgalink("ch1"), tfpga_p2.getChannelFromFpgalink("ch0"));
				this.connectChannels(tfpga_p1.getChannelFromFpgalink("ch3"), tfpga_p3.getChannelFromFpgalink("ch2"));

			}
		}
	},

	printTopo : function(list, format='acl:ch', separator=' <-> ', prefix='') {
		var row = 0;
	  for(row = 0; row < list.length; row++) {
			console.log(prefix+separator+((list[row])))
		}
	},

	connectChannels: function (tchannel_p1, tchannel_p2) {
		// Connect them in model.
		tchannel_p1.setLinksToChannel(tchannel_p2);
		tchannel_p2.setLinksToChannel(tchannel_p1);

		// Draw them in View.
		//
		// Draw connection only ones.
		// if (!tchannel_p1.getIsDrawn()) {
			var c = new HoverConnection();

			c.setSource(tchannel_p1.getHybridPort(0));
			c.setTarget(tchannel_p2.getHybridPort(0));

			// Add connector to model.
			tchannel_p1.setConnector(c);
			tchannel_p2.setConnector(c);

			// // Flag both connectors as drawn.
			// tchannel_p1.setIsDrawn(true);
			// tchannel_p2.setIsDrawn(true);

			// create a command for the undo/redo support
			var command = new draw2d.command.CommandAdd(this.view, c, 0, 0);
			this.view.getCommandStack().execute(command);
		// }
	},

	arrangeTopology: function (topology_name, fpganodes) {
		switch (topology_name) {
			case "pair":

				break;
			case "clique":
				// Arrange with proper colors.
				var node_left = fpganodes[0];
				var node_right = fpganodes[1];

				// FPGAs
				var node_left_fpgas = node_left.getFPGAs();
				var node_right_fpgas = node_right.getFPGAs();

				// Channels.
				var node_left_fpga0_channels = node_left_fpgas.get(0).getChannels();
				var node_left_fpga1_channels = node_left_fpgas.get(1).getChannels();
				var node_right_fpga0_channels = node_right_fpgas.get(0).getChannels();
				var node_right_fpga1_channels = node_right_fpgas.get(1).getChannels();

				// Colorize according to scheme.
				//   See: https://wikis.uni-paderborn.de/pc2doc/FPGA_Serial_Channels#Clique_topology
				node_left_fpga0_channels.get(1).getHybridPort(0).getConnections().get(0).setColor(ColorEnum.red)
				node_left_fpga0_channels.get(2).getHybridPort(0).getConnections().get(0).setColor(ColorEnum.yellow)
				node_left_fpga0_channels.get(3).getHybridPort(0).getConnections().get(0).setColor(ColorEnum.blue)

				node_left_fpga1_channels.get(2).getHybridPort(0).getConnections().get(0).setColor(ColorEnum.yellow)
				node_left_fpga1_channels.get(3).getHybridPort(0).getConnections().get(0).setColor(ColorEnum.blue)

				node_right_fpga0_channels.get(1).getHybridPort(0).getConnections().get(0).setColor(ColorEnum.red)

				break;
			// Ring
			case "ringO":
			case "ringN":
			case "ringZ":
				// Arrange with proper colors.

				// Go over all nodes
				var i = 0;
				for (i = 0; i < fpganodes.length; i++) {
					var node = fpganodes[i];

					// FPGAs
					var node_fpgas = node.getFPGAs();

					// Channels.
					var node_fpga0_channels = node_fpgas.get(0).getChannels();
					var node_fpga1_channels = node_fpgas.get(1).getChannels();

					// Colorize according to scheme.
					//   See: https://wikis.uni-paderborn.de/pc2doc/FPGA_Serial_Channels#Ring_topology
					node_fpga0_channels.get(1).getHybridPort(0).getConnections().get(0).setColor(ColorEnum.blue)
					node_fpga0_channels.get(3).getHybridPort(0).getConnections().get(0).setColor(ColorEnum.blue)
				}	

				break;
			// Torus
			case "torus2":
			case "torus3":
			case "torus4":
			case "torus5":
			case "torus6":
				// Arrange with proper colors.

				// Go over all nodes
				var i = 0;
				for (i = 0; i < fpganodes.length; i++) {
					var node = fpganodes[i];

					// FPGAs
					var node_fpgas = node.getFPGAs();

					if (topology_name == "torus4") {
						var pad_end = 0;
						if (fpganodes.length % 2 == 0) {
							pad_end = 2;
						} else {
							pad_end = 1;
						}
						if (i > 1 && i < (fpganodes.length - pad_end)) {
							if (i % 2 == 0) {
								node.setX(160);
							} else {
								node.setX(480);
							}
						}
					}

					// Channels.
					var node_fpga0_channels = node_fpgas.get(0).getChannels();
					var node_fpga1_channels = node_fpgas.get(1).getChannels();

					// Colorize according to scheme.
					//   See: https://wikis.uni-paderborn.de/pc2doc/FPGA_Serial_Channels#Torus_topology
					var node_fpga0_channel_0 = node_fpga0_channels.get(0).getHybridPort(0).getConnections();
					var node_fpga0_channel_1 = node_fpga0_channels.get(1).getHybridPort(0).getConnections();
					var node_fpga0_channel_2 = node_fpga0_channels.get(2).getHybridPort(0).getConnections();
					var node_fpga0_channel_3 = node_fpga0_channels.get(3).getHybridPort(0).getConnections();

					var node_fpga1_channel_0 = node_fpga1_channels.get(0).getHybridPort(0).getConnections();
					var node_fpga1_channel_1 = node_fpga1_channels.get(1).getHybridPort(0).getConnections();
					var node_fpga1_channel_2 = node_fpga1_channels.get(2).getHybridPort(0).getConnections();
					var node_fpga1_channel_3 = node_fpga1_channels.get(3).getHybridPort(0).getConnections();

					if (node_fpga0_channel_0.getSize() > 0) {
						node_fpga0_channel_0.get(0).setColor(ColorEnum.blue)
					}
					if (node_fpga1_channel_0.getSize() > 0) {
						node_fpga1_channel_0.get(0).setColor(ColorEnum.blue)
					}

					if (node_fpga0_channel_1.getSize() > 0) {
						node_fpga0_channel_1.get(0).setColor(ColorEnum.red)
					}
					if (node_fpga1_channel_1.getSize() > 0) {
						node_fpga1_channel_1.get(0).setColor(ColorEnum.red)
					}

					if (node_fpga0_channel_2.getSize() > 0) {
						node_fpga0_channel_2.get(0).setColor(ColorEnum.yellow)
					}
				}

				break;

			default:
				//

				break;
		}

	}
});
