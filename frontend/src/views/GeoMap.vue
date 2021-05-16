<template>
  <div id="map"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  mounted() {
      L.map( 'map', { center: L.latLng( 35.6825, 139.752778 ), zoom: 15 } ).addLayer(
          L.tileLayer( 'http://{s}.tile.osm.org/{z}/{x}/{y}.png' )
      )
  },
}

</script>

<style scoped>
#map {
  width: 500px;
  height: 500px;
}
</style>