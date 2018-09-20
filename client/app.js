// assign variable to your websocket
var socket = io();

// handle form submit/new message
$("form").on("submit", function() {
	var initials = $("#initials").val();
	var text = $("#message").val();
	socket.emit("message", initials, text);
	$("#message").val("");
	return false;
});

// Add new messages to the bottom of the list
socket.on("message", function(initials, msg) {
	$("<li>")
		.text(`${initials} says: ${msg}`)
		.appendTo("#history");
});
