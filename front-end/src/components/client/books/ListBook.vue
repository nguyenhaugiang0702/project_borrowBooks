<template>
    <div v-if="namePage == 'homePage' && !publisher_Id" v-for="book in books" :key="book._id" class="col-sm-3 col-md-3">
        <div class="card" style="width: 18rem;">
            <router-link :to="{ name: 'books-detail', params: { id: book._id } }">
                <img :src="`http://localhost:3000/` + book.book_image" class="card-img-top" alt="...">
            </router-link>
            <div class="card-body">
                <h5 class="card-title text-center">{{ book.book_name }}</h5>
                <p class="card-text text-center">
                    <span class="text-danger">{{ formatPrice(book.book_price) }}</span>
                <p class="text-center">Nhà Xuất Bản: {{ book.publisherInfo.publisher_name }}</p>
                </p>
            </div>
            <div class="card-footer mx-auto bg-white">
                <a href="" @click.prevent="addToCart(book._id, user_id, 1)" class="btn btn-primary">
                    <i class="fas fa-solid fa-cart-plus"></i>
                    Thêm vào giỏ
                </a>
            </div>
        </div>
    </div>
    <div v-else-if="namePage == 'booksPage'" class="row my-3">
        <div class="row my-3 mx-auto">
            <div class="d-flex mx-3 border">
                <div class="mx-2">
                    <router-link :to="{ name: 'home' }">
                        <i style="color:black" class="fa-solid fa-house fs-4 my-2"></i>
                    </router-link>
                </div>
                <p class="my-2 fs-5 fw-bold">/ Tất cả các sách</p>
            </div>
        </div>
        <div class="row mx-3">
            <div class="col-sm-3 col-md-3 my-3" v-for="book in books" :key="book._id">
                <div class="card h-100" style="width: 18rem;">
                    <router-link :to="{ name: 'books-detail', params: { id: book._id } }">
                        <img :src="`http://localhost:3000/` + book.book_image" class="card-img-top" alt="...">
                    </router-link>
                    <div class="card-body">
                        <h5 class="card-title text-center">{{ book.book_name }}</h5>
                        <p class="card-text text-center">
                            <span class="text-danger">{{ formatPrice(book.book_price) }}</span>
                        <p class="text-center">Nhà Xuất Bản: {{ book.publisherInfo.publisher_name }}</p>
                        </p>
                    </div>
                    <div class="card-footer mx-auto bg-white">
                        <a href="" @click.prevent="addToCart(book._id, user_id, 1)" class="btn btn-primary">
                            <i class="fas fa-solid fa-cart-plus"></i>
                            Thêm vào giỏ
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="namePage == 'filterBooksPage'" class="row my-3">
        <div class="row my-3 mx-auto">
            <div class="d-flex mx-3 border">
                <div class="mx-2">
                    <router-link :to="{ name: 'home' }">
                        <i style="color:black" class="fa-solid fa-house fs-4 my-2"></i>
                    </router-link>
                </div>
                <p class="my-2 fs-5 fw-bold">/ Tất cả các sách/ {{ publisherName }}</p>
            </div>
        </div>
        <div class="row mx-3">
            <div class="col-sm-3 col-md-3 my-3" v-for="book in books" :key="book._id">
                <div class="card h-100" style="width: 18rem;">
                    <router-link :to="{ name: 'books-detail', params: { id: book._id } }">
                        <img :src="`http://localhost:3000/` + book.book_image" class="card-img-top" alt="...">
                    </router-link>
                    <div class="card-body">
                        <h5 class="card-title text-center">{{ book.book_name }}</h5>
                        <p class="card-text text-center">
                            <span class="text-danger">{{ formatPrice(book.book_price) }}</span>
                        <p class="text-center">Nhà Xuất Bản: {{ book.publisherInfo.publisher_name }}</p>
                        </p>
                    </div>
                    <div class="card-footer mx-auto bg-white">
                        <a href="" @click.prevent="addToCart(book._id)" class="btn btn-primary">
                            <i class="fas fa-solid fa-cart-plus"></i>
                            Thêm vào giỏ
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { ref, onMounted, watchEffect } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

export default {
    props: {
        publisherId: {
            type: String,
            required: false
        },
        namePage: {
            type: String,
            required: true
        }
    },
    setup(props) {

        const publisher_Id = props.publisherId;
        const namePage = props.namePage;

        const books = ref([]);
        const publisherName = ref('');
        const store = useStore();
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');

        // Get books
        const getBooks = async () => {
            await axios
                .get('http://127.0.0.1:3000/api/books/')
                .then((response) => {
                    books.value = response.data;
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        // Add to cart
        const addToCart = async (bookId) => {
            const token = Cookies.get('accessToken');
            if (!token) {
                await Swal.fire({
                    title: 'Bạn chưa đăng nhập',
                    text: 'Vui lòng đăng nhập để tiếp tục',
                    icon: 'warning',
                    timer: 1500,
                    showConfirmButton: true,
                });
                return;
            }
            await axios.post('http://127.0.0.1:3000/api/cart', { book_id: bookId, quantity: 1 }, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then((response) => {
                    if (response.status == 200) {
                        alert('da them vao gio hang');
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        title: 'Lỗi khi thêm vào giỏ hàng',
                        text: error.message || 'Đã có lỗi xảy ra khi thêm vào giỏ hàng',
                        icon: 'error',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                })
        }

        // Get books with publisher
        const getBooksFilterNxb = async (publisher_Id) => {
            await axios
                .get(`http://127.0.0.1:3000/api/books/publisher/${publisher_Id}`)
                .then((response) => {
                    if (response.status == 200) {
                        books.value = response.data;
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        // Proudct At Home
        const getBooksAtHomePage = async () => {
            await axios
                .get('http://127.0.0.1:3000/api/books/productsHome')
                .then((respones) => {
                    books.value = respones.data;
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        if (publisher_Id && namePage == 'filterBooksPage') {
            watchEffect(() => {
                let publisher_Id = props.publisherId;
                getBooksFilterNxb(publisher_Id);
                publisherName.value = books.value.length > 0 ? books.value[0].publisherInfo.publisher_name : '';
            });
        } else if (!publisher_Id && namePage == 'booksPage') {
            onMounted(() => {
                getBooks();
            });
        } else if (!publisher_Id && namePage == 'homePage') {
            onMounted(() => {
                getBooksAtHomePage();
            });

        }

        //Format Money
        const formatPrice = (price) => {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        }

        return {
            getBooks,
            addToCart,
            books,
            isLoggedIn,
            publisherName,
            getBooksFilterNxb,
            publisher_Id,
            getBooksAtHomePage,
            formatPrice
        }
    }
}
</script>