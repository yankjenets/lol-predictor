var champ_list = null;
var BLUE_TEAM = 100;
var PURPLE_TEAM = 200;
var current_game = null;

$(function() {
	$("#add-summoner").click(function() {
		add_summoner();
	});

	$("#random-game").click(function() {
		random_game();
	});

	initialize_champ_list();

	$("#col1").click(function() {
		guess_team(BLUE_TEAM);
	});

	$("#col2").click(function() {
		guess_team(PURPLE_TEAM);
	});
});

function guess_team(team) {
	if (current_game != null) {
		if (current_game.winner == team) {
			$("#result").text("Correct!");
		} else {
			$("#result").text("Incorrect :(");
		}
		random_game();
	}
}

function sanitize_champ_list(obj) {
	var result = {};
	for (var key in obj.keys) {
		result[key] = obj.data[obj.keys[key]].name;
	}
	return result;
}

function initialize_champ_list() {
	var l_lang;
	if (navigator.userLanguage) { // Explorer
		l_lang = navigator.userLanguage;
	} else if (navigator.language) {// FF
		l_lang = navigator.language;
	} else {
		l_lang = "en_US";
	}
	l_lang = l_lang.replace("-", "_");
	$.ajax({
		type: "get",
		data: {
			locale: l_lang
		},
		url: "/champ_ids",
		success: function(response) {
			if (!response.error) {
				champ_list = sanitize_champ_list(response.data);
				random_game();
			}
		}
	});
}

function add_summoner() {
	var summoner_id = $("#summoner-id").val();
	var region = $("#region").val();
	//disable_add_summoner_button();
	$.ajax({
		type: "put",
		data: {
			summoner_id: summoner_id,
			region: region
		},
		url: "/add_summoner",
		success: function(response) {
			if (!response.error) {
				//enable_add_summoner_button();
				console.log("Summoner successfully added.");
			} else {
				if (response.error.name === "MongoError") {
					if (response.error.err.substring(0, "E11000".length) == "E11000") {
						console.log("Summoner has already been added.");
					} else if (response.error.err.substring(0, "Error: failed to connect to".length) === "Error: failed to connect to") {
						console.log("Could not connect to database.");
					} else {
						console.log("Other mongo error.");
					}
				} else if (response.error.name === "RiotAPI error") {
					console.log("Summoner does not exist with given name and region.");
				} else {
					console.log("Other unknown error.");
				}
				console.log(response.error);
			}
		}
	});
}

function random_game() {
	$.ajax({
		type: "get",
		url: "/recent_game",
		success: function(response) {
			if (!response.error) {
				console.log(response.game);
				set_game(response.game);
			} else {
				console.log(response.error);
			}
		}
	});
}

function set_game(game) {
	current_game = game;
	$("#col1").empty();
	$("#col2").empty();
	$("#col1").text("Blue Team");
	$("#col2").text("Purple Team");
	for (var character in game.blue_characters) {
		var div = $("<div></div>").text(champ_list[game.blue_characters[character]]);
		$("#col1").append(div);
	}
	for (var character in game.purple_characters) {
		var div = $("<div></div>").text(champ_list[game.purple_characters[character]]);
		$("#col2").append(div);
	}
}