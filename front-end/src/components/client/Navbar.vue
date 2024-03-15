<template>
    <div class="sticky-top z-1">
        <nav class="navbar navbar-expand-lg bg-dark">
            <div class="container-fluid">
                <button class="navbar-toggler text-white" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon text-white"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav mx-auto ">
                        <li class="nav-item">
                            <router-link class="text-decoration-none" :to="{ name: 'home' }">
                                <a class="nav-link text-white" aria-current="page" href="#">Trang Chủ</a>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="text-decoration-none" :to="{ name: 'booksPage' }">
                                <a class="nav-link text-white" aria-current="page" href="#">Sản Phẩm</a>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" href="#">Etc</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle text-white" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                Nhà Xuất Bản
                            </a>
                            <ul class="dropdown-menu">
                                <li v-for="publisher in publishers" :key="publisher._id">
                                    <router-link class="text-decoration-none" :to="{name: 'books-filter-nxb', params: { publisherId: publisher._id }}">
                                        <a class="dropdown-item" href="">
                                            {{ publisher.publisher_name}}
                                        </a>
                                    </router-link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="d-lg-none d-block">
                    <span class="text-white">Menu</span>
                </div>
            </div>
        </nav>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue';
export default {
    setup() {
        const publishers = ref([]);
        const getPublishers = async () => {
            await axios.get('http://127.0.0.1:3000/api/publishers')
                .then((respones) => {
                    if (respones.status == 200) {
                        publishers.value = respones.data;
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        onMounted(() => {
            getPublishers();
        })

        return {
            publishers,
            getPublishers,
        }
    }
}
</script>