<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-3 text-center">
                <img src="../../assets/images/logo1.png" alt="Logo" style="width: 200px; height:100px">
            </div>
            <!-- Tìm Kiếm -->
            <Search />
            <!-- End Tìm Kiếm -->

            <!-- Giỏ Hàng -->
            <div class="col-auto dropdown my-4">
                <button class="btn btn-outline-secondary dropdown-toggle position-relative" type="button"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-cart-shopping"></i> Giỏ Hàng
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {{ totalQuantityInCart }}
                        <span class="visually-hidden">unread messages</span>
                    </span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end" style="width: 500px;">
                    <li v-for="book in booksInCart.books" :key="book.book_id">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <img class="ms-2" style="width: 100px; height: 100px;"
                                    :src="`http://localhost:3000/` + book.book_image" alt="">
                            </div>
                            <div class="col">
                                <div class="col-12 text-break fw-bold">{{ book.book_name }}</div>
                                <div class="col-12 fw-bold">Số Lượng: {{ book.quantity }}</div>
                            </div>
                        </div>
                        <hr>
                    </li>
                    <li class="row" v-if="userInfo.user_name">
                        <router-link :to="{ name: 'cart', params: { cartData: JSON.stringify(booksInCart.value) } }"
                            class="btn btn-warning col-sm-4 mx-auto">Giỏ Hàng</router-link>
                        <router-link :to="{ name: 'checkout' }" class="btn btn-success col-sm-4 mx-auto">Thanh
                            Toán</router-link>
                    </li>
                </ul>
            </div>
            <!-- End Giỏ Hàng -->

            <!-- Tài Khoản -->
            <div class="col-sm-2 dropdown">
                <div v-if="userInfo.user_name" class=" my-4 z-2">
                    <div class="dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="fa-solid fa-user fs-3 mt-1"></i> {{ userInfo.user_name }}
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <router-link class="dropdown-item text-decoration-none" :to="{ name: 'profile' }">Tài
                                    khoản</router-link>
                            </li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" @click="logOut" href="#">Đăng xuất</a></li>
                        </ul>
                    </div>
                </div>

                <div v-else class="dropdown my-4 z-2">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i class="fa-solid fa-user mt-auto"></i> Tài Khoản
                    </button>
                    <ul class="dropdown-menu">
                        <li>
                            <a data-bs-toggle="modal" data-bs-target="#SignInModal" href="#" class="dropdown-item">
                                Đăng Nhập
                            </a>
                        </li>
                        <li>
                            <a data-bs-toggle="modal" data-bs-target="#SignUpModal" href="#" class="dropdown-item">
                                Đăng Ký
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- End Tài Khoản -->
            <SignUpModal />
            <SignInModal />
        </div>
    </div>
