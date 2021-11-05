# Documentation

The general documentation and technical background can be found in the [main wiki](https://wikis.uni-paderborn.de/pc2doc/FPGA_Serial_Channels).

# PLANNED FEATURES

If you want to request more features, please file an issue. Current list of planed features:

* collapse nodes for better overview
* concept to colorize links to have a better overview
  * "random" where useful 
  * defined schemes for specific topologies.
* generate directly the image from ?import argument
* write actual documentation how to use the tool
* generate topology from predefined set
  * e.g. ring; then ask for number of nodes
* http://jsfiddle.net/gopi1410/yWs7P/ warn on close tag
* tutorial mode

# TODOs
* srun: found predefined topology (ring, etc.), ignoring explicitly given links
* delete has issues if node has self-links
* svg export computes wrong size when bounding box is a connection.
* nodes are smaller after undo/redo

