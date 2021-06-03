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
      apiError: false
    }
  },
  mounted() {
    // プロパティ初期値の定義
    var centerLatlng = [43.2121696, 143.2725181]
    var zoomLv = 15
    var mapInfo = true

    // OpenStreetMapの定義
    const o_std = new L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        });
    // 地理院タイルの定義
    const t_ort = new L.tileLayer("http://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg", {
        attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
        });

    // leafletアイコンの設定
    L.Icon.Default.mergeOptions({
      iconUrl: require( 'leaflet/dist/images/marker-icon.png'),
      iconRetinaUrl: require( 'leaflet/dist/images/marker-icon-2x.png'),
      shadowUrl: require( 'leaflet/dist/images/marker-shadow.png' )
    })

    // 地図表示
    let mymap = L.map( this.mapid , { center: L.latLng(centerLatlng), zoom: zoomLv,zoominfoControl: true,layers: [o_std] } )

    // 地図補足表示
    if (mapInfo === true) {
      const baseMaps = {'OSM': o_std,'地理院': t_ort};
      L.control.layers(baseMaps, null,{collapsed: false}).addTo(mymap);
      L.control.scale({imperial: false,maxWidth: 300}).addTo(mymap);
    }


  // axiosでbackendからポリゴンデータを取得、response.dataをMapDrowの各メソッドに渡す
    this.axios
        .get("/api/v1/soildata/")
        .then( response => ( this.pointControl(response.data,mymap)) )
        .catch( error => this.apiError = error)
    this.axios
        .get("/api/v1/polygondata/")
        .then( response => ( this.polygonControl(response.data,mymap)) )
        .catch( error => this.apiError = error)
    
    // L.controll().onAdd

  },
  methods: {
    pointControl: function(pointjson,mymap) {

  //     // マウスイベント制御
  //     function onEachFeature(feature, layer) {
  //       layer.on({
  //           mouseover: highlightFeature,
  //           mouseout: resetHighlight,
  //       });
  //     }

  //     // マウスオーバー
  //     function highlightFeature(e) {
  //         var layer = e.target;
  //         layer.setStyle({
  //           radius: 40,
  //           fillColor: "#ff0000",
  //           color: "#ff0000",
  //           weight: 1,
  //           opacity: 1,
  //           fillOpacity: 0.8
  //         });
  //         if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
  //             layer.bringToFront();
  //         }
  //     }

  //     // マウスアウト
  //     function resetHighlight(e) {
  //         pointJSON_K.resetStyle(e.target);
  //         pointJSON_P.resetStyle(e.target);

  //     }

  //     // サークルアイコンの作成（加里）
  //     function customCircleMarkerK (feature, latlng) {

  //       let potassiumValue = feature['properties']["potassium"]

  //       var geojsonMarkerOptions = {
  //             radius: 40,
  //             color: "#000",
  //             weight: 1,
  //             opacity: 1,
  //             fillOpacity: 0.8
  //           }
            
  //       if        ( potassiumValue < 8 )  { geojsonMarkerOptions['fillColor'] = "#56C1FF"
  //       } else if ( potassiumValue < 15 ) { geojsonMarkerOptions['fillColor'] = "#73FDEA"
  //       } else if ( potassiumValue < 30 ) { geojsonMarkerOptions['fillColor'] = "#FFFC66"
  //       } else if ( potassiumValue < 50)  { geojsonMarkerOptions['fillColor'] = "#FF9300"
  //       } else                            { geojsonMarkerOptions['fillColor'] = "#FF644E"
  //       }

  //       return L.circleMarker(latlng, geojsonMarkerOptions)
  //     }


  //     // サークルアイコンの作成（リン酸）
  //     function customCircleMarkerP (feature, latlng) {

  //       let phosphoricAcidValue = feature['properties']["phosphoric_acid"]

  //       var geojsonMarkerOptions = {
  //             radius: 40,
  //             color: "#000",
  //             weight: 1,
  //             opacity: 1,
  //             fillOpacity: 0.8
  //           }
            
  //       if        ( phosphoricAcidValue < 5 )  { geojsonMarkerOptions['fillColor'] = "#56C1FF"
  //       } else if ( phosphoricAcidValue < 10 ) { geojsonMarkerOptions['fillColor'] = "#73FDEA"
  //       } else if ( phosphoricAcidValue < 30 ) { geojsonMarkerOptions['fillColor'] = "#FFFC66"
  //       } else if ( phosphoricAcidValue < 60)  { geojsonMarkerOptions['fillColor'] = "#FF9300"
  //       } else                                 { geojsonMarkerOptions['fillColor'] = "#FF644E"
  //       }

  //       return L.circleMarker(latlng, geojsonMarkerOptions)
  //     }


  //     // pointジオメトリの描画
  //     let pointJSON_K = L.geoJSON(pointjson,{ onEachFeature: onEachFeature, pointToLayer: customCircleMarkerK }).addTo(mymap)
  //     let pointJSON_P = L.geoJSON(pointjson,{ onEachFeature: onEachFeature, pointToLayer: customCircleMarkerP }).addTo(mymap)

  //     const soilStatus = {'有効態リン酸': pointJSON_K,'交換性カリ': pointJSON_P};
  //     L.control.layers(soilStatus, null,{collapsed: false}).addTo(mymap);


      // zoomレベルの確認
      mymap.on('move',function(){
        output(mymap)
      })

      function output(map) {
        var zoom = map.getZoom()
         console.log(zoom)
      }


    // var marker_P = L.markerClusterGroup({
    //   showCoverageOnHover: false,
    //   spiderfyOnMaxZoom: false,
    //   removeOutsideVisibleBounds: true,
    //   disableClusteringAtZoom: 16,
    //   maxClusterRadius: 30
    // })

    // var marker_K = L.markerClusterGroup({
    //   showCoverageOnHover: false,
    //   spiderfyOnMaxZoom: false,
    //   removeOutsideVisibleBounds: true,
    //   disableClusteringAtZoom: 16,
    //   maxClusterRadius: 30
    // })


    let markerGroup1 = []
    let markerGroup2 = []
    // ピンポイント座標に基づくマーカーの生成
    for (var i = 0; i <pointjson["features"].length; i++) {
      
      let lng = pointjson["features"][i]['geometry']['coordinates'][1]
      let lat = pointjson["features"][i]['geometry']['coordinates'][0]
      let phosphoricAcidValue = pointjson["features"][i]['properties']["phosphoric_acid"]
      let potassiumValue = pointjson["features"][i]['properties']["potassium"]
      let valueSet = [ phosphoricAcidValue , potassiumValue]


      markerGroup1.push(L.circle([lng,lat], circleOptions(valueSet,0)))
      markerGroup2.push(L.circle([lng,lat], circleOptions(valueSet,1)))
      // marker_P.addLayer(L.circle([lng,lat], circleOptions(valueSet,0)).addTo(mymap))
      // marker_K.addLayer(L.circle([lng,lat], circleOptions(valueSet,1)).addTo(mymap))
    }

    let marker_P = L.layerGroup(markerGroup1).addTo(mymap)
    let marker_K = L.layerGroup(markerGroup2).addTo(mymap)

    // mymap.addLayer(marker_P)
    // mymap.addLayer(marker_K)

    const soilStatus = {'有効態リン酸': marker_P,'交換性カリ': marker_K};
    L.control.layers(soilStatus, null,{collapsed: false}).addTo(mymap);
    // const soilStatus = {'有効態リン酸': marker_P,'交換性カリ': marker_K};
    // L.control.layers(soilStatus, null,{collapsed: false}).addTo(mymap);



    function circleOptions(valueSet,int) {

      let options = {
                      radius: 50,
                      // fillColor: ,
                      color: "#000",
                      weight: 1,
                      opacity: 1,
                      fillOpacity: 0.8
                    }
      if ( int === 0) {
        if      ( valueSet[int] < 5 )  { options['fillColor'] = "#56C1FF"}
          else if ( valueSet[int] < 10 ) { options['fillColor'] = "#73FDEA"}
          else if ( valueSet[int] < 30 ) { options['fillColor'] = "#FFFC66"}
          else if ( valueSet[int] < 60)  { options['fillColor'] = "#FF9300"}
          else                           { options['fillColor'] = "#FF644E"}
      } else if (int === 1) {
          if      ( valueSet[int] < 8 )  { options['fillColor'] = "#56C1FF"}
          else if ( valueSet[int] < 15 ) { options['fillColor'] = "#73FDEA"}
          else if ( valueSet[int] < 30 ) { options['fillColor'] = "#FFFC66"}
          else if ( valueSet[int] < 50)  { options['fillColor'] = "#FF9300"}
          else                           { options['fillColor'] = "#FF644E"}
      } else {        
        options['fillColor'] = "#fffc66"
      }
      return options
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

      // ポリゴンクリックで遷移
      function moveGeoInfo() {
        window.location.href ="http://127.0.0.1:8000/fieldinfo"
      }
    },
  },
}
</script>

<style scoped>
#mainmap {
  width: 100%;
  height: 100vh;
}

</style>