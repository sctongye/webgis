<template>
  <div class="row p-2">
    <div v-bind:id="mapid" class="col-md-4 mapstyle"></div>
      <div class="lead col-md-8">
        <ul class="mb-0">
          <li>pH:{{ pointjson['properties']['ph'] }}</li>
          <li>熱水窒素：{{ pointjson['properties']['nitrogen'] }}</li>
          <li>有効態リン酸：{{ pointjson['properties']['phosphoric_acid'] }}</li>
          <li>交換性カリ：{{ pointjson['properties']['potassium'] }}</li>
          <li>交換性苦土：{{ pointjson['properties']['magnesium'] }}</li>
          <li>交換性石灰：{{ pointjson['properties']['calsium'] }}</li>
        </ul>
      </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
delete  L.Icon.Default.prototype._getIconUrl

export default {
  data() {
    return {
      latlng: [43.2121696, 143.2725181],
    }
  },
  props: ['mapid','pointjson'],
  mounted(){

    L.Icon.Default.mergeOptions(
        {   iconUrl         : require( 'leaflet/dist/images/marker-icon.png' )
        ,   iconRetinaUrl   : require( 'leaflet/dist/images/marker-icon-2x.png' )
        ,   shadowUrl       : require( 'leaflet/dist/images/marker-shadow.png' )
        }
    )

    // leafletで扱えるmapidは文字列
    const map = this.mapid.toString()

    // 地図表示中央
    const center_latlng = L.latLng(this.pointjson['geometry']['coordinate'])

    // OpenStreetMap
    const o_std = new L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")

    // 地図表示
    const mymap = L.map( map, { center: center_latlng, zoom: 15,zoomControl:false,layers: [o_std]} )
    
    const geometry = L.geoJSON(this.pointjson).addTo(mymap)

    // 重心に移動
    mymap.fitBounds(geometry.getBounds())
  },
  methods: {

  },
}
</script>

<style scoped>
.mapstyle {
  height: 200px;
  width: 200px;
}
</style>