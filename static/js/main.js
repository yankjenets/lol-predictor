function get() {
	$.ajax({
		type: "get",
		url: "/recent_game",
		success: function(data) {
			console.log(data);
		}
	});
}

$(function() {
	$("#add-summoner").click(function() {
		add_summoner();
	});

	initialize_champ_list();
});

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
		success: function(data) {
			console.log(data);
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
			} else {
				console.log(response.error);
			}
		}
	});
}