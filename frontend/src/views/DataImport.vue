<template>
  <div class="container themed-container m-3">
    <!-- <div>
      <form>
          <input type="number" id="num" v-model="number" />
          <input type="text" id="txt" v-model="text" />
          <button v-on:click="onclick">送信</button>
          {{ myname }}
      </form>
    </div> -->
    <div>
      <h2>soildataアップロード</h2>
      <form>
        <input ref="upfile" type="file" @change="upfile" />
      </form>
      <div>{{ error['message'] }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      error: ""

    }
  },
  methods: {

    upfile: function(e) {
      const vm = this
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = function() {
        let lines = reader.result.split("\n")
        lines.shift()
        let linesArr = []
        console.log(lines.length)
        for (let i = 0; i < lines.length -1 ; i++) {
          linesArr = lines[i].split(",")
          vm.axios
            .post("/api/v1/soildata/",{
              point: "Point(" + linesArr[0]+" "+linesArr[1] +")",
              date: linesArr[2],
              ph: linesArr[3],
              nitrogen: linesArr[4],
              phosphoric_acid: linesArr[5],
              potassium: linesArr[6],
              magnesium:linesArr[7],
              calsium: linesArr[8],
              remarks: linesArr[9],
            }).catch(error => vm.error = error)
        }
        // vm.data = linesArr
      }
      reader.readAsText( file )
    }
  }
}
</script>

<style scoped>

</style>