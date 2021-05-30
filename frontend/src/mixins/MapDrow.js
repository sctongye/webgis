import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
delete  L.Icon.Default.prototype._getIconUrl

export default {
  data() {
    return {
      mapid: "mainmap",
      mymap: null
    }
  },
  methods: {
    baseMapDrow: function(centerLatlng,zoomLv,mapInfo) {
    // 定数定義
      // OpenStreetMap
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
      this.mymap = L.map( this.mapid , { center: L.latLng(centerLatlng), zoom: zoomLv,layers: [o_std] } )

        // 地図補足表示
      if (mapInfo === true) {
        const baseMaps = {'OSM': o_std,'地理院': t_ort};
        L.control.layers(baseMaps, null,{collapsed: false}).addTo(this.mymap);
        L.control.scale({imperial: false,maxWidth: 300}).addTo(this.mymap);
      }
    },
    // polygonControl: function(geojson,mymap) {

    //   // マウスオーバー関数
    //   function onEachFeature(feature, layer) {
    //     layer.on({
    //         mouseover: highlightFeature,
    //         mouseout: resetHighlight,
    //         click: moveGeoInfo
    //     });
    //   }

    //   // マウスオーバー:ポリゴン情報の表示
    //   function highlightFeature(e) {
    //       var layer = e.target;
    //       layer.setStyle({
    //           weight: 5,
    //           color: '#ff0000',
    //           dashArray: '',
    //           fillOpacity: 0.7
    //       });
    //       if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    //           layer.bringToFront();
    //       }
    //       info.update(layer.feature.properties);
    //   }

    //   // マウスアウト:ポリゴン情報の非表示
    //   function resetHighlight(e) {
    //       geoJSON.resetStyle(e.target);
    //       info.update();
    //   }

    //   // 凡例の表示
    //   var info = L.control();
    //   info.onAdd = function () {
    //       this._div = L.DomUtil.create('div', 'info');
    //       this.update();
    //       return this._div;
    //   };
    //   info.update = function (props) {
    //       this._div.innerHTML = (props ? '<b>' + props.year + '</b><br />' + props.remarks : 'Field Info');
    //   };
    //   info.addTo(mymap);

    //   // geoJSONをマップに表示
    //   var geoJSON = L.geoJSON(geojson,{ onEachFeature: onEachFeature}).addTo(mymap)

    //   // ポリゴンクリックで遷移
    //   function moveGeoInfo() {
    //     window.location.href ="http://127.0.0.1:8000/fieldinfo"
    //   }
    // },
    pointControl: function(pointjson,mymap) {

      // マウスオーバー関数
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
            radius: 40,
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

      // マウスアウト
      function resetHighlight(e) {
          geoJSON.resetStyle(e.target);
      }

      // サークルアイコンの作成
      function customCircleMarker (feature, latlng) {

        let potassiumValue = feature['properties']["potassium"]

        var geojsonMarkerOptions = {
              radius: 40,
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            }
            
        if        ( potassiumValue < 8 )  { geojsonMarkerOptions['fillColor'] = "#56C1FF"
        } else if ( potassiumValue < 15 ) { geojsonMarkerOptions['fillColor'] = "#73FDEA"
        } else if ( potassiumValue < 30 ) { geojsonMarkerOptions['fillColor'] = "#FFFC66"
        } else if ( potassiumValue < 50)  { geojsonMarkerOptions['fillColor'] = "#FF9300"
        } else                            { geojsonMarkerOptions['fillColor'] = "#FF644E"
        }

        return L.circleMarker(latlng, geojsonMarkerOptions)
      }

      let geoJSON = L.geoJSON(pointjson,{ onEachFeature: onEachFeature, pointToLayer: customCircleMarker }).addTo(mymap)

      // for (var i = 0; i <pointjson["features"].length; i++) {
        
      //   let lng = pointjson["features"][i]['geometry']['coordinates'][1]
      //   let lat = pointjson["features"][i]['geometry']['coordinates'][0]

      //   // L.circle([lng,lat], circleMarkerOptions()).addTo(mymap)
      //   L.circle([lng,lat], {radius: 50}).addTo(mymap)
      // }

      // function circleMarkerOptions() {
      //   let options = {
      //                   radius: 50,
      //                   fillColor: "#fffc66",
      //                   color: "#000",
      //                   weight: 1,
      //                   opacity: 1,
      //                   fillOpacity: 0.8
      //                 }
      //   return options
      // }

      // function getRadius(zoomLevel){

      //   if (zoomLevel < 15) {
      //     return 80
      //   } else {
      //     return 40
      //   }
      // }

      // let zoomlevel = mymap.on('zoom',function(e){
      //                 })
      // console.log(zoomlevel)

    }

  },
}
