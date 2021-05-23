<template>
  <div>
    <div v-bind:id="mapid" style="width:200px;height:200px"></div>
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
  props: ['mapid'],
  mounted(){
    // 地図表示中央
    const latlng = L.latLng(this.latlng)
    // OpenStreetMap
    const o_std = new L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")

    // 地図表示
    L.map( this.mapid.toString(), { center: latlng, zoom: 15,zoomControl:false,layers: [o_std]} )
  },
  methods: {

  },
}
</script>

<style scoped>
/* #map {
  width: 200px;
  height: 200px;
} */
</style>