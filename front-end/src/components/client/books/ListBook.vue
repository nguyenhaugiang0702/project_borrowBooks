<template>
    <div v-if="namePage == 'homePage' && !publisher_Id" v-for="book in books" :key="book._id" class="col-sm-3 col-md-3">
        <div class="card" style="width: 18rem;">
            <router-link :to="{ name: 'books-detail', params: { id: book._id } }">
                <img :src="`http://localhost:3000/` + book.book_image" class="card-img-top" alt="...">
            </router-link>
            <div class="card-body">
                <h5 class="card-title">{{ book.book_name }}</h5>
                <p class="card-text">{{ book.book_price }}
                <p>Nhà Xuất Bản: {{ book.publisherInfo.publisher_name }}</p>
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
    <div v-else-if="namePage == 'booksPage' || namePage == 'filterBooksPage'" class="row my-3">
        <div class="row">
            <div class="d-flex mx-3 border border-dark ">
                <div class="mx-2">
                    <router-link :to="{ name: 'home' }">
                        <i style="color:black" class="fa-solid fa-house fs-4 my-2"></i>
                    </router-link>
                </div>
                <p class="my-2 fs-5 fw-bold">/ Tất cả các sách</p>
            </div>
        </div>
        <div class="col-sm-3 col-md-3 my-3" v-for="book in books" :key="book._id">
            <div class="card h-100" style="width: 18rem;">
                <router-link :to="{ name: 'books-detail', params: { id: book._id } }">
                    <img :src="`http://localhost:3000/` + book.book_image" class="card-img-top" alt="...">
                </router-link>
                <div class="card-body">
                    <h5 class="card-title">{{ book.book_name }}</h5>
                    <p class="card-text">{{ book.book_price }}
                    <p>Nhà Xuất Bản: {{ book.publisherInfo.publisher_name }}</p>
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
</template>

<script>

import { ref, onMounted, watchEffect } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import { param } from 'jquery';

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
        const store = useStore();
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const user_id = sessionStorage.getItem('user_id');

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

        const addToCart = async (bookId, userId, quantity) => {
            if (!isLoggedIn || !userId) {
                await Swal.fire({
                    title: 'Bạn chưa đăng nhập',
                    text: 'Vui lòng đăng nhập để tiếp tục',
                    icon: 'warning',
                    timer: 1500,
                    showConfirmButton: true,
                });
                return;
            }
            await axios.post('http://127.0.0.1:3000/api/cart', { book_id: bookId, user_id: userId, quantity })
                .then((response) => {
                    if (response.status == 200) {
                        alert('da them vao gio hang');
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        const getBooksFilterNxb = async (publisher_Id) => {
            await axios
                .get(`http://127.0.0.1:3000/api/books/filterPublishers/${publisher_Id}`)
                .then((response) => {
                    if (response.status == 200) {
                        books.value = response.data;
                        console.log(response.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }

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

        return {
            getBooks,
            addToCart,
            books,
            isLoggedIn,
            user_id,
            getBooksFilterNxb,
            publisher_Id,
            getBooksAtHomePage,
        }
    }
}
</script>