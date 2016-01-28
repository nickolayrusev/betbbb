// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file and the JamJS
  // generated configuration file.
  deps: ["../vendor/jam/require.config", "main"],

  paths: {
    // Use the underscore build of Lo-Dash to minimize incompatibilities.
    "lodash": "../vendor/jam/lodash/lodash.underscore.min",
    "jquery": "../vendor/jam/jquery/jquery",
    // Put additional paths here.
    // JavaScript folders.
    "plugins" : "../vendor/js/plugins",
    "vendor": "../vendor",
    "handlebars": "../vendor/jam/handlebars/handlebars",
    "bootstrap":"../vendor/jam/bootstrap-amd/main",
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
