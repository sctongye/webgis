<template>
  <div class="row p-2">
    <div v-bind:id="mapid" class="col-md-4"></div>
      <div class="lead col-md-8">
        <ul class="mb-0">
          <li>{{ geojson['properties']['year'] }}</li>
          <li>{{ geojson['properties']['remarks'] }}</li>
          <li>{{ geojson['properties']['owner_id'] }}</li>
          <li>{{ geojson['properties']['crop_id'] }}</li>
        </ul>
      </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  data() {
    return {
      latlng: [43.2121696, 143.2725181],
    }
  },
  props: ['mapid','geojson'],
  mounted(){

    const map = this.mapid.toString()
    const geometry = this.geojson

    // 地図表示中央
    const latlng = L.latLng(this.latlng)
    // OpenStreetMap
    const o_std = new L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")

    // 地図表示
    const mymap = L.map( map, { center: latlng, zoom: 15,zoomControl:false,layers: [o_std]} )
    const geojson = L.geoJSON(geometry).addTo(mymap)

    mymap.fitBounds(geojson.getBounds())

  },
  methods: {

  },
}
</script>

<style scoped>
.submap {
  width: 200px;
  height: 200px;
}
</style>