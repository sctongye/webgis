<template>
    <div>
      <div id="map"></div>
      
      <div>{{ jsondata}}</div>
    </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  data() {
    return {
      jsondata: null,
    };
  },
  created() {

  },
  mounted(){
    // 地図表示中央
    const latlng = L.latLng( 43.2121696, 143.2725181 )
    // OpenStreetMap
    const o_std = new L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    // 地図表示
    L.map( 'map', { center: latlng, zoom: 15,layers: [o_std] } )

    this.axios
      .get("/api/v1/polygondata/")
      .then(response => (this.jsondata = response.data))
  },
  methods: {

  },
}
</script>

<style scoped>
#map {
  width: 200px;
  height: 200px;
}
</style>