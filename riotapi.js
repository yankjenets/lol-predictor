var LolApi = require('leagueapi');
LolApi.init('1d4576bf-67fe-4d39-a522-34b80594a9fb', 'na');
LolApi.setRateLimit(10, 500);

module.exports = {
	get_summoner_id: get_summoner_id,
	get_games: get_games
}

function get_summoner_id(name, region, callback) {
	LolApi.Summoner.getByName(name, region, function(err, summoner) {
		callback(err, summoner[name].id);
	});
}

function get_games(summoner_id, region, callback) {
	console.log("summoner_id: " + summoner_id + "\nregion: " + region)
	LolApi.getRecentGames(summoner_id, region, function(err, games) {
		console.log(err);
		resultSet = [];
		console.log(games);
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

//{player_list: [list of longs], winning_characters: [list of champ ids], losing_characters: [list of champ ids], date: date, game_id: long}
function create_game_object(game, summoner_id, region) {
	result = {};
	player_list = [summoner_id];
	winning_team = 0;
	winning_characters = [];
	losing_characters = [];
	if (game.stats.win) {
		winning_characters.push(game.championId);
		winning_team = game.teamId;
	} else {
		losing_characters.push(game.championId);
		winning_team = oppositeTeam(game.teamId);
	}
	for (var i = 0; i < 9; i++) {
		player_list.push(game.fellowPlayers[i].summonerId);
		if (winning_team === game.fellowPlayers[i].teamId) {
			winning_characters.push(game.fellowPlayers[i].championId);
		} else {
			losing_characters.push(game.fellowPlayers[i].championId);
		}
	}
	result["player_list"] = player_list;
	result["winning_characters"] = winning_characters;
	result["losing_characters"] = losing_characters;
	result["_id"] = region + game.gameId.toString();
	result["date"] = game.createDate;
	return result;
}