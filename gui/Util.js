
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
  if(channel.getText().includes("Ethernet Switch")) {
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

  for(let i = 0; i < figure.length; i++) {
    if (figure.at(i).NAME == "NodeShape") {
      number_of_fpga_nodes++
    }
  }

  return number_of_fpga_nodes;
}

function get_number_of_switch_nodes(figures) {
  let number_of_switch_nodes = 0;

  let figure = figures.data;

  for(let i = 0; i < figure.length; i++) {
    if (figure.at(i).NAME == "SwitchShape") {
      number_of_switch_nodes++
    }
  }

  return number_of_switch_nodes;
}
