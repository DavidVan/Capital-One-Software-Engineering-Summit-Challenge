var searchTerm = '';
var latitude = '37.786882';
var longitude = '-122.766767';

var data;
var previousSearchTerm = '';
var previousBusiness = '';

var searchBox = document.getElementsByClassName('searchBox')[0];
var searchButton = document.getElementsByClassName('submitButton')[0];
var searchResultsArea = document.getElementsByClassName('searchResults')[0];

searchBox.addEventListener('input', function(e) {
    if (previousSearchTerm !== '' && searchBox.value.trim() === previousSearchTerm) {
        searchButton.value = 'Again';
    }
    else {
        searchButton.value = 'Search';
    }
});

searchButton.addEventListener('click', function(e) {
    e.preventDefault();
    if (searchBox.value.trim() === '') {
        return;
    }
    if (searchTerm !== '' && previousSearchTerm !== '' && searchTerm === searchBox.value.trim() && searchTerm === previousSearchTerm) {
        console.log("reusing data");
        searchResultsArea.innerHTML = makeBusiness();
    }
    else {
        searchTerm = searchBox.value.trim();
        previousSearchTerm = searchTerm;
        searchButton.value = 'Again';
        searchResultsArea.innerHTML = '';
        searchResultsArea.textContent = 'Loading Data...';
        var request = new XMLHttpRequest();
        request.open('POST', '/search', true);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                data = JSON.parse(request.responseText);
                console.log(request.responseText);
                if (data.businesses.length === 0) {
                    searchResultsArea.innerHTML = '';
                    searchResultsArea.textContent = 'Sorry, no results.';
                    return;
                }
                else {
                    searchResultsArea.innerHTML = makeBusiness();
                }
            }
            else {
                searchResultsArea.textContent = 'Looks like there was a problem getting search results. Please try again.';
                searchResultsArea.className += ' error';
            }
        };
        request.onerror = function() {
            searchResultsArea.textContent = 'Looks like there was a problem getting search results. Please try again.';
            searchResultsArea.className += ' error';
        };

        request.send('searchTerm=' + searchTerm + '&latitude=' + latitude + '&longitude=' + longitude);
    }
});

function makeBusiness() {
    var randomIndex = Math.floor(Math.random() * (data.businesses.length - 0)) + 0;
    var randomBusiness = data.businesses[randomIndex];
    if (randomBusiness.name.trim() === previousBusiness && data.business.length !== 1) {
        while (randomBusiness.name.trim() === previousBusiness) {
            randomIndex = Math.floor(Math.random() * (data.businesses.length - 0)) + 0;
            randomBusiness = data.businesses[randomIndex];
        }
    }
    var name = randomBusiness.name.trim();
    var address = randomBusiness.location.display_address.join('<br>').trim();
    var phone = randomBusiness.display_phone.trim();
    previousBusiness = name;
    var rating = randomBusiness.rating;
    var ratingImage = 'images/' + parseInt(rating) + 'star';
    if (!isInt(rating)) {
        ratingImage += 'half';
    }
    ratingImage += '.png';
    console.log(ratingImage);
    return '<div class="business">' +
               '<div class="businessImage">' +
                   '<img src="' + randomBusiness.image_url + '"' + 'alt="' + randomBusiness.name + '">' +
               '</div>' +
               '<div class="businessText">' +
                   '<h1>' + name + '</h1>' +
                   '<p>' + address + '</p>' +
                   '<p>' + phone + '</p>' +
                   '<br>' +
                   '<img src=' + ratingImage + ' alt=' + rating + ' stars' + '>'
               '</div>' +
            '</div>' +
            '<div class="map">' +

            '</div>';
}

function isInt(number) {
    return parseInt(number) === number;
}