import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
delete  L.Icon.Default.prototype._getIconUrl

export default {
  data() {
    return {
      mapid: "mainmap"
    }
  },
  mounted(){
  // プロパティ初期値定義
    let centerLatlng = [43.2121696, 143.2725181]
    let zoomLv = 15
    let viewLayers = [o_std]
    let mapInfo = true

    baseMapDrow(centerLatlng,zoomLv,viewLayers,mapInfo)
  },
  methods: {
    baseMapDrow:function(centerLatlng,zoomLv,viewLayers,mapInfo){

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
      var mymap = L.map( this.mapid , { center: L.latLng(centerLatlng), zoom: zoomLv,layers: viewLayers } )

        // 地図補足表示
      if (mapinfo === true) {
        const baseMaps = {'OSM': o_std,'地理院': t_ort};
        L.control.layers(baseMaps, null,{collapsed: false}).addTo(mymap);
        L.control.scale({imperial: false,maxWidth: 300}).addTo(mymap);
      }
    }
  },
}
