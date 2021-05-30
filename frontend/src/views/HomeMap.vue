<template>
<div>
  <div class="alert alert-danger m-0" v-show="apiError">
    {{ apiError.message }}
  </div>
  <div :id="mapid"></div>
</div>
</template>

<script>
import MapDrow from '../mixins/MapDrow'

export default {
  data(){
    return {
      apiError: false
    }
  },
  mounted() {
  // プロパティ初期値定義
    var centerLatlng = [43.2121696, 143.2725181]
    var zoomLv = 15
    var mapInfo = true

  // MapDrowのbaseMapDrowメソッド
    this.baseMapDrow(centerLatlng,zoomLv,mapInfo)

  // axiosでbackendからポリゴンデータを取得
  // response.dataをMapDrowの各メソッドに渡す
    // this.mymap -> MapDrowのmymap
    // this.axios
    //     .get("/api/v1/polygondata/")
    //     .then( response => ( this.polygonControl(response.data,this.mymap)) )
    //     .catch( error => this.apiError = error)
    this.axios
        .get("/api/v1/soildata/")
        .then( response => ( this.pointControl(response.data,this.mymap)) )
        .catch( error => this.apiError = error)
  },
  mixins: [MapDrow]
}
</script>

<style scoped>
#mainmap {
  width: 100%;
  height: 100vh;
}

</style>