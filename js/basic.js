
	us = jQuery.parseJSON(sessionStorage.getItem("user"));
	$('#name__').text(us.firstname+' '+us.lastname);
	$('#email__').text(us.email);
	$('#avatar__').attr("src",us.avatar);


	function create_menu(){

		$.ajax({
			method: "GET",
			url: "http://localhost/API/menu_lateral.php/1",
			dataType: "json"
		})
		.done(function(result) {
			var menu= "";
			$.each(result, function(i, n) {
				menu = menu+"<li class=\"no-padding\"><a class=\"waves-effect waves-grey\" href=\""+n.href+"\">"+n.name+"</a></li>";
			});
			$('#menu').append(menu);
		});

	}


	function create_notification(){


		$("#notification__ .noti").remove();


		$.ajax({
			method: "GET",
			url: "http://localhost/API/notifications.php/1",
			dataType: "json"
		})
		.done(function(result) {
			var menu= "";
			$.each(result, function(i, n) {
				menu = menu+" <li class='noti'><a href=\""+n.href+"\"><div class=\"notification\"><div class=\"notification-icon circle "+n.color+"\"> <i class=\"material-icons\">"+n.icon+"</i></div><div class=\"notification-text\"><p><b>"+n.emisor+"</b><br> "+n.name+"</p><span>"+n.created_at+"</span></div></div></a></li>";
			});

			$('#notification__').append(menu);

		});

	}
