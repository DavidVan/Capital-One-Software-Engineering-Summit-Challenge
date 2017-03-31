var searchTerm = '';
var latitude = '';
var longitude = '';

var addressForMap = '';

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    },
    function(error) {
        if (error) {
            getRoughLocation();
        }
    });
}
else {
    getRoughLocation();
}

function getRoughLocation() {
    if (navigator.geolocation) {
        console.log('Unable to get your location. Estimating location via IP address!'); // No need to alert in this case!
    }
    else {
        alert('Unable to get your location. Your browser doesn\'t support geolocation. Please upgrade your browser! For now, estimating location via IP address!');
    }
    // Get rough location from user's IP.
    var request = new XMLHttpRequest();
    request.open('POST', '/getcoords', true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            latitude = data.lat;
            longitude = data.lon;
        }
        else {
            if (navigator.geolocation) {
                alert('Unable to get location from your IP address. Please check your connection and/or allow geolocation access and try again!');
            }
            else {
                alert('Unable to get location from your IP address. Please check your connection and try again! Again, your browser doesn\'t support geolocation. Please consider updating/upgrading your browser...');
            }
        }
    }

    request.onerror = function() {
        searchResultsArea.textContent = 'Location isn\'t set. You cannot use this application!';
        searchResultsArea.className += ' error';
    };

    request.send();
}

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
    searchResultsArea.className = 'searchResults';
    if (searchBox.value.trim() === '') {
        return;
    }
    if (latitude === '' || longitude === '') {
        console.log('Either it\'s taking a while to set coordinates (browser issue/implementation?), or there\'s no coordinates!')
        return;
    }
    if (searchTerm !== '' && previousSearchTerm !== '' && searchTerm === searchBox.value.trim() && searchTerm === previousSearchTerm) {
        searchResultsArea.innerHTML = makeBusiness();
        mapBusiness(addressForMap);
    }
    else {
        searchTerm = searchBox.value.trim();
        previousSearchTerm = searchTerm;
        searchButton.value = 'Again';
        searchResultsArea.innerHTML = '';
        document.getElementsByClassName('map')[0].style.display = 'none';
        searchResultsArea.textContent = 'Loading Data...';
        var request = new XMLHttpRequest();
        request.open('POST', '/search', true);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                data = JSON.parse(request.responseText);
                if (data.businesses.length === 0) {
                    searchResultsArea.innerHTML = '';
                    searchResultsArea.textContent = 'Sorry, no results.';
                    return;
                }
                else {
                    searchResultsArea.innerHTML = makeBusiness();
                    mapBusiness(addressForMap);
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
    var address = randomBusiness.location.display_address.join(',<br>').trim();
    if (randomBusiness.location.display_address.length === 2) {
        addressForMap = randomBusiness.location.display_address.join(',').trim();
    }
    else if (randomBusiness.location.display_address.length === 3) {
        addressForMap = randomBusiness.location.display_address[0] + ',' + randomBusiness.location.display_address[2];
    }
    else {
        addressForMap = randomBusiness.location.display_address[0];
    }
    var phone = randomBusiness.display_phone.trim();
    previousBusiness = name;
    var rating = randomBusiness.rating;
    var ratingImage = 'images/' + parseInt(rating) + 'star';
    if (!isInt(rating)) {
        ratingImage += 'half';
    }
    ratingImage += '.png';
    var source = '<div class="business">' +
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
                     '</div>'
                 '</div>';
    return source;
}

function isInt(number) {
    return parseInt(number) === number;
}