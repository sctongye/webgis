<template >
  <div  class="container">
    <FieldInfoComp v-for="data in jsondata['features']" :key="data" :mapid="data.id" :geojson="data" />
  </div>
</template>

<script>
import FieldInfoComp from '../components/FieldInfoComp'

export default {
  data() {
    return {
      jsondata: [],
    };
  },
  created() {

  },
  mounted(){
    this.axios
      .get("/api/v1/polygondata/")
      .then(response => (this.jsondata = response.data))
  },
  methods: {

  },
  components: {
      FieldInfoComp,
  }
}
</script>

<style scoped>
.container {
  margin: 15px;
}
</style>