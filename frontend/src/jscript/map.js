import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// import 'leaflet-draw/dist/leaflet.draw.css'
// import 'leaflet-draw/dist/leaflet.draw.js'

// export default { mapDisplay, mapdisplayOption, drawPolygon,addGeoJson }
export default { mapDisplay, mapdisplayOption,addGeoJson }

// 地理院タイルの定義
const t_ort = new L.tileLayer("http://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg", {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
    });
// OpenStreetMap
const o_std = new L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
// MapBox
const mbs = new L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1Ijoic2luZGljdW0iLCJhIjoiY2tuYjQzcjJoMW5zdzJ2bGd5dTRjMzYzdyJ9.Mq3Qq4w9n3mj8kCtW7Uy3Q'
    });


// Mapを表示
function mapDisplay(mapid,latlng) {
    var mymap = L.map(mapid, {center: latlng, zoom: 16,layers: [o_std]});
    return mymap
}

// Map切り替えオプションの表示
function mapdisplayOption(mymap) {

    const baseMaps = {'OSM': o_std,'地理院': t_ort,'MapBox': mbs};

    L.control.layers(baseMaps, null,{collapsed: false}).addTo(mymap);
    L.control.scale({imperial: false,maxWidth: 300}).addTo(mymap);
}

// ポリゴン描画の表示
// function drawPolygon(mymap) {
//     var drawnItems = new L.FeatureGroup();
//     mymap.addLayer(drawnItems)

//     var drawControl = new L.Control.Draw({
//         draw: {
//         marker: false,
//         polyline: false,
//         circle: false,
//         circlemarker: false,
//         rectangle: false,
//         },
//         edit: {
//             featureGroup: drawnItems
//         }
//     })

//     mymap.addControl(drawControl)
//     mymap.on('draw:created', function (e) {
//         var layer = e.layer;
//         drawnItems.addLayer(layer);
        
//         var data = drawnItems.toGeoJSON();
//         var convertedData = JSON.stringify(data)

//         console.log(convertedData)
//     })
// }

function addGeoJson(mymap,geojson) {
    var polygonJSON = L.geoJSON(geojson).addTo(mymap)
    return polygonJSON
}


