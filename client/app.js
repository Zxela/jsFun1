var socket = io();

$("form").on("submit", function() {
	var initials = $("#initials").val();
	var text = `${initials} ${$("#message").val()}`;
	socket.emit("message", text);
	$("#message").val("");
	return false;
});
socket.on("message", function(msg) {
	$("<li>")
		.text(msg)
		.appendTo("#history");
});
