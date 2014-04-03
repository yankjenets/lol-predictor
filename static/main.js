function get() {
	$.ajax({
		type: "get",
		url: "/recent_game",
		success: function(data) {
			console.log(data);
		}
	});
}