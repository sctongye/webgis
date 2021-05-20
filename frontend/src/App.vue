<template>
  <div class="d-flex">
  <!-- Sidebar -->
    <div class="bg-light border-right" id="sidebar-wrapper">
      <div class="sidebar-heading">Web-GIS</div>
        <div class="list-group">
          <router-link to="/" class="list-group-item list-group-item-action bg-light">マップ</router-link>
          <router-link to="/fieldinfo" class="list-group-item list-group-item-action bg-light">圃場情報</router-link>
          <router-link to="/#" class="list-group-item list-group-item-action bg-light">土壌分析結果</router-link>
          <router-link to="/#" class="list-group-item list-group-item-action bg-light">データインポート</router-link>
        </div>
    </div>
  <!-- /#sidebar-wrapper -->

  <!-- Page Content -->
    <div id="page-content-wrapper">
      <div id="app">
        <router-view />
      </div>
    <!-- /#page-content-wrapper -->
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style>
#sidebar-wrapper {
  height: 100vh;
}
.sidebar-heading {
  padding: 0.875rem 1.25rem;
  font-size: 1.2rem;
}
.list-group {
  width: 15rem;
}
#page-content-wrapper {
  width: 100vw;
}
</style>
