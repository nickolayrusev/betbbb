define([
  "backbone.layoutmanager",
  "bootstrap",
  "handlebars",
	"localstorage"
  // Include additional libraries installed with JamJS or placed in the
  // `vendor/js` directory, here.
],

function(LayoutManager) {

  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
    // The root path to run the application.
    root: "/"
  };

  // Localize or create a new JavaScript Template object.
  var JST = window.JST = window.JST || {};

  // Configure LayoutManager with Backbone Boilerplate defaults.
  Backbone.Layout.configure({
    // Allow LayoutManager to augment Backbone.View.prototype.
    manage: true,

    prefix: "app/templates/",

/*
    fetch: function(path) {
        var done;

        // Add the html extension.
        path = path + ".html";

        // If the template has not been loaded yet, then load.
        if (!JST[path]) {
          done = this.async();
          return $.ajax({ url: app.root + path }).then(function(contents) {
                        // debug helper
            // usage: {{debug}} or {{debug someValue}}
            // from: @commondream (http://thinkvitamin.com/code/handlebars-js-part-3-tips-and-tricks/)
            Handlebars.registerHelper("debug", function(optionalValue) {
              console.log("Current Context");
              console.log("====================");
              console.log(this);
             
              if (optionalValue) {
                console.log("Value");
                console.log("====================");
                console.log(optionalValue);
              }
            });
            

            JST[path] = Handlebars.compile(contents);
            JST[path].__compiled__ = true;

            done(JST[path]);
          });
        }

        // If the template hasn't been compiled yet, then compile.
        if (!JST[path].__compiled__) {
          JST[path] = Handlebars.template(JST[path]);
          JST[path].__compiled__ = true;
        }
        
        return JST[path];
     },*/

     

		fetch: function(path) {
			path = path + ".html";

			Handlebars.registerHelper('if', function(conditional, options) {
				if (conditional) {
					return options.fn(this);
				}
			});

			Handlebars.registerHelper("debug", function(optionalValue) {
				console.log("Current Context");
				console.log("====================");
				console.log(this);

				if (optionalValue) {
					console.log("Value");
					console.log("====================");
					console.log(optionalValue);
				}
			});

			if (!JST[path]) {
				$.ajax({
					url : app.root + path,
					async : false
				}).then(function(contents) {
					JST[path] = Handlebars.compile(contents);
					//JST[path].__compiled__ = true;
				});
			}
			/*
			if (!JST[path].__compiled__) {
							JST[path] = Handlebars.template(JST[path]);
							JST[path].__compiled__ = true;
						}*/
			
			return JST[path];
		}

      
  });

  // Mix Backbone.Events, modules, and layout management into the app object.
  return _.extend(app, {
    // Create a custom object with a nested Views object.
    module: function(additionalProps) {
      return _.extend({ Views: {} }, additionalProps);
    },

    // Helper for using layouts.
    useLayout: function(name, options) {
      // Enable variable arity by allowing the first argument to be the options
      // object and omitting the name argument.
      if (_.isObject(name)) {
        options = name;
      }

      // Ensure options is an object.
      options = options || {};

      // If a name property was specified use that as the template.
      if (_.isString(name)) {
        options.template = name;
      }

      // Check if a layout already exists, if so, update the template.
      if (this.layout) {
        this.layout.template = options.template;
      } else {
        // Create a new Layout with options.
        this.layout = new Backbone.Layout(_.extend({
          el: "#main"
        }, options));
      }

      // Cache the reference.
      return this.layout;
    }
  }, Backbone.Events);

});
