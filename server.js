var data = require('./data');

var express = require("express");	// imports express
var app = express();				// create a new instance of express

var http = require("http");

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
			response.send({
				error: null
			});
		}
	});
});

app.get('/recent_game', function(request, response) {
	data.get_random_game(function(err, game) {
		if (err) {
			console.log(err);
			response.send({
				error: err
			});
		} else {
			console.log("THe game: " + game);
			response.send({
				error: null,
				game: game
			});
		}
	});
});

app.get('/champ_ids', function (request, response) {
	var locale = request.query.locale;
	var URL = "http://prod.api.pvp.net/api/lol/static-data/na/v1.1/champion?locale=" +
			  locale + "&champData=keys&api_key=1d4576bf-67fe-4d39-a522-34b80594a9fb";
	var jsonObj = '';
	http.get(URL, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			jsonObj += chunk;
		});	
		res.on('error', function(error) {
			response.send({
				name: "RESTError",
				err: error
			});
		});
		res.on('end', function () {
            try {
                jsonObj = JSON.parse(jsonObj);
            } catch (e) {
                response.send({
                	error: {
                		name: "RESTError",
                		err: res.statusCode
                	}
                });            
            }
            if (jsonObj.status && jsonObj.status.message !== 200) {
                response.send({
                	error: {
                		name: "RESTError",
                		err: jsonObj.status.message
                	}
                });
            } else {
                response.send({
                	data: jsonObj,
                	error: null
                });
            }
        });
	});
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