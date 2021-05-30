<template>
  <div class="container m-3">
    <div class="btn-toolbar mb-2 mb-md-0">
      <div class="btn-group mr-2">
        <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
        <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown button
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-striped">
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
        <tbody>
          <tr  v-for="b in jsondata['features']" :key='b'>
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