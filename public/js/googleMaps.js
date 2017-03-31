function mapBusiness(address) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            document.getElementsByClassName('map')[0].style.display = "flex";
            map = new google.maps.Map(document.getElementById('googlemap'), {
                zoom: 16
            });
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            map.setCenter(results[0].geometry.location);
        }
        else {
            console.log(status);
            document.getElementsByClassName('map')[0].style.display = 'none';
        }
    });
};