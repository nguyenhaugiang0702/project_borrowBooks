<template>
    <div class="main-product">
        <div class="container">
            <div class="row mx-auto mt-4">
                <div class="d-flex border border-dark ">
                    <div class="mx-2">
                        <a href="">
                            <i style="color:black" class="fa-solid fa-house fs-4 my-2"></i>
                        </a>
                    </div>
                    <p class="my-2 fs-5 fw-bold">/ Thông tin chi tiết/ {{ book ? book.book_name : 'Loading...' }}</p>
                </div>
            </div>
            <!-- Thông tin chi tiết -->
            <div class="border border-dark px-5 my-4 pt-3" aria-label="breadcrumb" v-if="book">
                <div class="row my-3">
                    <div class="col-md-3 col-12">
                        <img v-if="book.book_image" class="img-fluid border border-dark rounded"
                            :src="`http://localhost:3000/` + book.book_image" alt="">
                    </div>
                    <div class="col-md-7 col-12">
                        <div class="row">
                            <h2>{{ book ? book.book_name : 'Loading...' }}</h2>
                        </div>
                        <div class="row">
                            <div class="text-danger">
                                <span class="card-text price fw-bold fs-3 ">{{ book.book_price }}</span>
                                <span class=" fw-bold fs-3">VNĐ</span>
                            </div>
                        </div>

                        <form action="" method="get">
                            <div class="row mt-3">
                                <label class="text-uppercase col-md-2" for="soluong">Số lượng:</label>
                                <input class="col-md-1 border border-dark border-3 rounded-3" :value="quantity" min="1"
                                    name="slmua" type="number" id="soluong" @input="updateQuantity($event)">
                            </div>

                            <div class="row mt-2">
                                <label class="text-uppercase col-3">Nhà Xuất Bản:</label>
                                <router-link class="text-decoration-none col-1"
                                    :to="{ name: 'books-filter-nxb', params: { publisherId: book.publisherInfo._id } }">
                                    <a class="dropdown-item" href="">
                                        {{ book.publisherInfo.publisher_name }}
                                    </a>
                                </router-link>
                            </div>
                            <div class="row mt-4">
                                <button @click.prevent="addToCart(book._id, user_id, quantity, $event)" type="submit"
                                    name="themvaogio" class="btn btn-lg btn-primary text-white ms-3 col-md-4 ">Thêm vào
                                    giỏ</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <!-- Thông tin chi tiết -->

            <!-- comment -->
            <nav>
                <div class="nav nav-tabs bg-info-subtle" id="nav-tab" role="tablist">
                    <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home"
                        type="button" role="tab" aria-controls="nav-home" aria-selected="true">Mô tả</button>
                    <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile"
                        type="button" role="tab" aria-controls="nav-profile" aria-selected="false">
                        Đánh giá(0)
                    </button>
                    <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact"
                        type="button" role="tab" aria-controls="nav-contact" aria-selected="false">TAGS</button>
                </div>
            </nav>
            <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active border border-light-subtle p-3 mb-4" id="nav-home" role="tabpanel"
                    aria-labelledby="nav-home-tab">
                    {{ book ? book.book_description : null }}
                </div>
                <div class="tab-pane fade border border-light-subtle mb-4" id="nav-profile" role="tabpanel"
                    aria-labelledby="nav-profile-tab">

                    <div class="row my-3 mx-3">
                        <div class="col-1 text-end">
                            <img style="width: 50px;" src="" alt="">
                        </div>
                        <div class="col-11">
                            <div class="fw-bold row ">
                                <div class="col"></div>
                            </div>
                            <div class="row">
                                <div class="col-md-8 text-start text-break">

                                </div>
                                <div class="col-md-4 text-end">

                                </div>
                            </div>

                            <div class="row pe-4">
                                <div class="rateyo z-0" id="rateyo" data-rateyo-read-only="true"
                                    data-rateyo-rating="<?= $row_stars['rate'] ?>">
                                </div>
                            </div>


                        </div>
                        <hr>
                    </div>
                    <form action="" method="post" class="rounded p-3">
                        <h2 class="mt-2 ms-2 row">Đánh Giá</h2>
                        <p class="mt-2 ms-2 row">Hãy đưa ra nhận xét của bạn:</p>
                        <div class="form-group ms-2 mb-2">
                            <label class="fw-bold">Nhận xét của bạn (<strong class="text-danger">*</strong>)</label>
                            <div class="my-2">
                                <textarea class="form-control" name="cmt" id="comment" rows="7"></textarea>
                            </div>
                        </div>

                        <div class="rateyo z-0" id="rating" data-rateyo-rating="5" data-rateyo-num-stars="5"
                            data-rateyo-score="3" data-rateyo-full-star="true">
                        </div>
                        <input type="hidden" name="rating" class="rating">
                        <input type="hidden" name="idsp" value="<?= $id_sanpham ?>">

                        <div class="form-group">
                            <div class="ms-2 mt-2">
                                <button type="button" name="gui_danhgia" class="btn btn-primary">Gửi đi</button>
                            </div>
                        </div>
                    </form>
                </div>
                <!-- comment -->
                <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">...</div>
            </div>

            
        </div>
    </div>

</template>
<script>
import { useRoute } from 'vue-router';
import { onMounted, ref, watchEffect } from 'vue';
import Swal from 'sweetalert2';
export default {
    setup() {
        const route = useRoute();
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const user_id = sessionStorage.getItem('user_id');
        const book = ref();
        const quantity = ref(1);

        const updateQuantity = (event) => {
            quantity.value = parseInt(event.target.value);

        };

        const getBookWithId = async (bookId) => {
            await axios.get(`http://127.0.0.1:3000/api/books/${bookId}`)
                .then((response) => {
                    if (response.status == 200) {
                        book.value = response.data;
                        console.log(response.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        watchEffect(() => {
            const bookId = route.params.id;
            getBookWithId(bookId);
        })

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
            await axios.post('http://127.0.0.1:3000/api/cart', { book_id: bookId, user_id: userId, quantity: quantity })
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



        return {
            getBookWithId,
            book,
            addToCart,
            user_id,
            quantity,
            updateQuantity
        }
    }
}
</script>