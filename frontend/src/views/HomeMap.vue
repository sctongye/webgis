<template>
  <div id="{{mapid}}"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
delete  L.Icon.Default.prototype._getIconUrl
import MapDrow from '../mixins/MapDrow'

export default {
  data() {
    return{
      mapid: "mainmap",
    }
  },
  mounted() {
    // // leafletアイコンの設定
    // L.Icon.Default.mergeOptions({
    //   iconUrl: require( 'leaflet/dist/images/marker-icon.png'),
    //   iconRetinaUrl: require( 'leaflet/dist/images/marker-icon-2x.png'),
    //   shadowUrl: require( 'leaflet/dist/images/marker-shadow.png' )
    // })

    // // 地図表示中央
    // const latlng = L.latLng([43.2121696, 143.2725181])

    // // OpenStreetMap
    // const o_std = new L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //     });

    // // 地理院タイルの定義
    // const t_ort = new L.tileLayer("http://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg", {
    //     attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
    //     });

    // // 地図表示
    // var mymap = L.map( 'mainmap', { center: latlng, zoom: 15,layers: [o_std] } )
    
    // // 地図補足表示
    // const baseMaps = {'OSM': o_std,'地理院': t_ort};
    // L.control.layers(baseMaps, null,{collapsed: false}).addTo(mymap);
    // L.control.scale({imperial: false,maxWidth: 300}).addTo(mymap);


    // axiosでbackendからポリゴンデータを取得
    // response.dataをメソッドに渡す
    this.axios
        .get("/api/v1/polygondata/")
        .then(response => (
            this.polygonControl(response.data,mymap)
      ))
    this.axios
        .get("/api/v1/soildata/")
        .then(response => (
          this.pointControl(response.data,mymap)
      ))
  },
  methods: {
    polygonControl:function(geojson,mymap){

      // マウスオーバー関数
      function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: moveGeoInfo
        });
      }

      // マウスオーバー:ポリゴン情報の表示
      function highlightFeature(e) {
          var layer = e.target;
          layer.setStyle({
              weight: 5,
              color: '#ff0000',
              dashArray: '',
              fillOpacity: 0.7
          });
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
          }
          info.update(layer.feature.properties);
      }

      // マウスアウト:ポリゴン情報の非表示
      function resetHighlight(e) {
          geoJSON.resetStyle(e.target);
          info.update();
      }

      // 凡例の表示
      var info = L.control();
      info.onAdd = function () {
          this._div = L.DomUtil.create('div', 'info');
          this.update();
          return this._div;
      };
      info.update = function (props) {
          this._div.innerHTML = (props ? '<b>' + props.year + '</b><br />' + props.remarks : 'Field Info');
      };
      info.addTo(mymap);

      // geoJSONをマップに表示
      var geoJSON = L.geoJSON(geojson,{ onEachFeature: onEachFeature}).addTo(mymap)

      // ポリゴンクリックで遷移
      function moveGeoInfo() {
        window.location.href ="http://127.0.0.1:8000/fieldinfo"
      }
    },
    pointControl: function(pointjson,mymap){

      // マウスオーバー関数
      function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
      }

      // マウスオーバー:ポリゴン情報の表示
      function highlightFeature(e) {
          var layer = e.target;
          layer.setStyle({
            radius: 100,
            fillColor: "#ff0000",
            color: "#ff0000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
          }
      }

      // マウスアウト:ポリゴン情報の非表示
      function resetHighlight(e) {
          geoJSON.resetStyle(e.target);
      }

      
      function customCircleMarker (feature, latlng) {
        var geojsonMarkerOptions = {
            radius: 100,
            fillColor: "#fffc66",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }
        return L.circleMarker(latlng, geojsonMarkerOptions)
      }

      let geoJSON = L.geoJSON(pointjson,{ onEachFeature: onEachFeature, pointToLayer: customCircleMarker }).addTo(mymap)
    }
  },
  mixins: [MapDrow]
}
</script>

<style>
#mainmap {
  width: 100%;
  height: 100vh;
}
.info {
  font-size: 16px;
  width: 120px;
  height: 60px;
  background: white;
  border-radius: 5px;
  opacity: 0.9;
}
</style>