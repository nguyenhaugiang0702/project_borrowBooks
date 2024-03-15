<template>
    <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline">
        <a-menu-item key="admin-books">
            <router-link :to="{ name: 'admin-books' }" class="text-decoration-none">
                <i class="fa-solid fa-book fa-xl me-2"></i>
                <span>Sách</span>
            </router-link>
        </a-menu-item>
        <a-menu-item key="admin-users">
            <router-link :to="{ name: 'admin-users' }" class="text-decoration-none">
                <i class="fa-solid fa-user fa-xl me-2"></i>
                <span>Người Dùng</span>
            </router-link>
        </a-menu-item>
        <a-menu-item key="admin-nxbs">
            <router-link :to="{ name: 'admin-nxbs' }" class="text-decoration-none">
                <i class="fa-solid fa-list me-2"></i>
                <span>Nhà Xuất Bản</span>
            </router-link>
        </a-menu-item>
        <a-menu-item key="admin-borrows">
            <router-link :to="{ name: 'admin-borrows' }" class="text-decoration-none">
                <i class="fas fa-hand-holding-usd me-2"></i>
                <span>Mượn Sách</span>
            </router-link>
        </a-menu-item>
    </a-menu>
</template>
<script>
import { defineComponent } from "vue";
import { storeToRefs } from "pinia";
import { useMenu } from "../../store/use-menu.js";
export default defineComponent({
    setup() {
        const store = useMenu();
        const { selectedKeys, openKeys } = store;
        return {
            ...storeToRefs(store)
        }
    },

});
</script>