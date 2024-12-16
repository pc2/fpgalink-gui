const steps = {
    "basic": {
        "createNode": {
            title: 'Create an Element',
            description: 'You can create elements by drag and drop this label into the main grid.<br /><br />The highlighted element represents an FPGA node equiped with Intel Stratix 10 FPGAs.',
        },
        "nodeStructure": {
            title: 'Element Structure',
            description: 'This element represents an FPGA node. It is divided into two FPGA cards <code class="mycode">FPGA 0</code> and <code class="mycode">FPGA 1</code>.<br /><br /> Each FPGA card has four QSFP channels for direct FPGA-to-FPGA communication that can be setup with this tool. <br/><br/> You can find more information about the different FPGA nodes <a href="https://upb-pc2.atlassian.net/wiki/spaces/PC2DOK/pages/1901733/Hardware+Overview" target="_blank">here</a>.',
            side: "right",
            align: 'start',
        },
        "setConnection": {
            title: 'Setup a new Configuration',
            description: 'You can use these grey ports to set up connections by dragging the port to another port.',
            side: "right",
            align: 'start',
        },
        "selfConnections": {
            title: 'Example Connection',
            description: 'In this example <code class="mycode">Channel 0</code> and <code class="mycode">1</code> of <code class="mycode">FPGA 0</code> are connected.<br /><br />You can try out different connections. The tool tries to prevent unsupported connections.',
            side: "right",
            align: 'start',
        },
        "nodeOptions": {
            title: 'Options',
            description: 'Once you select an element, a list of options will appear. You can rotate, delete or configure elements.<br /><br />On many elements a right click offers additional functionalities.',
            side: "right",
            align: 'start',
        },
        "copyConfiguration": {
            title: 'Copy Configuration',
            description: 'Once you have setup your desired connections, you click this button to generate and copy the actual command to execute the actual configuration at the cluster. <br /><br />This is done with the help of the <code class="mycode">changeFPGALinks</code> utility tool. You can learn more about it <a href="https://upb-pc2.atlassian.net/wiki/spaces/PC2DOK/pages/1903821/changeFPGALinks" target="_blank">here</a>.',
            side: "bottom",
            align: 'center',
        }
    },
    "advanced": {
        // createNode & nodeOptions steps are being added from the basic tutorial in the JS
        "nodeConfigurations": {
            title: 'Node Configurations',
            description: 'When you select the 3 dots, you will find the following menu. <br/> There are a set of pre-defined connections which you choose from. </br> Lets try the Pair configuration.',
            side: "right",
            align: 'start',
        },
        "pairConfiguration": {
            title: 'Pair Configuration',
            description: 'You can see now that the node is configured as Pair connections, where each channel from the first FPGA is connceted to relative channel in the second FPGA.',
            side: "right",
            align: 'start',
        },
        "connection2Nodes": {
            title: 'Connection between 2 nodes',
            description: 'You can also connect the channels of 2 different nodes.',
            side: "bottom",
            align: 'center',
        },
        "greenPorts": {
            title: 'Green Ports',
            description: 'When you connect 2 nodes with the green port, a popup will appear with different pre-defined configurations. You can select one of them and the nodes will be connected autmoatically. </br> For example, lets choose the 1:1 Mapping.',
            side: "bottom",
            align: 'center',
        },
        "mapping1:1": {
            title: '1:1 Mapping',
            description: 'You can see now that each channel from the first node is connected to its relative channel in the second node.',
            side: "right",
            align: 'center',
        }
    },
    "switch": {
        "createSwitch": {
            title: 'Create a Switch',
            description: 'You can create a switch by drag and drop this label into the grid. Lets create one!',
        },
        "createNode": {
            title: 'Create a Node',
            description: 'Ethernet switches are only allowed to be connected to Xilinx nodes. Lets create one!',
        },
        "setConnections": {
            title: 'Set Connections',
            description: 'You can connect the nodes by drag&drop the grey ports. Lets create a 1:1 connection!',
            side: "right",
            align: "center"
        },
        "showConnections": {
            title: 'View Connections',
            description: "Now that we have successfully connected the nodes, it's time to copy the configuration!",
            side: "right",
            align: "center"
        }
        // copy --fpgalink step is being added in the JS from the basic tutorial
    },
    "actions": {
        "undoRedo": {
            title: 'Undo / Redo',
            description: 'At any moment, you can undo/redo your actions.',
            side: "bottom",
            align: 'center',
        },
        "importConfiguration": {
            title: 'Import Configuration',
            description: 'If you already have a conifguration, you can use these buttons to import it. </br> You can find more information about the syntax of these configurations <a href="https://upb-pc2.atlassian.net/wiki/spaces/PC2DOK/pages/1903573/FPGA-to-FPGA+Networking" target="_blank">here</a>',
            side: "bottom",
            align: 'center',
        },
        // copy --fpgalink step is being added in the JS from the basic tutorial
        "copyURL": {
            title: 'Copy URL',
            description: 'If you want to share the current design that you have implemented, you can copy the following link and share it with others!',
            side: "bottom",
            align: 'center',
        },
        "exportSVG": {
            title: 'Export SVG',
            description: 'You can export your design and download it as a SVG.',
            side: "bottom",
            align: 'center',
        }
    }
}

