const apiKey = "ex21C6CKlCuX6rpBRZEXgZyk3zOODA2v"; // very secure
const apiEndpointSearch = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&";
const usePlaceholders = true;

var savedSearches = ["garnet", "amethyst", "lapis lazuli", "peridot", "bismuth", "malachite", "sugilite", "sardonyx", "blue diamond"];


$(document).ready(function() {
	
	savedSearches.forEach(addSearchButton); // set up our initial buttons

	if (usePlaceholders) {

		var placeholders = [];
		for (var i=0; i<12; i++) {
			placeholders.push($('\
				<div class="result placeholder">\
					<img />\
					<p class="rating"></p>\
				</div>'));
		}
		
		// add all our placeholders to the results area
		$('#results').empty().append(placeholders);

	}


	$('#add-form').on("submit", function(event) {
		event.preventDefault(); // stop from submitting

		addSearchButton($('#add-terms').val(), true);

		$('#add-terms').val(""); // clear field
	})
	

	// add a button to the list by search term
	function addSearchButton(search, prepend) {
		if (search.trim() === "") return; // don't add empty buttons

		var button = $('<button>', {
			type: "button",
			class: "list-group-item list-group-item-action",
			text: search
		});

		if (prepend === true) {
			$('#search-list').prepend(button.addClass("new"));
		} else {
			$('#search-list').append(button);
		}
	}


	$('#search-list').on("click", "button", function() {
		searchFor($(this).text());

		$('#search-list button').removeClass("active");
		$(this).addClass("active");
	});

	// call API and display results
	function searchFor(search) {

		$.ajax({
			url: apiEndpointSearch + "q=" + encodeURIComponent(search),
			method: 'GET'
		}).then(response => {
			console.log(response);
			var results = response.data;

			$('#results').empty().append(results.map(result => {

				var item = $('<div>', {
					class: "result"
				});

				item.append(
					$('<img>', {
						"data-pause": "pause",
						src: result.images.original_still.url,
						"data-src-play": result.images.original.url,
						"data-src-pause": result.images.original_still.url
					})
				);

				item.append(
					$('<p>', {
						class: "rating",
						text: result.rating.toUpperCase()
					})
				);

				return item;

			}));

		});

	}

	// allow play/pause on click
	$('#results').on("click", ".result", function() {
		var img = $(this).find("img").first();

		if (img.attr("data-pause") === "pause") {
			img.attr("src", img.attr("data-src-play"));
			img.attr("data-pause", "play");
		} else {
			img.attr("src", img.attr("data-src-pause"));
			img.attr("data-pause", "pause");
		}

	});


});