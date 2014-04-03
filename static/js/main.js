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
});

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