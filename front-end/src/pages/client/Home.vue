<template>
    <Carousel />
    <div class="container my-3">
        <div class="row">
            <div class="col-4 text-center">
                <img src="../../assets/images/img1.jpg" class="w-75" alt="">
            </div>
            <div class="col-4 text-center">
                <img src="../../assets/images/img2.jpeg" class="w-75" alt="">
            </div>
            <div class="col-4 text-center">
                <img src="../../assets/images/img3.jpg" class="w-75" alt="">
            </div>
        </div>
    </div>

    <div class="container my-3">
        <div class="row border mx-auto p-2">
            <div class="col-sm-3 col-md-3">
                <div class="row align-items-center my-2 ">
                    <div class="col-3 text-end"><i class="fa-solid fa-truck-moving fs-4 text-dark"></i></div>
                    <div class="col-9">
                        <h4>Free Shipping</h4>
                        <small>Mua với giá chỉ từ 40,000 VNĐ</small>
                    </div>
                </div>
            </div>
            <div class="col-sm-3 col-md-3">
                <div class="row align-items-center my-2">
                    <div class="col-3 text-end"><i class="fa-solid fa-lock fs-4 text-dark"></i></div>
                    <div class="col-9">
                        <h4>Thanh toán an toàn</h4>
                        <small>100% thanh toán an toàn</small>
                    </div>
                </div>
            </div>
            <div class="col-sm-3 col-md-3">
                <div class="row align-items-center my-2">
                    <div class="col-3 text-end"><i class="fa-solid fa-rotate-left fs-4 text-dark"></i></div>
                    <div class="col-9">
                        <h4>Dễ dàng đổi trả</h4>
                        <small>7 ngày trở lại</small>
                    </div>
                </div>
            </div>
            <div class="col-sm-3 col-md-3">
                <div class="row align-items-center my-2">
                    <div class="col-3 text-end"><i class="fa-solid fa-headset fs-4 text-dark"></i></div>
                    <div class="col-9">
                        <h4>Hỗ trợ 24/7</h4>
                        <small>Gọi cho chúng tôi bất cứ lúc nào</small>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container my-5">
        <h3 class="text-center my-5">Các Sách Mới</h3>
        <div class="row row-cols-1 row-cols-md-4 mx-auto">
            <ListBook namePage="homePage"/>
            <router-link :to="{name : 'booksPage'}" class="btn btn-primary mt-4 mx-auto">Xem Thêm</router-link>
        </div>
    </div>
</template>
<script>

import Carousel from '../../components/client/Carousel.vue';
import Footer from '../../components/client/Footer.vue';
import { ref } from 'vue';
import ListBook from '../../components/client/books/ListBook.vue'

export default {
    components: {
        Carousel,
        Footer,
        ListBook
    },
    setup() {
        const books = ref([]);
        const getBooks = async () => {
            await axios
                .get('http://127.0.0.1:3000/api/books/productsHome')
                .then((respones) => {
                    books.value = respones.data;
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        getBooks();
        return {
            getBooks,
            books,
        }
    }
}
</script>