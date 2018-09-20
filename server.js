var express = require("express");
var app = express();

var http = require("http");
var server = http.Server(app);

app.use(express.static("client"));

var io = require("socket.io")(server);

function isQuestion(msg) {
	return msg.match(/\?$/);
}
function askingTime(msg) {
	return msg.match(/time/i);
}
function askingWeather(msg) {
	return msg.match(/weather/i);
}
function getWeather(callback) {
	var request = require("request");
	request.get("https://www.metaweather.com/api/location/4118/", function(error, response) {
		if (!error && response.statusCode == 200) {
			console.log(response.body);
			var data = JSON.parse(response.body);
			var weather = data.consolidated_weather[0];
			callback(
				`Currently the forecast is ${weather.weather_state_name} with winds blowing ${
					weather.wind_direction_compass
				} at ${Math.round(weather.wind_speed)}... Currently it is ${Math.round(
					weather.the_temp
				)} with a high of ${Math.round(weather.max_temp)} and a low of ${Math.round(weather.min_temp)}.`
			);
		}
	});
}

io.on("connection", function(socket) {
	socket.on("message", function(initials, msg) {
		if (!isQuestion(msg)) {
			io.emit("message", initials, msg);
			// if asking the time
		} else if (askingTime(msg)) {
			io.emit("message", initials, msg);
			// adding timeout to simulate thinking...
			setTimeout(function() {
				io.emit("message", "Chatbot", new Date().toTimeString().substr(0, 8));
			}, 500);
			// if asking the weather
		} else if (askingWeather(msg)) {
			io.emit("message", initials, msg);
			getWeather(function(forecast) {
				io.emit("message", "Chatbot", forecast);
			});
		}
	});
});

server.listen(8080, function() {
	console.log("Chat server running");
});
