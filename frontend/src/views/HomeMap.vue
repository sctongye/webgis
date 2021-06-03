<template>
<div>
  <div class="alert alert-danger m-0" v-show="apiError">
    {{ apiError.message }}
  </div>
  <div :id="mapid"></div>
</div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
delete  L.Icon.Default.prototype._getIconUrl

import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import 'leaflet.markercluster'

export default {
  data(){
    return {
      mapid: "mainmap",
      apiError: false,
      centerLatlng: [43.2121696, 143.2725181],
      zoomLv: 15,
    }
  },
  mounted() {
    // OpenStreetMapの定義
    const OSM = new L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        });
    // 地理院タイルの定義
    const GIA = new L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg", {
        attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
        });
    // GoogleMapサテライト
    const GMS = new L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}');

    // leafletアイコンの設定
    L.Icon.Default.mergeOptions({
      iconUrl: require( 'leaflet/dist/images/marker-icon.png'),
      iconRetinaUrl: require( 'leaflet/dist/images/marker-icon-2x.png'),
      shadowUrl: require( 'leaflet/dist/images/marker-shadow.png' )
    })

    // 地図表示
    let mymap = L.map( this.mapid , { center: L.latLng(this.centerLatlng), zoom: this.zoomLv,zoominfoControl: true,layers: [OSM] } )

    // 地図補足表示
      const baseMaps = {'マップ（OSM）': OSM,'航空写真（地理院）': GIA, '航空写真（GoogleMap）': GMS };
      L.control.layers(baseMaps, null,{collapsed: false}).addTo(mymap);
      L.control.scale({imperial: false,maxWidth: 300}).addTo(mymap);


  // axiosでbackendからポリゴンデータを取得、response.dataをMapDrowの各メソッドに渡す
    this.axios
        .get("/api/v1/soildata/")
        .then( response => ( this.pointControl(response.data,mymap)) )
        .catch( error => this.apiError = error)
    this.axios
        .get("/api/v1/polygondata/")
        .then( response => ( this.polygonControl(response.data,mymap)) )
        .catch( error => this.apiError = error)
    
  },
  methods: {
    pointControl: function(pointjson,mymap) {

      // マウスイベント制御
      function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
      }

      // マウスオーバー
      function highlightFeature(e) {
          var layer = e.target;
          layer.setStyle({
            radius: 15,
            fillColor: "#ff0000",
            color: "#ff0000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
          }
          info.update(layer.feature.properties)
      }

      // マウスアウト
      function resetHighlight(e) {
          pointJSON_K.resetStyle(e.target);
          pointJSON_P.resetStyle(e.target);
          info.update()
      }


      // 凡例の表示
      var info = L.control({position: 'bottomleft'});
      info.onAdd = function () {
          this._div = L.DomUtil.create('div', 'pointinfo');
          this.update();
          return this._div;
      };
      info.update = function (props) {
        console.log(props)
          this._div.innerHTML = (props
            ? '<div>pH' + props.ph + '</div>' +
              '<div>熱水抽出窒素' + props.nitrogen + '</div>' +
              '<div>有効態リン酸' + props.phosphoric_acid + '</div>' +
              '<div>交換性カリ' + props.potassium + '</div>' +
              '<div>交換性苦土' + props.magnesium + '</div>'
            : '土壌分析結果情報'
          );
      };
      info.addTo(mymap);

      // サークルアイコンの作成（リン酸）
      function customCircleMarkerP (feature, latlng) {

        let phosphoricAcidValue = feature['properties']["phosphoric_acid"]

        let geojsonMarkerOptions = {
              radius: 15,
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            }
            
        if      ( phosphoricAcidValue < 5  ) { geojsonMarkerOptions['fillColor'] = "#56C1FF"}
        else if ( phosphoricAcidValue < 10 ) { geojsonMarkerOptions['fillColor'] = "#73FDEA"}
        else if ( phosphoricAcidValue < 30 ) { geojsonMarkerOptions['fillColor'] = "#FFFC66"}
        else if ( phosphoricAcidValue < 60 ) { geojsonMarkerOptions['fillColor'] = "#FF9300"}
        else                                 { geojsonMarkerOptions['fillColor'] = "#FF644E"}

        return L.circleMarker(latlng, geojsonMarkerOptions)
      }

      // サークルアイコンの作成（加里）
      function customCircleMarkerK (feature, latlng) {

        let potassiumValue = feature['properties']["potassium"]

        let geojsonMarkerOptions = {
              radius: 15,
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            }
            
        if      ( potassiumValue < 8  ) { geojsonMarkerOptions['fillColor'] = "#56C1FF"}
        else if ( potassiumValue < 15 ) { geojsonMarkerOptions['fillColor'] = "#73FDEA"}
        else if ( potassiumValue < 30 ) { geojsonMarkerOptions['fillColor'] = "#FFFC66"}
        else if ( potassiumValue < 50 ) { geojsonMarkerOptions['fillColor'] = "#FF9300"}
        else                            { geojsonMarkerOptions['fillColor'] = "#FF644E"}

        return L.circleMarker(latlng, geojsonMarkerOptions)
      }

      // pointジオメトリの描画
      let pointJSON_K = L.geoJSON(pointjson,{ onEachFeature: onEachFeature, pointToLayer: customCircleMarkerK }).addTo(mymap)
      let pointJSON_P = L.geoJSON(pointjson,{ onEachFeature: onEachFeature, pointToLayer: customCircleMarkerP }).addTo(mymap)

      const soilStatus = {'有効態リン酸': pointJSON_K,'交換性カリ': pointJSON_P};
      L.control.layers(soilStatus, null,{collapsed: false}).addTo(mymap);

      // マーカークラスタの作成・表示
      var marker_P = L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: false,
        removeOutsideVisibleBounds: true,
        disableClusteringAtZoom: 16,
        maxClusterRadius: 50
      })

      var marker_K = L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: false,
        removeOutsideVisibleBounds: true,
        disableClusteringAtZoom: 16,
        maxClusterRadius: 50
      })

      marker_P.addLayer(pointJSON_K)
      marker_K.addLayer(pointJSON_P)

      mymap.addLayer(marker_P)
      mymap.addLayer(marker_K)


      // zoomレベルの確認
      mymap.on('move',function(){
        output(mymap)
      })

      function output(map) {
        var zoom = map.getZoom()
         console.log(zoom)
      }

    },
    polygonControl: function(polyjson,mymap) {

      // polygonジオメトリの描画
      let polyJSON = L.geoJSON(polyjson,{ onEachFeature: onEachFeature}).addTo(mymap)

      // マウスイベント制御
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
          polyJSON.resetStyle(e.target);
          info.update();
      }

      // 凡例の表示
      var info = L.control({position: 'bottomleft'});
      info.onAdd = function () {
          this._div = L.DomUtil.create('div', 'polyinfo');
          this.update();
          return this._div;
      };
      info.update = function (props) {
          this._div.innerHTML = (props
            ? '<b>' + props.year + '</b><br />' + props.remarks
            : 'Field Info'
          );
      };
      info.addTo(mymap);

      // ポリゴンクリックで遷移
      function moveGeoInfo() {
        window.location.href ="http://127.0.0.1:8000/fieldinfo"
      }
    },
  },
}
</script>

<style>
#mainmap {
  width: 100%;
  height: 100vh;
}

.polyinfo {
  font-size: 16px;
  width: 120px;
  height: 60px;
  background: white;
  border-radius: 5px;
  opacity: 0.7;
}

.pointinfo {
  font-size: 16px;
  width: 150px;
  height:150px;
  background: white;
  border-radius: 5px;
  opacity: 0.7;
}


.leaflet-control-layers{ 
  width: 210px;
  padding: 8px;
  opacity: 0.9;
  font-size: 14px;
  font-weight: bold;
  background-color:gainsboro;
}

label {
  padding: 4px;
}

</style>