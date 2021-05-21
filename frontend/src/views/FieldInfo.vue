<template>
    <div>{{jsondata}}</div>
</template>

<script>
export default {
  data() {
    return {
      jsondata: null,
    };
  },
  created() {
    // var test = this.axios
    //   .get("/api/v1/polygondata/")
    //   .then(response => (
    //       this.jsondata = response.data
    // )).then(jsondata => console.log(jsondata))
    // console.log("no1" + test)
    this.axios
      .get("/api/v1/polygondata/")
      .then(response => (
          console.log("created"),
          this.jsondata = response.data
    ))
  },
  mounted(){
    var test = this.jsondata
    console.log("mounted")
    console.log("jsondataの値は" + test)
  },
  methods: {
    colog(text){
      console.log(text)
    }
  },
}
</script>
