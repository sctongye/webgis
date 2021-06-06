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
      analysisItem: "P"
    }
  },
  mounted() {
    this.putMapControll()
    
  },
  methods: {
    getApiData: async function() {
    // backendからAPIデータを取得
      let soildata = null
      let polydata = null
      try { 
        [soildata, polydata] = await Promise.all([
          this.axios
            .get("/api/v1/soildata/")
            .catch( error => this.apiError = error), 
          this.axios
            .get("/api/v1/polygondata/")
            .catch( error => this.apiError = error)
        ])
      } catch(err) {
          console.log(err)
          return
      } 
      return {soildata: soildata.data, polydata: polydata.data}
    },
    putMapControll: async function(){
      // APIを非同期で得てからスクリプト実行
      let result = await this.getApiData()
      let soildata = result.soildata
      let polydata = result.polydata

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
      let mymap = L.map( this.mapid , {
              center: L.latLng(this.centerLatlng),
              zoom: this.zoomLv,
              zoominfoControl: true,
              layers: [OSM]
            } )

      // 地図補足表示

      // pointジオメトリの描画
      let pointJSON = L.geoJSON(soildata,{
                        onEachFeature: this.onEachFeatrue,
                        pointToLayer: this.customCircleMarker,
                      }).addTo(mymap)
      

      const polyJSON = this.polygonControl(polydata,mymap).addTo(mymap)
 
      const baseMaps = {'マップ（OSM）': OSM,'航空写真（地理院）': GIA, '航空写真（GoogleMap）': GMS };
      const geoLayer = {'圃場ポリゴン': polyJSON, '土壌分析地点': pointJSON}
      L.control.layers(baseMaps, geoLayer, {collapsed: false}).addTo(mymap);

      const soilStatus = {'有効態リン酸': pointJSON,'交換性カリ': pointJSON};
      // L.control.layers(soilStatus, null,{collapsed: false}).addTo(mymap)
      let legend = L.control.layers(soilStatus, null,{collapsed: false}).addTo(mymap)

      legend.addBaseLayer(pointJSON,'交換性苦土')
      // legend.removeLayer(pointJSON)
      // mymap.on({'overlayadd': (e) => { if (e.name === '土壌分析地点'){legend.addTo(mymap)} } })
      // mymap.on({'overlayremove': (e) => { if (e.name === '土壌分析地点') { legend.remove()} } })

      // 左下にスケール表示
      L.control.scale({imperial: false,maxWidth: 300}).addTo(mymap);


      this.makeLegend(mymap)
    },
    // const map = mymap
    onEachFeatrue: function(feature, layer) {
        layer.on("mouseover",function(e){
          var targetlayer = e.target
          targetlayer.setStyle({
            color: "#ff0000",
            weight: 2,
            fillOpacity: 1
          });
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              targetlayer.bringToFront()
          }
          let popUpInfo =
            '<div>pH' + targetlayer.feature.properties.ph + '</div>' +
            '<div>熱水抽出窒素' + targetlayer.feature.properties.nitrogen + '</div>' +
            '<div>有効態リン酸' + targetlayer.feature.properties.phosphoric_acid + '</div>' +
            '<div>交換性カリ' + targetlayer.feature.properties.potassium + '</div>' +
            '<div>交換性苦土' + targetlayer.feature.properties.magnesium + '</div>'
          layer.bindPopup(popUpInfo).openPopup()
        });
        layer.on("mouseout",function(e){
          var targetlayer = e.target
          targetlayer.setStyle({
            color: "#000",
            weight: 1,
            fillOpacity: 0.7
          });
          layer.closePopup()
        });
    },
    // pointControlメソッド
    customCircleMarker: function(geoJsonPoint, latlng) {
      
      let item = this.analysisItem
      console.log(item)

        let pointColor = {
          1: "#56C1FF",
          2: "#73FDEA",
          3: "#FFFC66",
          4: "#FF9300",
          5: "#FF644E",
          6: "#CB297B"
        }

        let geojsonMarkerOptions = {
          radius: 15,
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.7
        }

        let rate = geoJsonPoint['properties']["phosphoric_acid_rate"]
              
        if      ( rate === 1 ) { geojsonMarkerOptions['fillColor'] = pointColor[1]}
        else if ( rate === 2 ) { geojsonMarkerOptions['fillColor'] = pointColor[2]}
        else if ( rate === 3 ) { geojsonMarkerOptions['fillColor'] = pointColor[3]}
        else if ( rate === 4 ) { geojsonMarkerOptions['fillColor'] = pointColor[4]}
        else                   { geojsonMarkerOptions['fillColor'] = pointColor[5]}

        return L.circleMarker(latlng, geojsonMarkerOptions)
      },


      // // サークルアイコンの作成（加里）
      // function customCircleMarkerK (feature, latlng) {

      //   let rate = feature['properties']["potassium_rate"]
            
      //   if      ( rate === 1 ) { geojsonMarkerOptions['fillColor'] = pointColor[1]}
      //   else if ( rate === 2 ) { geojsonMarkerOptions['fillColor'] = pointColor[2]}
      //   else if ( rate === 3 ) { geojsonMarkerOptions['fillColor'] = pointColor[3]}
      //   else if ( rate === 4 ) { geojsonMarkerOptions['fillColor'] = pointColor[4]}
      //   else if ( rate === 5 ) { geojsonMarkerOptions['fillColor'] = pointColor[5]}
      //   else                   { geojsonMarkerOptions['fillColor'] = pointColor[6]}

      //   return L.circleMarker(latlng, geojsonMarkerOptions)
      // }

      // // サークルアイコンの作成（苦土）
      // function customCircleMarkerMg (feature, latlng) {

      //   let rate = feature['properties']["magnesium_rate"]
            
      //   if      ( rate === 1 ) { geojsonMarkerOptions['fillColor'] = pointColor[1]}
      //   else if ( rate === 2 ) { geojsonMarkerOptions['fillColor'] = pointColor[2]}
      //   else if ( rate === 3 ) { geojsonMarkerOptions['fillColor'] = pointColor[3]}
      //   else                   { geojsonMarkerOptions['fillColor'] = pointColor[5]}

      //   return L.circleMarker(latlng, geojsonMarkerOptions)
      // }



      // // マーカークラスタの作成・表示
      // var marker_P = L.markerClusterGroup({
      //   showCoverageOnHover: false,
      //   spiderfyOnMaxZoom: false,
      //   removeOutsideVisibleBounds: true,
      //   disableClusteringAtZoom: 16,
      //   maxClusterRadius: 50
      // })

      // mymap.addLayer(marker_P.addLayer(pointJSON_P))

      // var legend = L.control({position: 'bottomright'});
      // legend.onAdd = function () {
      //         var div = L.DomUtil.create('div', 'class')
      //         div.innerHTML = "<div>aaa</div>"
      //         return div;
      //     };
      // legend.addTo(mymap);

    polygonControl: function(polyjson) {

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
      }

      // マウスアウト:ポリゴン情報の非表示
      function resetHighlight(e) {
         console.log(polyJSON)
          polyJSON.resetStyle(e.target);

      }

      // ポリゴンクリックで遷移
      function moveGeoInfo() {
        window.location.href ="http://127.0.0.1:8000/fieldinfo"
      }
      
      // polygonジオメトリの描画
      let polyJSON = L.geoJSON(polyjson,{ onEachFeature: onEachFeature})

      return polyJSON
    },
    makeLegend: function(map){
      var legend = L.control({ position: 'topright' });
      legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'radio-button')
        div.innerHTML =
          '<div>' + 
            '<label><input type="radio" name="item" value="P" />有効態リン酸</label></br>'+
            '<label><input type="radio" name="item" value="K" />交換性カリ</label>'+
            '<input id="btn" type="button" value="送信" />' +
          '<div>'
        return div;
      };
      legend.addTo(map);

      console.log('makelegend')
      
      document.addEventListener('DOMContentLoad', function() {
        var getRadioValue = function(name)  {
          var result = '';
          var elems = document.getElementByName(name);
          for (var i = 0, len = elems.length; i < len; i++) {
            var elem = elem.item(i);
            if (elem.checked) {
              result = elem.value;
              break;
            }
          }
          return result;
        };
        console.log("test")

        document.getElementById('btn').addEventListener('click', function() {
          console.log(getRadioValue)
        },false)
      },false)
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
  background-color:#f8f9fa;
}

label {
  padding: 4px;
}
</style>