var socket = io();

$("form").on("submit", function() {
	var initials = $("#initials").val();
	var text = $("#message").val();
	socket.emit("message", initials, text);
	$("#message").val("");
	return false;
});
socket.on("message", function(initials, msg) {
	$("<li>")
		.text(`${initials} says: ${msg}`)
		.appendTo("#history");
});
