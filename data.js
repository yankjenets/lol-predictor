var databaseUrl = "lol";
var collections = ["users", "games"];
var db = require("mongojs").connect(databaseUrl, collections);

var riotapi = require('./riotapi');

// db.users.find({}, function(err, users) {
// 	if (err || (users.length == 0)) {
// 		console.log("No users found.");
// 	} else {
// 		users.forEach(function(user) {
// 			console.log(user)
// 		});
// 	}
// });

function add_user(user, region) {
	riotapi.get_summoner_id(user, region, function(err, id) {
		if (err) {
			console.log("User does not exist.");
		} else {
			var new_user = {username: user, region: region, _id: region + id};
			db.users.save(new_user, function(err, saved) {
				if (err || !saved) {
					console.log("User " + user + " not saved.");
				} else {
					console.log("New user " + user + " saved.");
				}
			});
			_add_games(id, region);
		}
	});
}

function _add_games(user, region) {
	console.log("User: " + user + "\nregion: " + region);
	riotapi.get_games(user, region, function(err, games) {
		if (err) {
			console.log("Could not get games.");
		} else if (games.length === 0) {
			console.log("No valid games to add.");
		} else {
			games.forEach(function(game) {
				_add_game(game);
			});
		}
	});
}

function _add_game(game) {
	db.games.save(game, function(err, saved) {
		if (err || !saved) {
			console.log("Game " + game._id + " not saved.");
		} else {
			console.log("Game " + game._id + " saved.");
		}
	})
}

function _refresh_games() {
	db.users.find({}, function(err, users) {
		if (err) {
			console.log("Could not fetch all users.");
		} else {
			users.forEach(function(user) {
				_add_games(user.username, user.region);
			});
		}
	})
}

// 0 (inclusive) --> n (exclusive)
function _rand(n) {
	return Math.floor(Math.random * n);
}

function get_random_game(callback) {
	db.games.find({}, function(err, games) {
		if (err) {
			console.log("Could not get games.");
			callback(err, null);
		} else {
			console.log(games);
			var length = games.length;
			if (length > 0) {
				var index = _rand(length);
				callback(null, games[index]);
			} else {
				console.log("No games found.");
				callback("no games found", null)
			}
		}
	})
}

module.exports = {
	add_user: add_user,
	get_random_game: get_random_game
};