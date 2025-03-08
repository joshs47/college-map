// Initialize the map and set its view to a specific location and zoom level
var map = L.map("map").setView([39.754, -75.588], 5);

// Add a tile layer (map background) from OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Add a marker to the map
var marker = L.marker([39.754, -75.588])
  .addTo(map)
  .bindTooltip("Charter School of Wilmington", {
    permanent: false,
    direction: "top",
    offset: [0, -10],
  });

var googleSheetUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQeetniEzIb5VYYipz4mgbbg1LKT5FCOLvZ3zr-T4EKU-1L7TQQNJLq4BDokQu9OFx2Jh9mkRsswMzh/pub?gid=0&single=true&output=csv";

Papa.parse(googleSheetUrl, {
  download: true, // Fetch the file
  header: true,
  complete: function (results) {
    var universities = results.data; // Array of university objects

    // Add red dot markers with tooltips
    for (var i = 0; i < universities.length; i++) {
      var uni = universities[i];
      // Ensure coordinates are numbers
      var lat = parseFloat(uni.latitude);
      var lon = parseFloat(uni.longitude);

      if (!isNaN(lat) && !isNaN(lon)) {
        // Check for valid coordinates
        L.circleMarker([lat, lon], {
          radius: 5,
          fillColor: "#ff0000",
          color: "#ff0000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        })
          .addTo(map)
          .bindTooltip(uni.college_name, {
            permanent: false,
            direction: "top",
            offset: [0, -10],
          });
      }
    }

    // Fit the map to show all markers
    var group = new L.featureGroup(
      universities
        .filter(
          (u) =>
            !isNaN(parseFloat(u.latitude)) && !isNaN(parseFloat(u.longitude))
        )
        .map((u) =>
          L.circleMarker([parseFloat(u.latitude), parseFloat(u.longitude)], {
            radius: 5,
          })
        )
    );
    map.fitBounds(group.getBounds());
  },
  error: function (error) {
    console.error("Error fetching Google Sheet:", error);
  },
});