</template>
<script>
import SignInModal from './modals/SignInModal.vue';
import SignUpModal from './modals/SignUpModal.vue';
import Search from './Search.vue';
import { useStore } from 'vuex';
import { computed, onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

export default {
    components: {
        SignInModal,
        SignUpModal,
        Search
    },
    setup() {
        const userInfo = ref({});
        const getUser = async () => {
            const token = Cookies.get('accessToken');
            await axios.get('http://localhost:3000/api/users/getOneUser', {
                headers: {
                        'Authorization': 'Bearer ' + token
                    }
            })
                .then((response) => {
                    if (response.status == 200) {
                        userInfo.value = response.data;
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 403) {
                        Swal.fire({
                            title: 'Bạn chưa đăng nhập',
                            text: 'Vui lòng đăng nhập để tiếp tục',
                            icon: 'warning',
                            timer: 1500,
                            showConfirmButton: true,
                        });
                        window.location.reload();
                    } else if (error.response && error.response.status === 401) {
                        Swal.fire({
                            title: 'Phiên xử lý hết hạn',
                            text: 'Vui lòng đăng nhập để tiếp tục',
                            icon: 'warning',
                            timer: 1500,
                            showConfirmButton: true,
                        });
                    } else {
                        console.error('Lỗi khi lấy cart:', error);
                    }
                })
        }

        const logOut = () => {
            Swal.fire({
                title: 'Xác nhận đăng xuất',
                text: 'Bạn có chắc chắn muốn đăng xuất?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Đồng ý',
                cancelButtonText: 'Hủy bỏ',
            }).then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.clear();
                    document.cookie = 'accessToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
                    document.cookie = 'user_name=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
                    delete axios.defaults.headers.common['Authorization'];
                    window.location.reload();
                }
            });
        }

        const booksInCart = ref([]);
        const getCarts = async () => {
            const token = Cookies.get('accessToken');
            if (token) {
                await axios.get('http://127.0.0.1:3000/api/cart', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                    .then((response) => {
                        if (response.status == 200) {
                            booksInCart.value = response.data;
                        }
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 403) {
                            Swal.fire({
                                title: 'Bạn chưa đăng nhập',
                                text: 'Vui lòng đăng nhập để tiếp tục',
                                icon: 'warning',
                                timer: 1500,
                                showConfirmButton: true,
                            });
                            window.location.reload();
                        } else if (error.response && error.response.status === 401) {
                            Swal.fire({
                                title: 'Phiên xử lý hết hạn',
                                text: 'Vui lòng đăng nhập để tiếp tục',
                                icon: 'warning',
                                timer: 1500,
                                showConfirmButton: true,
                            });
                        } else {
                            console.error('Lỗi khi lấy cart:', error);
                        }

                    })
            }
        }

        // function checkCookieExpiration(cookieName) {
        //     const cookieValue = Cookies.get(cookieName, { raw: true });
        //     if (!cookieValue) {
        //         console.log(111);
        //         return false;
        //     }
        //     const cookieParts = cookieValue.split(';');
        //     for (const part of cookieParts) {
        //         const [key, value] = part.trim().split('=');
        //         if (key === 'expires') {
        //             // Lấy thời gian hết hạn của cookie
        //             const expirationTime = new Date(value);
        //             const currentTime = new Date();
        //             // So sánh thời gian hết hạn với thời gian hiện tại
        //             if (expirationTime <= currentTime) {
        //                 // Cookie đã hết hạn
        //                 return false;
        //             } else {
        //                 // Cookie còn hiệu lực
        //                 return true;
        //             }
        //         }
        //     }
        //     // Không tìm thấy thông tin về thời hạn trong cookie
        //     return false;
        // }

        // function startContinuousChecking(cookieName, interval) {
        //     setInterval(() => {
        //         const isUserCookieValid = checkCookieExpiration(cookieName);
        //         console.log('Is user cookie valid?', isUserCookieValid);
        //     }, interval);
        // }

        // // Bắt đầu kiểm tra liên tục với khoảng thời gian là 1 phút (60000 milliseconds)
        // startContinuousChecking('user_name', 60000);

        // const checkTokenExpiration = () => {
        //     const tokenExpiration = Cookies.get('user_name');
        //     if (tokenExpiration) {
        //         const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại tính bằng giây
        //         if (currentTime > parseInt(tokenExpiration)) {
        //             // Token đã hết hạn
        //             // Thực hiện các xử lý khi token hết hạn, ví dụ: hiển thị thông báo yêu cầu người dùng đăng nhập lại
        //             Swal.fire({
        //                 title: 'Phiên xử lý hết hạn',
        //                 text: 'Vui lòng đăng nhập để tiếp tục',
        //                 icon: 'warning',
        //                 timer: 1500,
        //                 showConfirmButton: true,
        //             }).then(() => {
        //                 // Chuyển hướng người dùng đến trang đăng nhập
        //                 // window.location.href = '/login'; // Hoặc sử dụng router.push để chuyển hướng trong Vue Router
        //             });
        //         }
        //     }
        // };

        onMounted(() => {
            getCarts();
            getUser();
        })

        const totalQuantityInCart = computed(() => {
            // Kiểm tra nếu booksInCart.value không tồn tại hoặc không phải là một object
            if (!booksInCart.value || typeof booksInCart.value !== 'object') {
                return 0;
            }
            const booksArray = booksInCart.value.books;
            if (!Array.isArray(booksArray)) {
                return 0;
            }
            return booksArray.reduce((total, book) => total + book.quantity, 0);
        });

        return {
            booksInCart,
            logOut,
            getCarts,
            totalQuantityInCart,
            getUser,
            userInfo
            // checkTokenExpiration,
            // checkCookieExpiration,
            // isUserCookieValid
        };
    }

}
</script>
