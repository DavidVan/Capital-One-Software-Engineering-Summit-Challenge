function mapBusiness(latitude, longitude) {
    var businessLocation = {lat: latitude, lng: longitude};
    document.getElementsByClassName('map')[0].style.display = "flex";
    var map = new google.maps.Map(document.getElementById('googlemap'), {
        zoom: 16,
        center: businessLocation
    });
    var marker = new google.maps.Marker({
        position: businessLocation,
        map: map
    });
};