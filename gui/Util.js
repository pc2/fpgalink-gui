
const ColorEnum = Object.freeze({
    "red": "f3546a",
    "yellow": "FFFF99",
    "green": "b9dd69",
    "blue": "00A8F0"
});

function pad_node_name(num) {
    var s = "0" + num;
    return "n" + s.substr(s.length - 2);
}

function generate_fpgalink_output(channel) {
    let fpgalink = "";
    // channel is either of type ChannelShape (if connected to FPGA node)
    //   or "Ethernet Switch" (if connected to the switch)
    if (channel.getText().includes("Ethernet Switch")) {
        num = channel.getText().split(" ")[2]
        fpgalink = "eth" + num;
    } else {
        var parent_fpga = channel.getFPGA();
        var parent_node = parent_fpga.getNode();

        var channelName = "ch" + channel.getText().substring(8)

        fpgalink = parent_node.getName() + ":" + parent_fpga.getName() + ":" + channelName;
    }

    return fpgalink;
}

function get_number_of_fpga_nodes(figures) {
    let number_of_fpga_nodes = 0;

    let figure = figures.data;

    for (let i = 0; i < figure.length; i++) {
        if (figure.at(i).NAME == "NodeShape") {
            number_of_fpga_nodes++
        }
    }

    return number_of_fpga_nodes;
}

function get_number_of_switch_nodes(figures) {
    let number_of_switch_nodes = 0;

    let figure = figures.data;

    for (let i = 0; i < figure.length; i++) {
        if (figure.at(i).NAME == "SwitchShape") {
            number_of_switch_nodes++
        }
    }

    return number_of_switch_nodes;
}

function toggle_non_config_ports(figures, action, myType) {
    // Loop over all figures and all ports and hide all non-config ports + config-ports from other node type
    for (let i = 0; i < figures.length; i++) {
        const figure = figures[i];
        if (figure instanceof NodeShape) {

            if (action == "hide") {
                // If its not same type as me, hide its config_port
                if ((myType != "Switch" && figure.getType() != myType) || (myType == "Switch" && figure.getType() == "Intel")) {
                    figure.getHybridPort(0).setVisible(false);
                }
            } else {
                // Show all config_port again
                figure.getHybridPort(0).setVisible(true);
            }

            let channelPorts = figure.getChannelPorts();

            for (let k = 0; k < channelPorts.length; k++) {
                const p = channelPorts[k];

                if (action == "hide") {
                    p.setVisible(false);
                } else {
                    // Show only ports that does not have any connection
                    if (!p.connections.data.length && p.parent.siblingChannel) {
                        p.setVisible(true);
                    }
                }
            }
        } else if (figure instanceof SwitchShape) {
            // toggle all ports execpt last one (it is the config port)
            for (let i = 0; i < figure.hybridPorts.data.length - 1; i++) {
                const p = figure.hybridPorts.data[i];
                p.setVisible(action == "show");
            }

            // If I am a switch, toggle the config port
            if (myType == "Switch" || myType == "Intel") {
                figure.getHybridPort(8).setVisible(action == "show");
            }
        }
    }
}

function toggle_config_ports(figures, isVisible) {
    // Loop over all figures and all ports and hide all config ports
    for (let i = 0; i < figures.length; i++) {
        const figure = figures[i];
        if (figure instanceof NodeShape) {
            figure.getHybridPort(0).setVisible(isVisible);
        } else if (figure instanceof SwitchShape) {
            // The config port is the last port
            figure.getHybridPort(figure.hybridPorts.data.length - 1).setVisible(isVisible)
        }
    }
}

function toggle_all_switch_ports(figures, isVisible) {
    for (let i = 0; i < figures.length; i++) {
        const figure = figures[i];
        if (figure instanceof SwitchShape) {
            // The config port is the last port
            figure.hybridPorts.data.forEach(port => {
                port.setVisible(isVisible)
            });
        }
    }
}

function toggle_all_intel_ports(figures, isVisible) {
    for (let i = 0; i < figures.length; i++) {
        const figure = figures[i];
        if (figure instanceof NodeShape && figure.getType() == "Intel") {
            let channelPorts = figure.getChannelPorts();
            for (let k = 0; k < channelPorts.length; k++) {
                const p = channelPorts[k];

                if (!isVisible) {
                    p.setVisible(false);
                } else {
                    // Show only ports that does not have any connection
                    if (!p.connections.data.length && p.parent.siblingChannel) {
                        p.setVisible(true);
                    }
                }
            }
        }
    }
}

function delete_connections(connections, canvas, addToStack = true) {
    for (let i = 0; i < connections.length; i++) {
        const conn = connections[i];

        if (addToStack) {
            var cmd = new draw2d.command.CommandDelete(conn);
            canvas.getCommandStack().execute(cmd);
        } else {
            canvas.remove(conn);
        }
    }
}

function connectBasedOnConfig(nodes, config, eth_switch) {
    // Both are for sure same type
    let nodeType = nodes[0].getType();
    let nbOfFPGAs = nodeType == "Intel" ? 2 : 3;
    let nbOfChannels = nodeType == "Intel" ? 4 : 2;

    for (let i = 0; i < nbOfFPGAs; i++) {
        for (let j = 0; j < nbOfChannels; j++) {

            if (config == "one-by-one") {
                if (eth_switch) {
                    let fpgalink_cmd = `${nodes[0].getName()}:acl${i}:ch${j}-${eth_switch.getName()}`;
                    app.toolbar.createNodesAndConnections(fpgalink_cmd, 2, nodes, [eth_switch])
                } else {
                    let fpgalink_cmd = `${nodes[0].getName()}:acl${i}:ch${j}-${nodes[1].getName()}:acl${i}:ch${j}`;
                    app.toolbar.createNodesAndConnections(fpgalink_cmd, 2, nodes, [])
                }
            } else if (config == "loopback") {
                let fpgalink_cmd = `${nodes[0].getName()}:acl${i}:ch${j}-${nodes[0].getName()}:acl${i}:ch${j}`;
                app.toolbar.createNodesAndConnections(fpgalink_cmd, 2, nodes, [])
            } else if (config == "channel") {
                if (j % 2 == 0) {
                    let fpgalink_cmd = `${nodes[0].getName()}:acl${i}:ch${j}-${nodes[0].getName()}:acl${i}:ch${j + 1}`;
                    app.toolbar.createNodesAndConnections(fpgalink_cmd, 1, nodes, [])
                }
            }

        }
    }
}