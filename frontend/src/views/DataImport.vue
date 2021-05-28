<template>
  <div class="container themed-container m-3">
    <div>
      <form>
          <input type="number" id="num" v-model="number" />
          <input type="text" id="txt" v-model="text" />
          <button v-on:click="onclick">送信</button>
          {{ myname }}
      </form>
    </div>
    <div>
      test
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      number: "",
      text: ""
    }
  },
  methods: {
    // onclick: function() {
    //   this.axios
    //     .post("/api/v1/ownerdata/",{ 
    //       "owner_id": this.number,
    //       "owner_name": this.text
    //     })
    //     .then(response => (this.res = response.data))
    //     .catch(error => console.log(error))
    // }
  }
}
</script>

<style scoped>

</style>