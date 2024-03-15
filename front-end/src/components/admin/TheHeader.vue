<template>
  <div class="container-fluid bg-info">
    <div class="row">
      <div class="col-1 d-flex d-sm-none align-items-center justify-content-center">
        <span @click="showDrawerMenu()">
          <i class="fa-solid fa-bars fa-xl"></i>
        </span>
      </div>
      <div class="col-10 col-sm-9 d-flex align-items-center justify-content-center justify-content-sm-start">
        <img width="120px" height="60px" src="../../assets/logo.jpg" class="mx-3" alt="ảnh admin" />
        <span class="d-none d-sm-flex">Quản Trị</span>
      </div>
      <div class="col-sm-3 d-none d-sm-flex align-items-center justify-content-sm-end">
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Admin
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" @click="logout" href="#">Đăng Xuất</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </div>
      </div>
      <div class="col-1 d-flex d-sm-none align-items-center justify-content-center">
        <span @click="showDrawerAdmin()">
          <i class="fa-solid fa-user fa-xl me-2"></i>
        </span>
      </div>
    </div>
  </div>
  <a-drawer v-model:open="open_menu" title="Danh Mục" placement="left">
    <TheMenu />
  </a-drawer>
  <a-drawer v-model:open="open_admin" title="Admin" placement="right">
    <div>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </div>
  </a-drawer>
</template>
<script>
import { ref } from 'vue';
import TheMenu from './TheMenu.vue';
import { useRouter } from 'vue-router';
export default {
  components: {
    TheMenu,
  },
  setup() {
    const open_menu = ref(false);
    const open_admin = ref(false);
    const router = useRouter();
    const showDrawerMenu = () => {
      open_menu.value = true;
    };

    const showDrawerAdmin = () => {
      open_admin.value = true;
    };

    const logout = () => {
      sessionStorage.clear();
      window.location.href="/admin";
    }
    return {
      open_menu,
      open_admin,
      showDrawerAdmin,
      showDrawerMenu,
      logout
    }
  }
}



</script>
