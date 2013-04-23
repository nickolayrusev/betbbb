define([
  // Application.
  "app",
  "modules/Team"
],

function(app,Team) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {
		console.log("hello js");
		// Use main layout and set Views.
      app.useLayout("main-layout").setViews({
        ".commits": new Team.Views.AppView({model:new Team.ConfigModel({})})
      }).render();
    }
  });

  return Router;

});
