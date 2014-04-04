var LolApi = require('leagueapi');
var BLUE_TEAM = 100;
LolApi.init('1d4576bf-67fe-4d39-a522-34b80594a9fb', 'na');
LolApi.setRateLimit(10, 500);

module.exports = {
	get_summoner_id: get_summoner_id,
	get_games: get_games
}

// LolApi.getChampions(false, "eune", function(err, champions) {
// 	console.log(champions);
// });

function get_summoner_id(name, region, callback) {
	LolApi.Summoner.getByName(name, region, function(err, summoner) {
		if (err) {
			callback(err, null);
		} else {
			callback(err, summoner[name].id);
		}
	});
}

function get_games(summoner_id, region, callback) {
	LolApi.getRecentGames(summoner_id, region, function(err, games) {
		resultSet = [];
		games.forEach(function(game) {
			if (game.subType === "RANKED_SOLO_5x5") {
				resultSet.push(create_game_object(game, summoner_id, region));
			}
		});
		callback(err, resultSet);
	});
}

function oppositeTeam(t) {
	if (t === 200) {
		return 100;
	} else if (t === 100) {
		return 200;
	} else {
		console.log("Invalid team ID given.");
		return null;
	}
}

//{player_list: [list of longs], blue_characters: [list of champ ids], purple_characters: [list of champ ids], winner: long, date: date, game_id: long}
function create_game_object(game, summoner_id, region) {
	result = {};
	player_list = [summoner_id];
	winner = 0;
	blue_characters = [];
	purple_characters = [];
	if (game.teamId === BLUE_TEAM) {
		blue_characters.push(game.championId);
	} else {
		purple_characters.push(game.championId);
	}
	if (game.stats.win) {
		winner = game.teamId;
	} else {
		winner = oppositeTeam(game.teamId);
	}
	for (var i = 0; i < 9; i++) {
		player_list.push(game.fellowPlayers[i].summonerId);
		if (game.fellowPlayers[i].teamId === BLUE_TEAM) {
			blue_characters.push(game.fellowPlayers[i].championId);
		} else {
			purple_characters.push(game.fellowPlayers[i].championId);
		}
	}
	result["player_list"] = player_list;
	result["blue_characters"] = blue_characters;
	result["purple_characters"] = purple_characters;
	result["_id"] = region + game.gameId.toString();
	result["date"] = game.createDate;
	result["winner"] = winner;
	return result;
}