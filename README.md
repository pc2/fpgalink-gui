# FPGA Link GUI Tool

The FPGA Link GUI Tool is a graphical interface that enables users to visualize and configure connections between FPGA nodes and Ethernet switches. This tool is particularly useful for managing FPGA-to-FPGA networks, providing an intuitive, drag-and-drop interface for setting up custom configurations.

For more detailed information about FPGA-to-FPGA networking, please refer to the [FPGA-to-FPGA Networking Documentation](https://upb-pc2.atlassian.net/wiki/spaces/PC2DOK/pages/1903573/FPGA-to-FPGA+Networking).

## Using the Tool

- On the left sidebar, you’ll find various components:
   - **Intel Nodes**: Drag and drop to add Intel FPGA nodes to the workspace.
   - **Xilinx Nodes**: Drag and drop to add Xilinx FPGA nodes.
   - **Ethernet Switches**: Drag and drop to add Ethernet switches to the network.
   - **Custom Labels**: Annotate your design with custom labels for easier identification of nodes and connections.
   - **Grid Toggle**: Enable or disable grid view to aid in node placement.
   - **Connection Types**: Select from different types of connections via the dropdown menu to tailor the     network design to your needs.


- **Connecting Nodes**:
   - Use the **grey ports** on each node to establish connections either within the same node or between different nodes.
   - Use the **green ports** to set up predefined configurations for connecting nodes.


- **Editing and Configuring**:
   - Utilize the **Undo** and **Redo** buttons at the top left corner to adjust your design as needed.
   - Once your configuration is complete, use the following options to save or share it:
     - **Copy --fpgalink**: Generates a command for use with the `changeFPGAlinks` bash command to configure your FPGA setup.
     - **Copy URL**: Copies a URL that links directly to your current configuration, allowing you to share or revisit it later.


- **Importing and Exporting Configurations**:
    - To visualize an existing configuration, use the **Import Intel** or **Import Xilinx** buttons to import a command and render it within the GUI.

