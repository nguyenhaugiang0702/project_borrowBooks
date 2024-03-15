<template>
    <div class="mt-4">
        <div class="row mx-auto">
            <div class="d-flex mx-3 border bg-light">
                <div class="mx-2">
                    <router-link :to="{ name: 'home' }" href="">
                        <i style="color:black" class="fa-solid fa-house fs-4 my-2"></i>
                    </router-link>
                </div>
                <p class="my-2 fs-5 fw-bold">/ <router-link :to="{ name: 'cart' }" class="text-decoration-none text-dark"
                        href="">Giỏ
                        Hàng</router-link> /<router-link :to="{ name: 'checkout' }" class="text-decoration-none text-dark"
                        href=""> Thanh Toán</router-link></p>
            </div>
        </div>
        <div class="row mx-auto my-3">
            <div class="col-8 my-4 ">
                <div class="mx-4 form-group">
                    <label for="name" class="fw-bold form-label">Tên đầy đủ:</label>
                    <input type="text" class="form-control" readonly id="name"
                        :value="userInfo._id ? userInfo.user_name : ''">
                </div>
                <div class="mx-4 form-group">
                    <label for="sdt" class="fw-bold form-label">Số điện thoại:</label>
                    <input type="text" class="form-control" id="sdt" readonly
                        :value="userInfo._id ? userInfo.user_phone : ''">
                </div>

                <div class="row mx-5">
                    <button class=" my-3 btn btn-success col-2" id="btnCheckOut" name="checkout"
                        @click="updateCheckoutInfo">Đặt
                        hàng</button>
                </div>
            </div>

            <div class="col-4 bg-light my-4 pt-4">
                <div class="bg-white py-4 px-4 checkout_shadow">
                    <div class="row mx-auto ">
                        <div class="col-7 fw-bold fs-4">Đơn của bạn</div>
                        <div class="col-5 fs-4 text-end">
                            <router-link :to="{ name: 'cart' }"><i
                                    class="fa-solid text-dark fa-cart-shopping"></i></router-link>
                        </div>
                    </div>
                    <hr>
                    <div class="row mx-auto fw-bold">
                        <div class="col-7">Tổng giá giỏ hàng:</div>
                        <div class="col-5 ">
                            <span class="price text-danger fw-bold">
                                {{ totalPrice }}
                            </span>
                            <span class="text-danger fw-bold"> VNĐ</span>
                        </div>
                    </div>
                    <div class="row mx-auto mt-2">
                        <div class="col-7 fw-bold">Vận chuyển và xử lý:</div>
                        <div class="col-5 fst-italic">Miễn phí</div>
                    </div>
                    <hr>
                    <div class="row mx-auto fw-bold mt-2">
                        <div class="col-7">Tổng cộng:</div>
                        <div class="col-5">
                            <span class="price text-danger fw-bold">
                                {{ totalPrice }}
                            </span>
                            <span class="text-danger fw-bold"> VNĐ</span>
                        </div>
                    </div>
                </div>
                <div class="bg-white my-4 py-4 px-4 checkout_shadow">
                    <div class="row mx-auto">
                        <div class="col-12 text-start fw-bold fs-4 mb-4">Phương thức thanh toán</div>
                        <hr>
                    </div>
                    <div class="row mx-auto my-3 form-group">
                        <input class="form-check-input border border-dark col-1 ms-3" type="radio" checked name="payment"
                            id="payment1" value="Ship COD">
                        <label class="fw-bold col" id="payment1">Thanh toán khi nhận hàng</label>
                    </div>
                    <div class="row mx-auto my-3 form-group">
                        <input class="form-check-input border border-dark col-1 ms-3" type="radio" name="payment"
                            id="payment3" value="Paypal">
                        <label class="fw-bold col" id="payment3">Thanh toán qua Paypal</label>
                    </div>
                    <div class="row mx-auto my-3 form-group">
                        <input class="form-check-input border border-dark col-1 ms-3" type="radio" name="payment"
                            id="payment4" value="VNPay">
                        <label class="fw-bold col" id="payment3">Thanh toán qua VNPay</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted, computed } from 'vue';
import Swal from 'sweetalert2';
export default {
    setup() {
        const checkout = ref([]);
        const user_id = sessionStorage.getItem('user_id');
        const userInfo = ref({})
        const checkoutInfo = ref([]);
        
        const getCheckOut = async () => {
            await axios.get(`http://127.0.0.1:3000/api/checkout/${user_id}`)
                .then((response) => {
                    if (response.status == 200) {
                        checkout.value = response.data;
                        console.log(response.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        const totalPrice = computed(() => {
            let total = 0;
            const booksArray = checkout.value.selectedBooks;
            if (Array.isArray(booksArray)) {
                for (const book of booksArray) {
                    total += book.total_price;
                }
            }
            return total;
        });

        const getUser = async () => {
            if (user_id) {
                await axios.get(`http://127.0.0.1:3000/api/users/${user_id}`)
                    .then((response) => {
                        if (response.status == 200) {
                            userInfo.value = response.data;
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }

        }

        const updateCheckoutInfo = async () => {
            const booksArray = checkout.value.selectedBooks;
            if (user_id && Array.isArray(booksArray)) {
                checkoutInfo.value = booksArray.map(book => ({
                    book_id: book.book_id,
                    quantity: book.quantity,
                    total_price: book.total_price
                }));
                const checkoutInfoOfUser = checkoutInfo.value;
                await axios.post('http://127.0.0.1:3000/api/borrows', { checkoutInfoOfUser, user_id })
                    .then(async (response) => {
                        if (response.status == 200) {
                            await Swal.fire({
                                title: 'Thành Công',
                                text: 'Bạn đã mượn sách thành công',
                                icon: 'success',
                                timer: 1000,
                            });
                            window.location.reload();
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        };

        onMounted(() => {
            getCheckOut();
            getUser();
        })

        return {
            getCheckOut,
            getUser,
            updateCheckoutInfo,
            totalPrice,
            checkout,
            user_id,
            userInfo,
            checkoutInfo,

        }
    }
}
</script>




