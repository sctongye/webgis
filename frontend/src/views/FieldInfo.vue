<template>
  <div>
    <FieldInfoComp v-for="data in jsondata['features']" :key="data" v-bind:mapid="data.id" />
    <div>
      <table>
        <th>id</th><th>geometry</th>
        <tr v-for="data in jsondata['features']" :key="data">
          <td>{{ data.id }}</td>
        </tr>
      </table>
    </div>
    <div>{{ jsondata }}</div>
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
</style>