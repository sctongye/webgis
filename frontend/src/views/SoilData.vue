<template>
  <div class="container">
      <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th>pH</th>
              <th>窒素</th>
              <th>リン酸</th>
              <th>加里</th>
              <th>苦土</th>
              <th>石灰</th>
            </tr>
          </thead>
          <tbody v-for="b in jsondata['features']" :key='b'>
            <tr>
              <td>{{ b['properties'].ph }}</td>
              <td>{{ b['properties'].nitrogen }}</td>
              <td>{{ b['properties'].phosphoric_acid }}</td>
              <td>{{ b['properties'].potassium }}</td>
              <td>{{ b['properties'].magnesium }}</td>
              <td>{{ b['properties'].calsium }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jsondata: [],
    };
  },
  mounted(){
    this.axios
      .get("/api/v1/soildata/")
      .then(response => (this.jsondata = response.data))
  },
}
</script>

<style scoped>

</style>