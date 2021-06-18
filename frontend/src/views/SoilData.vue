<template>
  <div class="container m-3">
    <div class="btn-toolbar mb-2 mb-md-0">
    </div>
    <div class="table-responsive">
      <h4 class="m-4">土壌分析結果</h4>
      <div class="btn-group mr-2">
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
            作物ソート
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </div>
      </div>
      <table class="table table-striped m-3">
        <thead>
          <tr>
            <th>予定作物</th>
            <th>圃場名</th>
            <th>pH</th>
            <th>窒素</th>
            <th>リン酸</th>
            <th>加里</th>
            <th>苦土</th>
            <th>石灰</th>
            <th>注釈</th>
          </tr>
        </thead>
        <tbody>
          <tr  v-for="b in jsondata['features']" :key='b'>
            <td>{{ b['properties'].crop_name }}</td>
            <td>{{ b['properties'].field_name }}</td>
            <td>{{ b['properties'].ph }}</td>
            <td>{{ b['properties'].nitrogen }}</td>
            <td>{{ b['properties'].phosphoric_acid }}</td>
            <td>{{ b['properties'].potassium }}</td>
            <td>{{ b['properties'].magnesium }}</td>
            <td>{{ b['properties'].calsium }}</td>
            <td>{{ b['properties'].remarks }}</td>
          </tr>
        </tbody>
      </table>
        <table class="table table-bordered m-3" id="fixed">
          <thead>
            <tr>
              <th></th>
              <th>pH</th>
              <th>窒素</th>
              <th>リン酸</th>
              <th>加里</th>
              <th>苦土</th>
              <th>石灰</th>
            </tr>
          </thead>
          <tbody>
            <tr class="col">
              <td>平均値</td>
              <td>{{average['ph']}}</td>
              <td>{{average['nitrogen']}}</td>
              <td>{{average['phosphoric_acid']}}</td>
              <td>{{average['potassium']}}</td>
              <td>{{average['magnesium']}}</td>
              <td>{{average['calsium']}}</td>
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
      average: {}
    };
  },
  mounted(){
    this.viewSoilData()
  },
  methods: {
    getApiData: async function() {
      let soildata = null
      try { 
        [soildata] = await Promise.all([
          this.axios
            .get("/api/v1/soildata/")
            .catch( error => this.apiError = error), 
        ]) 
      } catch(err) {
          console.log(err)
          return
      } 
      return {soildata: soildata.data}
    },
    viewSoilData: async function() {
      let result = await this.getApiData()
      this.jsondata = result.soildata
      this.average = this.calcAvrage(this.jsondata["features"])
    },
    calcAvrage: function(array) {
      var ph = 0
      var nitrogen = 0
      var phosphoric_acid = 0
      var potassium = 0
      var magnesium = 0
      var calsium = 0
      var count = 0
      
      for (var i in array) {
         ph += array[i]["properties"]["ph"]
         nitrogen += array[i]["properties"]["nitrogen"]
         phosphoric_acid += array[i]["properties"]["phosphoric_acid"]
         potassium += array[i]["properties"]["potassium"]
         magnesium += array[i]["properties"]["magnesium"]
         calsium += array[i]["properties"]["calsium"]
         count += 1 
      }
      ph = (ph / count).toFixed(1)
      nitrogen = (nitrogen / count).toFixed(1)
      phosphoric_acid = (phosphoric_acid / count).toFixed(1)
      potassium = (potassium / count).toFixed(1)
      magnesium = (magnesium / count).toFixed(1)
      calsium = (calsium / count).toFixed(1)
      return {
              ph:ph,
              nitrogen:nitrogen,
              phosphoric_acid:phosphoric_acid,
              potassium:potassium,
              magnesium:magnesium,
              calsium:calsium
              }
    }
  }
}
</script>

<style scoped>
#fixed {
  width: 50vw;
  table-layout: fixed;
}
</style>