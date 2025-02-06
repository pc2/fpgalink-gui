// declare the namespace for this example
var example = {};

/**
 * 
 * The **GraphicalEditor** is responsible for layout and dialog handling.
 * 
 * @extends draw2d.ui.parts.GraphicalEditor
 */
example.Application = Class.extend(
	{
		NAME: "example.Application",

		/**
		 * @constructor
		 * 
		 * @param {String} canvasId the id of the DOM element to use as paint container
		 */
		init: function () {
			this.view = new example.View("canvas");
			this.toolbar = new example.Toolbar("toolbar", this, this.view);


			// layout FIRST the body
			this.appLayout = $('#container').layout({
				west: {
					resizable: true,
					closable: true,
					resizeWhileDragging: true,
					paneSelector: "#navigation"
				},
				center: {
					resizable: true,
					closable: true,
					resizeWhileDragging: true,
					paneSelector: "#content"
				}
			});

			//
			this.contentLayout = $('#content').layout({
				north: {
					resizable: false,
					closable: false,
					spacing_open: 0,
					spacing_closed: 0,
					size: 50,
					paneSelector: "#toolbar"
				},
				center: {
					resizable: false,
					closable: false,
					spacing_open: 0,
					spacing_closed: 0,
					paneSelector: "#canvas"
				}
			});

			$(".menu .menu-header").click(function (ev) {
				// Get sibling
				let sibling = $(this).siblings(".elements");
				// Get icon
				let icon = $(this).find("i");

				if (sibling.css("display") == "none") {
					sibling.slideDown(100);
					icon.removeClass("fa-chevron-right").addClass("fa-chevron-down");
				} else {
					sibling.slideUp(100);
					icon.removeClass("fa-chevron-down").addClass("fa-chevron-right");
				}
			})
		},

		setDefaultRouterClassName: function (newDefaultRouterClassName) {
			defaultRouterClassName = newDefaultRouterClassName;
			defaultRouter = eval("new " + defaultRouterClassName + "()");
		}
	});
