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
import GC from '../reference/global-constant'
import 'leaflet/dist/leaflet.css'
import 'leaflet.control.layers.tree'
import 'leaflet.control.layers.tree/L.Control.Layers.Tree.css'
delete L.Icon.Default.prototype._getIconUrl

export default {
  data(){
    return {
      mapid: "mainmap",
      apiError: false,
      centerLatlng: [43.2121696, 143.2725181],
    }
  },
  created() {
    // leafletアイコンの設定
    L.Icon.Default.mergeOptions({
      iconUrl: require( 'leaflet/dist/images/marker-icon.png'),
      iconRetinaUrl: require( 'leaflet/dist/images/marker-icon-2x.png'),
      shadowUrl: require( 'leaflet/dist/images/marker-shadow.png' )
    })
  },
  mounted() {
    this.drowLayers()
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
    drowLayers: async function(){
      // APIを非同期で得てからスクリプト実行
      let result = await this.getApiData()
      let soildata = result.soildata
      let polydata = result.polydata

      // タイルレイヤー定義 OpenStreetMap/地理院タイル/GoogleMapサテライト/土壌インベントリー
      const OSM = new L.tileLayer(GC.OSM_URL, {attribution: GC.OSM_ATTRIBUTION});
      const GIA = new L.tileLayer(GC.GIA_URL, {attribution: GC.GIA_ATTRIBUTION});
      const GMS = new L.tileLayer(GC.GMS_URL);
      const SIV = new L.tileLayer(GC.SIV_URL);

      // マップオブジェクトの生成
      let mymap = L.map( this.mapid , {
              center: L.latLng(this.centerLatlng),
              zoom: 15,
              maxZoom: 18,
              minZoom: 7,
              zoominfoControl: true,
              layers: [OSM]
            } )

      // ベースレイヤー（背景地図）定義（leaflet.control.layers.treeプラグイン）
      let baseTree = {
        label: '背景地図',
        children: [
          {label:'マップ（OSM）', layer: OSM},
          {label:'航空写真（地理院）', layer: GIA},
          {label:'航空写真（GoogleMap）', layer: GMS}
        ]
      }

      // 上乗せレイヤー（圃場情報）定義（leaflet.control.layers.treeプラグイン）
      let overlaysTree = {
        label: '圃場情報',
        children:[
          {
            label: '土壌図',
            layer: SIV.setOpacity(0.7)
          },
          {
            label: '圃場ポリゴン',
            layer: this.polygonControl(polydata,mymap)
          },
          {
            label:'土壌分析地点',
            children:[
              {
                label:'有効態リン酸',
                layer: this.pointControl(soildata,'P'),
                radioGroup: 'rg'
              },
              {
                label:'交換性カリ',
                layer: this.pointControl(soildata,'K'),
                radioGroup: 'rg'
              },
              {
                label:'交換性苦土',
                layer: this.pointControl(soildata,'Mg'),
                radioGroup: 'rg'
              },
          ]}
        ]
      }

      // レイヤーをマップオブジェクトに追加し描画（leaflet.control.layers.treeプラグイン）
      L.control.layers.tree(baseTree,overlaysTree,{collapsed: false}).addTo(mymap)

      // 左下にスケール表示
      L.control.scale({imperial: false,maxWidth: 300}).addTo(mymap);
    },
    // pointControlメソッド
    pointControl:function(geoJsonPoint,soilElement) {

      function customCircleMarker(geoJsonPoint,latlng){

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

        if (soilElement === 'P') {
          
          let rate = geoJsonPoint['properties']["phosphoric_acid_rate"]
                
          if      ( rate === 1 ) { geojsonMarkerOptions['fillColor'] = pointColor[1]}
          else if ( rate === 2 ) { geojsonMarkerOptions['fillColor'] = pointColor[2]}
          else if ( rate === 3 ) { geojsonMarkerOptions['fillColor'] = pointColor[3]}
          else if ( rate === 4 ) { geojsonMarkerOptions['fillColor'] = pointColor[4]}
          else                   { geojsonMarkerOptions['fillColor'] = pointColor[5]}

        } else if (soilElement === 'K') {

          let rate = geoJsonPoint['properties']["potassium_rate"]
              
          if      ( rate === 1 ) { geojsonMarkerOptions['fillColor'] = pointColor[1]}
          else if ( rate === 2 ) { geojsonMarkerOptions['fillColor'] = pointColor[2]}
          else if ( rate === 3 ) { geojsonMarkerOptions['fillColor'] = pointColor[3]}
          else if ( rate === 4 ) { geojsonMarkerOptions['fillColor'] = pointColor[4]}
          else if ( rate === 5 ) { geojsonMarkerOptions['fillColor'] = pointColor[5]}
          else                   { geojsonMarkerOptions['fillColor'] = pointColor[6]}

        } else if (soilElement === 'Mg') {

          let rate = geoJsonPoint['properties']["magnesium_rate"]
              
          if      ( rate === 1 ) { geojsonMarkerOptions['fillColor'] = pointColor[1]}
          else if ( rate === 2 ) { geojsonMarkerOptions['fillColor'] = pointColor[2]}
          else if ( rate === 3 ) { geojsonMarkerOptions['fillColor'] = pointColor[3]}
          else                   { geojsonMarkerOptions['fillColor'] = pointColor[5]}

        }
        return L.circleMarker(latlng, geojsonMarkerOptions)
      }

      return L.geoJSON(geoJsonPoint,{
                        onEachFeature: this.pointOnEachFeatrue,
                        pointToLayer: customCircleMarker
                      })
    },
    pointOnEachFeatrue: function(feature, layer) {

      layer.on("mouseover",function(e){
        let targetlayer = e.target
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
        let targetlayer = e.target
        targetlayer.setStyle({
          color: "#000",
          weight: 1,
          fillOpacity: 0.7
        });
        layer.closePopup()
      });

    },
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
  },
}
</script>

<style scoped>
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
  width: 230px;
  padding: 8px;
  opacity: 0.9;
  font-size: 14px;
  font-weight: bold;
  background-color:#f8f9fa;
}

label {
  padding: 4px;
}
/*  */
</style>