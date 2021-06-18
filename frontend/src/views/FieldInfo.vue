<template>
  <div  class="container m-3">
    <PolygonInfoComp v-for="jd in polygonjson['features']" :key="jd" :mapid="'polygon' + jd.id" :geojson="jd" />
    <!-- <PointInfoComp v-for="pd in pointjson['features']" :key="pd" :mapid="'point' + pd.id" :pointjson="pd" /> -->
  </div>
</template>

<script>
import PolygonInfoComp from '../components/PolygonInfoComp'
// import PointInfoComp from '../components/PointInfoComp'

export default {
  data() {
    return {
      polygonjson: [],
      // pointjson:[],
    };
  },
  mounted(){
    this.axios
      .get("/api/v1/polygondata/")
      .then(response => (this.polygonjson = response.data))
    // this.axios
    //   .get("/api/v1/soildata/")
    //   .then(response => (this.pointjson = response.data))
  },
  methods: {

  },
  components: {
      PolygonInfoComp,
      // PointInfoComp,
  }
}
</script>

<style scoped>

</style>