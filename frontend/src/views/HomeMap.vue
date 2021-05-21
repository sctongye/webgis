<template>
  <div id="map"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  data() {
    return {
      geojson: null,
    }
  },
  mounted() {
    // 地図表示中央
    const latlng = L.latLng( 43.2121696, 143.2725181 )

    // 地理院タイルの定義
    const t_ort = new L.tileLayer("http://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg", {
        attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
        });
    // OpenStreetMap
    const o_std = new L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        });

    // 地図表示
    var mymap = L.map( 'map', { center: latlng, zoom: 15,layers: [o_std] } )
    
    // 地図補足表示
    const baseMaps = {'OSM': o_std,'地理院': t_ort};
    L.control.layers(baseMaps, null,{collapsed: false}).addTo(mymap);
    L.control.scale({imperial: false,maxWidth: 300}).addTo(mymap);

    // マウスオーバー
    function onEachFeature(feature, layer) {
      layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
      });
    }

    function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        this.geojson.resetStyle(e.target);
        info.update();
    }

    // 凡例
    var info = L.control();
    info.onAdd = function () {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    info.update = function (props) {
        this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
            '<b>' + props.year + '</b><br />' + props.remarks + ' people / mi<sup>2</sup>'
            : 'Hover over a state');
    };
    info.addTo(mymap);


    // var geojson = L.geoJson(statesData, {
    //     onEachFeature: onEachFeature,
    // }).addTo(mymap);

    // backendからポリゴンデータを取得し表示
    this.axios
        .get("/api/v1/polygondata/")
        .then(response => (
            this.geojson = this.onPolygon(response.data,onEachFeature,mymap)
            // this.geojson = L.geoJSON(response.data).addTo(mymap)
      ));
    
  },
  methods: {
    onPolygon(geojson,onEachFeature,mymap){
      L.geoJSON(geojson,{ onEachFeature: onEachFeature}).addTo(mymap)



      
    }
    // onEachFeature(feature, layer) {
    //   layer.on({
    //       mouseover: highlightFeature,
    //       mouseout: resetHighlight,
    //   });
    // },
    // highlightFeature(e) {
    //     var layer = e.target;
    //     layer.setStyle({
    //         weight: 5,
    //         color: '#666',
    //         dashArray: '',
    //         fillOpacity: 0.7
    //     });
    //     if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    //         layer.bringToFront();
    //     }
    //     info.update(layer.feature.properties);
    // },
    // resetHighlight(geojson,e) {
    //     geojson.resetStyle(e.target);
    //     info.update();
    // }
  },

}

</script>

<style scoped>
#map {
  width: 100%;
  height: 100vh;
}
</style>