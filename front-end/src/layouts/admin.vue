<template>
    <div v-if="!token">
        <Login />
    </div>
    <div v-else>
        <TheHeader />
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-2 d-none d-sm-flex mt-4">
                    <a-list size="small" bordered style="width: 100%;">
                        <TheMenu />
                        <template #header>
                            <div>Bảng Điều Khiển</div>
                        </template>
                    </a-list>
                </div>
                <div class="col-12 col-sm-10">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TheHeader from '../components/admin/TheHeader.vue';
import TheMenu from '../components/admin/TheMenu.vue';
import Login from '../components/admin/Login.vue';
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useStore } from 'vuex';
import Cookies from 'js-cookie';

export default {
    components: {
        TheHeader,
        TheMenu,
        Login,
    },
    setup() {
        // const store = useStore();
        // const isLoggedIn = computed(() => store.getters.isLoggedIn);
        // const userType = sessionStorage.getItem('userType');
        const token = Cookies.get('accessToken');

        // onMounted(() => {
        //     const sessionLoginStatus = sessionStorage.getItem('isLoggedIn');
        //     const sessionuserType = sessionStorage.getItem('userType');

        //     if (sessionLoginStatus !== null && sessionuserType !== null) {
        //         store.commit('setLoggedIn', { isLoggedIn: JSON.parse(sessionLoginStatus), userType: sessionuserType});
        //     }

        //     // Nếu chưa đăng nhập và không phải ở trang đăng nhập, hiển thị login modal
        //     if (!isLoggedIn.value && window.location.pathname !== '/login') {
        //         Swal.fire({
        //             title: 'Thông báo',
        //             text: 'Bạn chưa đăng nhập, vui lòng đăng nhập để tiếp tục.',
        //             icon: 'info',
        //         });
        //     }
        // }); 
        return {
            // isLoggedIn,
            // userType,
            token
        }
    }
}
</script>