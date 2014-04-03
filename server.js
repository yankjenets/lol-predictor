var data = require('./data');

var express = require("express");	// imports express
var app = express();				// create a new instance of express

// the bodyParser middleware allows us to parse the
// body of a request
app.use(express.urlencoded())
app.use(express.json())

// data.add_user("yankjenets", "na");
// data.add_user("excal", "na");
// data.get_random_game(function(game) {
// 	console.log(game);
// });

app.put('/add_summoner', function(request, response) {
	var summoner_id = request.body.summoner_id;
	var region = request.body.region;
	data.add_user(summoner_id, region, function(err, obj) {
		if (err) {
			console.log(err);
			response.send({
				error: err
			});
		} else {
			console.log("no error");
			response.send({
				error: null
			});
		}
	});
});

app.get('/recent_game', function(request, response) {
	//LolApi.Summoner.getByName('yankjenets', 'na', function(err, summoner) {
	LolApi.Summoner.getByName(data.get_user(), 'na', function(err, summoner) {
		if (!err) {
			response.send({
				player: summoner,
				success: true
			});
		} else {
			reponse.send({
				success: false
			});
		}
	})
});

// This is for serving files in the static directory
app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});

app.get("/static/css/:staticFilename", function (request, response) {
    response.sendfile("static/css/" + request.params.staticFilename);
});

app.get("/static/js/:staticFilename", function (request, response) {
    response.sendfile("static/js/" + request.params.staticFilename);
});

// Finally, activate the server at port 8889
var server = app.listen(8889);

function cleanup() {
	console.log("Attempting to cleanup.");
	server.close();
	data.close_mongo();
	process.exit();

	setTimeout(function() {
		console.log("Timed out while attempting to clean up.");
		process.exit(1);
	}, 30 * 1000); // 30 seconds
}

process.on("uncaughtException", function (err) {
	console.log("Uncaught exception: " + err);
	cleanup();
});

process.on("SIGINT", function (err) {
	console.log("SIGINT sent.");
	cleanup();
});