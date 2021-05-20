<template>
  <div id="map"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  mounted() {
    // 地図表示中央
    const latlng = L.latLng( 43.2121696, 143.2725181 )

    // OpenStreetMap
    const o_std = new L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        });

    // 地図表示
    var mymap = L.map( 'map', { center: latlng, zoom: 15,layers: [o_std] } )
    
    // backendからポリゴンデータを取得し表示
    this.axios
    .get("/api/v1/polygondata/")
    .then(response => (
        L.geoJSON(response.data).addTo(mymap)
      ));
  },
}

</script>

<style scoped>
#map {
  width: 100%;
  height: 100vh;
}
</style>