// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file and the JamJS
  // generated configuration file.
  deps: ["../vendor/jam/require.config", "main"],

  paths: {
    // Use the underscore build of Lo-Dash to minimize incompatibilities.
    "lodash": "../vendor/jam/lodash/lodash.underscore.min",

    // Put additional paths here.
    // JavaScript folders.
    "plugins" : "../vendor/js/plugins",
    "vendor": "../vendor",
    "handlebars": "../vendor/handlebars/handlebars",
    "bootstrap":"../vendor/bootstrap/js/bootstrap",
    "localstorage":"../vendor/js/libs/backbone.localStorage"
  },

  map: {
    // Ensure Lo-Dash is used instead of underscore.
    "*": { "underscore": "lodash" }

    // Put additional maps here.
  },

  shim: {
    // Put shims here.
     // Twitter Bootstrap depends on jQuery.
    "bootstrap": ["jquery"],
  }

});
