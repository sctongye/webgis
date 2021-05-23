<template>
  <div class="soildata">
    <!-- <h1>soildata</h1>
    <table class="table">
      <th>圃場名</th><th>pH</th><th>窒素</th><th>リン酸</th><th>加里</th><th>苦土</th>
      <tr v-for="(data, key) in soildata" :key="key">
        <td>{{ data.name }}</td>
        <td>{{ data.ph}}</td>
        <td>{{ data.nitrogen}}</td>
        <td>{{ data.phosphoric_acid}}</td>
        <td>{{ data.potassium}}</td>
        <td>{{ data.magnesium}}</td>
      </tr>
    </table>
    {{ url }}
    {{ soildata }} -->
  </div>
</template>

<script>
// export default {
//   data() {
//     return {
//       soildata: [],
//       url: "デフォルト",
//     };
//   },
//   mounted() {
//     console.log("土壌分析データを表示")
//     this.axios
//       .get("/api/v1/soildata/")
//       .then(response => (this.soildata = response.data.results));
//       // .then(response => console.log("count_data:",response.data.count))
//     // this.url = process.env.BASE_URL;
//   }
// };
</script>