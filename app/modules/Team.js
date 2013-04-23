define([
// Application.
"app"],

// Map dependencies from above array.
function(app) {
	// Create a new module.
	var Team = app.module();

	// Default model.
	Team.Model = Backbone.Model.extend({
		defaults:{
			"isCorrect":true
		}
	});
	
	// Default model.
	Team.ConfigModel = Backbone.Model.extend({
		defaults:{
			"n":0,
			"r":0,
			"totalStake":10,
			"stakeForColumn":1
		}
	});
	
	// Default collection.
	Team.Collection = Backbone.Collection.extend({
		localStorage: new Backbone.LocalStorage("LibraryStorage"),
		model:Team.Model
	});
	
	// Default collection.
	Team.ConfigCollection = Backbone.Collection.extend({
		localStorage: new Backbone.LocalStorage("Config"),
		model:Team.ConfigModel
	});
	
	

	// Default views
	Team.Views.AppView = Backbone.View.extend({
		template : "main-template",
		className:"form-inline",
		initialize : function() {
			this.collection = new Team.Collection();
			this.config = new Team.ConfigCollection();
			this.listenTo(this.collection, 'add', this.addOne);
      		this.listenTo(this.collection, 'all', this.allEventsFromCollection);
      		this.collection.fetch();
      		this.config.fetch();
			if (this.config.length == 0) {
				this.config.add(this.model);
				this.model.save();
			} else {
				this.model = this.config.at(0);
			}
      		this.listenTo(this.model, 'change', this.onModelChange);
			  
		},
		events : {
			"change #selectbox" : "changed",
			"click input.-calculate":"onBtnCalculateClick",
			"click input.-clear":"onbuttonclear",
			"keyup input.-totalStake":"onChangeTotalStake"
		},
		afterRender : function(){
			var me = this;
			this.$el.find("select").find("option").each(function(){
			  if ($(this).val() == ( me.config.at(0).get("r") +"-" + me.config.at(0).get("n") ))
			    $(this).attr("selected","selected");
			});
		},
		serialize : function() {
			return {
				"conf":this.model.toJSON()
			}
		},
		onModelChange : function(model){
			console.log("on model change",model);
			this.model.save();
		},
		removeChildViews : function(){
			this.getView(function(view){
				view.model.destroy();
				view.remove();
			});
		},
		onChangeTotalStake : function(e){
			var value = e.target.value;
			var numberOfColumns=this.$el.find("#numberOfColumns").val();
			this.$el.find("#stakeForColumn").val(value/numberOfColumns);
		},
		onBtnCalculateClick:function(){
			console.log(this);
			var arrayOfCombs = Team.k_combinations(this.collection,this.config.at(0).get("r"));
			var sumOfCoefs = 0;
			for(var i = 0; i<arrayOfCombs.length;i++){
				var current = 1;
				for(var j = 0;j<arrayOfCombs[i].length;j++){
					var currentModel = arrayOfCombs[i][j];
						if(currentModel.get("isCorrect")==true){
							current *= currentModel.get("coef");
					} else {
						current *= 0;
					}
				}
				sumOfCoefs+=current;
			}
			app.layout.setView(".result",new Team.Views.Result({model:new Backbone.Model({sum:sumOfCoefs*this.config.at(0).get('stakeForColumn')})})).render();
		},
		
		onbuttonclear : function(e) {
			this.removeChildViews();
		},
		allEventsFromCollection : function(e,m){
			//console.log("collection event:",e," model:",m);
		},
		addOne: function(mod){
			 //console.log('addOne event raised. Model is ',mod);
			 var view = new Team.Views.Item({model: mod});
			 this.insertView(view).render();
		},
		changed : function(e) {
			//n=3,r=2
			this.removeChildViews();
			if(e.target.value=="select-menu"){
				return ;
			}
			var n = e.target.value.split("-")[1], r = e.target.value.split("-")[0];
			var numberOfColumns = Team.CalculateCombinations(n, r);
			this.$el.find("#numberOfColumns").val(numberOfColumns);
			var totalStake = this.$el.find("#totalStake").val();
			this.$el.find("#stakeForColumn").val(totalStake/numberOfColumns);
			this.model.set({"n":n,"r":r,"stakeForColumn":totalStake/numberOfColumns,"numberOfColumns":numberOfColumns});
			for (var c = 1; c <= n; c++) {
				var itemModel = new Team.Model({count:c});
				this.collection.add(itemModel);
				itemModel.save();
			}
		}
	});
	Team.Views.Result = Backbone.View.extend({
		template:"result",
		serialize : function() {
			return {
				"model":this.model.toJSON()
			}
		}
		
	});
	// item view
	Team.Views.Item = Backbone.View.extend({
		template : "item",
		initialize : function() {
			this.listenTo(this.model, 'change', this.onModelChanged);
      		this.listenTo(this.model, 'destroy', this.remove);
		},
		events : {
			"change input.-home":"onHomeTeamChange",
			"change input.-visitor":"onVisitorTeamChange",
			"change input.-coef":"onCoefChange",
			"change input.-iscorrect":"isCorrect"
		},
		onModelChanged : function(model){
			//console.log("model is changed",this.model);
			this.model.save();	
		},
		onHomeTeamChange: function(e){
			this.model.set("homeTeam",e.target.value);
		},
		onVisitorTeamChange: function(e){
			this.model.set("visitorTeam",e.target.value);
		},
		onCoefChange : function(e){
			this.model.set("coef",e.target.value);
		},
		isCorrect : function(e){
			this.model.set("isCorrect",$(e.target).is(":checked"));
		},		
		
		afterRender: function() {
			var allTeams = Team.PremierShipTeams();
			allTeams = allTeams.concat(Team.ChampionShipTeams());
			allTeams = allTeams.concat(Team.PrimeraDivisionTeams());
			this.$el.find("input[type=text]").typeahead({
				source : allTeams
			});
		},

		serialize : function() {
			return {
				"cid":this.cid,"count":this.model.get('count'),"model":this.model.toJSON()
			}
		},
	});
	Team.PremierShipTeams = function(){
		return ["Manchester United", "Manchester City", "Tottenham Hotspur", "Chelsea", "Arsenal", "Everton", "Liverpool", "Swansea City", "West Bromwich Albion", "Fulham", "Stoke City", "West Ham United", "Norwich City", "Sunderland", "Newcastle United", "Southampton", "Wigan Athletic", "Aston Villa", "Reading", "Queens Park Rangers"];
	},
	Team.ChampionShipTeams = function(){
		return ["Cardiff City","Watford","Hull City","Crystal Palace","Leicester City","Brighton & Hove Albion","Nottingham Forest","Middlesbrough","Bolton Wanderers","Leeds United","Burnley","Derby County","Blackburn Rovers","Charlton Athletic","Millwall","Huddersfield Town","Blackpool","Birmingham City","Ipswich Town","Sheffield Wednesday","Wolverhampton Wanderers","Barnsley","Peterborough United","Bristol City"];
	},
	Team.PrimeraDivisionTeams = function(){
		return ["Barcelona","Real Madrid","Atl?tico Madrid","Real Sociedad","M?laga","Valencia","Real Betis","Getafe","Rayo Vallecano","Sevilla","Espanyol","Levante","Real Valladolid","Athletic Club","Osasuna","Deportivo La Coru?a","Granada","Real Zaragoza","Mallorca","Celta de Vigo"];
	},
	Team.Factoriel = function(num) {
		var rval = 1;
		for (i = 2; i <= num; i++)
			rval = rval * i;
		return rval;
	}; 
	Team.CalculateCombinations = function(n,r){
		var num = Team.Factoriel(n), rum = Team.Factoriel(n-r), thi = Team.Factoriel(r);
		return num / (rum*thi);
		
	};

	/**
	 * K-combinations
	 *
	 * Get k-sized combinations of elements in a set.
	 *
	 * Usage:
	 *   k_combinations(set, k)
	 *
	 * Parameters:
	 *   set: Array of objects of any type. They are treated as unique.
	 *   k: size of combinations to search for.
	 *
	 * Return:
	 *   Array of found combinations, size of a combination is k.
	 *
	 * Examples:
	 *
	 *   k_combinations([1, 2, 3], 1)
	 *   -> [[1], [2], [3]]
	 *
	 *   k_combinations([1, 2, 3], 2)
	 *   -> [[1,2], [1,3], [2, 3]
	 *
	 *   k_combinations([1, 2, 3], 3)
	 *   -> [[1, 2, 3]]
	 *
	 *   k_combinations([1, 2, 3], 4)
	 *   -> []
	 *
	 *   k_combinations([1, 2, 3], 0)
	 *   -> []
	 *
	 *   k_combinations([1, 2, 3], -1)
	 *   -> []
	 *
	 *   k_combinations([], 0)
	 *   -> []
	 */
	Team.k_combinations = function(set, k) {
		var i, j, combs, head, tailcombs;

		if (k > set.length || k <= 0) {
			return [];
		}

		if (k == set.length) {
			return [set];
		}

		if (k == 1) {
			combs = [];
			for ( i = 0; i < set.length; i++) {
				combs.push([set[i]]);
			}
			return combs;
		}

		// Assert {1 < k < set.length}

		combs = [];
		for ( i = 0; i < set.length - k + 1; i++) {
			head = set.slice(i, i + 1);
			tailcombs = Team.k_combinations(set.slice(i + 1), k - 1);
			for ( j = 0; j < tailcombs.length; j++) {
				combs.push(head.concat(tailcombs[j]));
			}
		}
		return combs;
	}

	// Return the module for AMD compliance.
	return Team;

});