// Add createNode and nodeOptions steps from the basic to the advanced
steps["advanced"]["createNode"] = steps["basic"]["createNode"];
steps["advanced"]["nodeOptions"] = steps["basic"]["nodeOptions"];

// Add copy --fpgalink step to the actions tutorial and to the switch tutorial
steps["actions"]["copyConfiguration"] = steps["basic"]["copyConfiguration"];
steps["switch"]["copyConfiguration"] = steps["basic"]["copyConfiguration"];


// Get tutorial type from the URL
const url = new URL(window.location.href);
let tutorialType = url.searchParams.get("tutorial");
let activeSteps = steps[tutorialType];


// Prepare driver steps
let driverSteps = [];

if (tutorialType == "basic") {
    driverSteps = [
        {
            element: '#intel-node',
            popover: {
                ...activeSteps["createNode"],
                onNextClick: () => {
                    // Create a node
                    createNodes("node-intel", "east", 90, 60);
                    driverObj.moveNext();
                },
            }
        },
        {
            element: '.NodeShape',
            popover: {
                ...activeSteps["nodeStructure"],
                onNextClick: () => {
                    // Create a invisible div to highlight it
                    let nodeElement = $(".NodeShape");
                    let { left, top } = nodeElement.offset();
                    let outerHeight = nodeElement.outerHeight();
                    let outerWidth = nodeElement.outerWidth();

                    let div = document.createElement("div");
                    div.style.width = 20;
                    div.style.height = outerHeight - 45;
                    div.style.top = top + 45;
                    div.style.left = left + outerWidth - 10;
                    div.style.position = "absolute";
                    div.classList.add(...["to-be-deleted", "tutorial-step3"]);
                    $("body").append(div);

                    driverObj.moveNext();
                },
                onPrevClick: () => {
                    // Delete the node
                    // Simulate the click on the deleteBtn of the node
                    app.view.figures.data[0].select();
                    $(".overlayMenuDeleteItem").click();

                    driverObj.movePrevious();
                },
            }
        },
        {
            element: '.tutorial-step3',
            popover: {
                ...activeSteps["setConnection"],
                onNextClick: () => {
                    // Create a self connection
                    let node = app.view.figures.data[0];
                    let nodeChannels = node.getFPGAs().data[0].getChannels().data;
                    app.toolbar.connectChannels(nodeChannels[1], nodeChannels[3]);

                    driverObj.moveNext();
                },
            },
        },
        {
            element: '.draw2d_connection',
            popover: {
                ...activeSteps["selfConnections"],
                onNextClick: () => {
                    // Remove the old connection
                    let nodeConnections = app.view.figures.data[0].getAllConnections();
                    delete_connections(nodeConnections, app.view);

                    let node = app.view.figures.data[0];
                    node.select();

                    driverObj.moveNext();
                },
                onPrevClick: () => {
                    // Remove the old connection
                    let nodeConnections = app.view.figures.data[0].getAllConnections();
                    delete_connections(nodeConnections, app.view);

                    driverObj.movePrevious();
                }
            }
        },
        {
            element: '.overlayMenu',
            popover: {
                ...activeSteps["nodeOptions"],
                onPrevClick: () => {
                    // Recreate the self connection
                    let node = app.view.figures.data[0];
                    let nodeChannels = node.getFPGAs().data[0].getChannels().data;
                    app.toolbar.connectChannels(nodeChannels[1], nodeChannels[3]);

                    // Unselect the node
                    node.unselect();

                    driverObj.movePrevious();
                }
            }
        },
        {
            element: '.copy-fpgalink',
            popover: {
                ...activeSteps["copyConfiguration"]
            }
        },
    ];


} else if (tutorialType == "advanced") {

    driverSteps = [
        {
            element: '#intel-node',
            popover: {
                ...activeSteps["createNode"],
                onNextClick: () => {
                    // Create a node and select it
                    let node = createNodes("node-intel", "east", 90, 60);
                    node.select();

                    driverObj.moveNext();
                },
            }
        },
        {
            element: '.overlayMenu',
            popover: {
                ...activeSteps["nodeOptions"],
                onNextClick: () => {
                    // Open the options menu
                    $(".overlayMenuItem.options").click();
                    $(".custom-menu.single").addClass("pointer-none");

                    driverObj.moveNext();
                },
                onPrevClick: () => {
                    // Delete the node by simulating a click on the deleteBtn
                    let node = app.view.figures.data[0];
                    node.select();
                    $(".overlayMenuDeleteItem").click();

                    driverObj.movePrevious();
                }
            }
        },
        {
            element: '.custom-menu.single',
            popover: {
                ...activeSteps["nodeConfigurations"],
                onNextClick: () => {
                    // Create a pair connection
                    let node = app.view.figures.data[0];
                    app.toolbar.createNodesAndConnections("pair", 1, [node], []);

                    // Unselect the node
                    node.unselect();

                    // click anywhere to remove the overlay menu
                    $("body").trigger("mousedown");

                    // Create a invisible div to highlight it
                    let nodeElement = $(".NodeShape");
                    let { left, top } = nodeElement.offset();
                    let outerWidth = nodeElement.outerWidth();
                    let outerHeight = nodeElement.outerHeight();

                    let div = document.createElement("div");
                    div.style.width = outerWidth + 50;
                    div.style.height = outerHeight;
                    div.style.top = top;
                    div.style.left = left;
                    div.style.position = "absolute";
                    div.classList.add(...["to-be-deleted", "tutorial-step7"]);
                    $("body").append(div);

                    driverObj.moveNext();
                },
                onPrevClick: () => {
                    // Remove the overlay menu by simulating a click anywhere
                    $("body").trigger("mousedown");

                    // Select the node again
                    let node = app.view.figures.data[0];
                    node.select();

                    driverObj.movePrevious();
                }
            }
        },
        {
            element: '.tutorial-step7',
            popover: {
                ...activeSteps["pairConfiguration"],
                onNextClick: () => {
                    // Remove the old connection
                    let nodeConnections = app.view.figures.data[0].getAllConnections();
                    delete_connections(nodeConnections, app.view);

                    // Create a new node
                    createNodes("node-intel", "west", 400, 60);

                    // Create a connection between the 2 nodes
                    let node1 = app.view.figures.data[0];
                    let node2 = app.view.figures.data[1];
                    let node1Channels = node1.getFPGAs().data[0].getChannels().data;
                    let node2Channels = node2.getFPGAs().data[0].getChannels().data;
                    app.toolbar.connectChannels(node1Channels[1], node2Channels[1]);

                    driverObj.moveNext();
                },
                onPrevClick: () => {
                    // Remove the pair connections
                    let node = app.view.figures.data[0];
                    delete_connections(node.getAllConnections(), app.view);


                    // Select the node
                    node.select();

                    // Open the options menu
                    $(".overlayMenuItem.options").click();
                    $(".custom-menu.single").addClass("pointer-none");

                    driverObj.movePrevious();
                }
            }
        },
        {
            element: '.draw2d_connection',
            popover: {
                ...activeSteps["connection2Nodes"],
                onNextClick: () => {
                    // Remove the old connection
                    let nodeConnections = app.view.figures.data[0].getAllConnections();
                    delete_connections(nodeConnections, app.view);

                    // Connect the 2 config (green) ports
                    let node1ConfigPort = app.view.figures.data[0].getPorts().data[0];
                    let node2ConfigPort = app.view.figures.data[1].getPorts().data[0];
                    var c = new HoverConnection(node1ConfigPort, node2ConfigPort);
                    var command = new draw2d.command.CommandAdd(app.view, c, 0, 0);
                    app.view.getCommandStack().execute(command);

                    // Create a invisible div to highlight it
                    let nodeElement = $(".NodeShape");
                    let { left, top } = nodeElement.offset();
                    let outerWidth = nodeElement.outerWidth();

                    let div = document.createElement("div");
                    div.style.width = 400 - 90 - outerWidth + 20;
                    div.style.height = 45;
                    div.style.top = top;
                    div.style.left = left + outerWidth - 10;
                    div.style.position = "absolute";
                    div.classList.add(...["to-be-deleted", "tutorial-step9"]);
                    $("body").append(div);

                    driverObj.moveNext();
                },
                onPrevClick: () => {
                    // Remove the connection between the 2 nodes
                    let node1 = app.view.figures.data[0];
                    let node2 = app.view.figures.data[1];
                    delete_connections(node2.getAllConnections(), app.view);

                    // Remove the second node
                    // Simulate the click on the deleteBtn of the node
                    node2.select();
                    $(".overlayMenuDeleteItem").click();

                    // Recreate the pair connections
                    app.toolbar.createNodesAndConnections("pair", 1, [node1], []);

                    driverObj.movePrevious();
                }
            }
        },
        {
            element: '.tutorial-step9',
            popover: {
                ...activeSteps["greenPorts"],
                onNextClick: () => {
                    // This is to remove the config port popup
                    $(".tutorial-step9").trigger("mousedown");

                    // Create 1:1 Mapping connections
                    let node1 = app.view.figures.data[0];
                    let node2 = app.view.figures.data[1];
                    connectBasedOnConfig([node1, node2], "one-by-one");

                    // Create a invisible div to highlight it
                    let nodeElement = $(".NodeShape");
                    let { left, top } = nodeElement.offset();
                    let outerWidth = nodeElement.outerWidth();
                    let outerHeight = nodeElement.outerHeight();

                    let div = document.createElement("div");
                    div.style.width = 400 - 90 + outerWidth;
                    div.style.height = outerHeight;
                    div.style.top = top;
                    div.style.left = left;
                    div.style.position = "absolute";
                    div.classList.add(...["to-be-deleted", "tutorial-step10"]);
                    $("body").append(div);


                    driverObj.moveNext();
                },
                onPrevClick: () => {
                    // Remove the connection between the 2 config ports
                    $(".tutorial-step9").trigger("mousedown");

                    // Recreate the connection between the 2 nodes
                    let node1 = app.view.figures.data[0];
                    let node2 = app.view.figures.data[1];
                    let node1Channels = node1.getFPGAs().data[0].getChannels().data;
                    let node2Channels = node2.getFPGAs().data[0].getChannels().data;
                    app.toolbar.connectChannels(node1Channels[1], node2Channels[1]);


                    driverObj.movePrevious();
                }
            }
        },
        {
            element: '.tutorial-step10',
            popover: {
                ...activeSteps["mapping1:1"],
                onPrevClick: () => {
                    let node1 = app.view.figures.data[0];
                    let node2 = app.view.figures.data[1];

                    // Remove the pair connections
                    delete_connections(node1.getAllConnections(), app.view);

                    // Recreate the connection between the 2 config ports
                    let node1ConfigPort = node1.getPorts().data[0];
                    let node2ConfigPort = node2.getPorts().data[0];
                    var c = new HoverConnection(node1ConfigPort, node2ConfigPort);
                    var command = new draw2d.command.CommandAdd(app.view, c, 0, 0);
                    app.view.getCommandStack().execute(command);

                    driverObj.movePrevious();
                }
            }
        },
    ];
} else if (tutorialType == "actions") {
    driverSteps = [
        {
            element: '.undo-redo-container',
            popover: {
                ...activeSteps["undoRedo"]
            }
        },
        {
            element: '.import-container',
            popover: {
                ...activeSteps["importConfiguration"]
            }
        },
        {
            element: '.copy-fpgalink',
            popover: {
                ...activeSteps["copyConfiguration"]
            }
        },
        {
            element: '.copy-url',
            popover: {
                ...activeSteps["copyURL"]
            }
        },
        {
            element: '.export-svg',
            popover: {
                ...activeSteps["exportSVG"]
            }
        }
    ]
} else if (tutorialType == "switch") {
    driverSteps = [
        {
            element: '#ethernet-switch',
            popover: {
                ...activeSteps["createSwitch"],
                onNextClick: () => {
                    // Create a switch
                    createNodes("node-ethernet-switch", "north", 400, 60);
                    driverObj.moveNext();
                },
            }
        },
        {
            element: '#xilinx-node',
            popover: {
                ...activeSteps["createNode"],
                onNextClick: () => {
                    // Create a node
                    createNodes("node-xilinx", "east", 90, 60);

                    // Create a invisible div to highlight it
                    let nodeElement = $(".NodeShape");
                    let { left, top } = nodeElement.offset();
                    let nodeOuterHeight = nodeElement.outerHeight();
                    let nodeOuterWidth = nodeElement.outerWidth();

                    let switchElement = $(".SwitchShape");
                    let switchOuterWidth = switchElement.outerWidth();

                    let div = document.createElement("div");
                    div.style.width = (400 - 90) + switchOuterWidth;
                    div.style.height = nodeOuterHeight;
                    div.style.top = top;
                    div.style.left = left;
                    div.style.position = "absolute";
                    div.classList.add(...["to-be-deleted", "tutorial-step2"]);
                    $("body").append(div);

                    driverObj.moveNext();
                },
                onPrevClick: () => {
                    // Delete the switch
                    // Simulate the click on the deleteBtn of the switch
                    app.view.figures.data[0].select();
                    $(".overlayMenuDeleteItem").click();

                    driverObj.movePrevious();
                },
            }
        },
        {
            element: '.tutorial-step2',
            popover: {
                ...activeSteps["setConnections"],
                onNextClick: () => {
                    // Create a 1:1 connection between the node and the switch
                    let eth_switch = app.view.figures.data[0];
                    let node = app.view.figures.data[1];
                    connectBasedOnConfig([node], "one-by-one", eth_switch)

                    driverObj.moveNext();
                },
                onPrevClick: () => {
                    // Delete the node
                    // Simulate the click on the deleteBtn of the node
                    app.view.figures.data[1].select();
                    $(".overlayMenuDeleteItem").click();

                    driverObj.movePrevious();
                },
            }
        },
        {
            element: '.tutorial-step2',
            popover: {
                ...activeSteps["showConnections"],
                onPrevClick: () => {
                    // Remove the connections between the node and the switch
                    let nodeConnections = app.view.figures.data[0].getAllConnections();
                    delete_connections(nodeConnections, app.view);

                    driverObj.movePrevious();
                }
            },
        },
        {
            element: '.copy-fpgalink',
            popover: {
                ...activeSteps["copyConfiguration"]
            }
        },
    ]
}

