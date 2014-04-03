var data = require('./data');

var express = require("express");	// imports express
var app = express();				// create a new instance of express

// the bodyParser middleware allows us to parse the
// body of a request
app.use(express.urlencoded())
app.use(express.json())

data.add_user("yankjenets", "na");
data.add_user("excal", "na");
// data.get_random_game(function(game) {
// 	console.log(game);
// });

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

// Finally, activate the server at port 8889
app.listen(8889);