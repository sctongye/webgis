<template>
  <div class="col-sm-8">
    <div class="card mt-4">
      <div class="row g-0">
        <div v-bind:id="mapid" class="mapstyle col-md-4"></div>
        <div class="card-body col-md-4">
          <table class="table table-striped">
            <tbody>
              <tr>
                <td>氏名</td>
                <td>{{ geojson['properties']['owner_id'] }}</td>
              </tr>
              <tr>
                <td>年次</td>
                <td>{{ geojson['properties']['year'] }}</td>
              </tr>
              <tr>
                <td>作物名</td>
                <td>{{ geojson['properties']['crop_id'] }}</td>
              </tr>
              <tr>
                <td>メモ</td>
                <td>{{ geojson['properties']['remarks'] }}</td>
              </tr>
            </tbody>
          </table>
          <div class="float-end">
            <button type="button" class="btn btn-outline-danger btn-sm">修正</button>
          </div>
        </div>
      </div>
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

    // leafletで扱えるmapidは文字列
    const map = this.mapid.toString()

    // 地図表示中央
    const latlng = L.latLng(this.latlng)
    // OpenStreetMap
    const o_std = new L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")

    // 地図表示
    const mymap = L.map( map, { center: latlng, zoom: 15,zoomControl:false,layers: [o_std]} )
    const geometry = L.geoJSON(this.geojson).addTo(mymap)

    // 重心に移動
    mymap.fitBounds(geometry.getBounds())

  },
  methods: {

  },
}
</script>

<style scoped>
.mapstyle {
  height: 250px;
  width: 250px;
}
</style>