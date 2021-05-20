<template>
    <div>{{jsondata}}
    </div>

</template>

<script>
export default {
  data() {
    return {
      jsondata: [],
      testdata: null
    };
  },
  mounted() {
    this.axios
    .get("/api/v1/polygondata/")
    .then(response => (
      console.log("1"),
      this.testdata = response.data ,
      // console.log(response.data),
      this.jsondata = response.data
      ));
    console.log("2")

  },
}
</script>