const driver = window.driver.js.driver;
const driverObj = driver({
    showProgress: true,
    steps: driverSteps,
    onDestroyStarted: () => {
        // Delete all intermediate divs
        $(".to-be-deleted").remove();
        $(".pointer-none").removeClass("pointer-none");

        driverObj.destroy();

        // Remove the "tutorial=*" from the URL
        // const url = new URL(window.location.href);
        // url.search = "";
        // window.history.replaceState({}, document.title, url);
    }
});

driverObj.drive();






// {
//     element: '#xilinx-node',
//     popover: {
//         title: 'Different Node',
//         description: 'You can also create a different type of nodes using the same drag & drop method. <br/> You can learn more about the hardware structure of this node <a href="https://upb-pc2.atlassian.net/wiki/spaces/PC2DOK/pages/1901733/Hardware+Overview" target="_blank">here<a/>',
//         side: "right",
//         align: 'center',
//     }
// },
// {
//     element: '#ethernet-switch',
//     popover: {
//         title: 'Ethernet Switch',
//         description: 'You can also create an ethernet switch.',
//         side: "right",
//         align: 'center',
//     }
// },
// {
//     element: '#label',
//     popover: {
//         title: 'Labels',
//         description: 'You can drag and drop this to add labels wherever you want.',
//         side: "right",
//         align: 'center',
//     }
// },