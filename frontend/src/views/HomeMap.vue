<template>
  <div :id="mapid"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
delete  L.Icon.Default.prototype._getIconUrl
import MapDrow from '../mixins/MapDrow'

export default {
  mounted() {
    // プロパティ初期値定義
    let centerLatlng = [43.2121696, 143.2725181]
    let zoomLv = 15
    let mapInfo = true

    // MapDrowのbaseMapDrowメソッド
    this.baseMapDrow(centerLatlng,zoomLv,mapInfo)

    // axiosでbackendからポリゴンデータを取得
    // response.dataをMapDrowの各メソッドに渡す
    this.axios
        .get("/api/v1/polygondata/")
        .then(response => (
            this.polygonControl(response.data,this.mymap)
      ))
    this.axios
        .get("/api/v1/soildata/")
        .then(response => (
          this.pointControl(response.data,this.mymap)
      ))
  },
  mixins: [MapDrow]
}
</script>

<style scoped>
#mainmap {
  width: 100%;
  height: 100vh;
}
.info {
  font-size: 16px;
  width: 120px;
  height: 60px;
  background: white;
  border-radius: 5px;
  opacity: 0.9;
}
</style>