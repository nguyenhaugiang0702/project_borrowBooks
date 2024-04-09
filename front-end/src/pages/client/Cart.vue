<template>
    <div class="mt-4">
        <div class="row">
            <div class="d-flex mx-auto border bg-light ">
                <div class="mx-2">
                    <a href="#">
                        <i style="color:black" class="fa-solid fa-house fs-4 my-2"></i>
                    </a>
                </div>
                <p class="my-2 fw-bold col-12"> / GIỎ HÀNG </p>
            </div>
        </div>
        <CartTable @update:selected-books-updated="handleSelectedBooksUpdated" />
        <div class="row">
            <div class="card">
                <div class="card-header row">Tổng Tiền Phải Thanh Toán:</div>
                <div class="card-body fw-bold">
                    <span>Tổng tiền : </span>
                    <span class="price text-danger">{{ selectedBooksTotalPrice ? formatPrice(selectedBooksTotalPrice) :
                        '0 đ' }}</span>
                </div>
            </div>
            <div class="d-flex justify-content-end">
                <button class="btn btn-success col-sm-2 my-3" @click="GotoCheckOut">Tiếp Tục</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import CartTable from '../../components/client/carts/CartTable.vue';
import Cookies from 'js-cookie';
import { error } from 'jquery';

export default {
    components: {
        CartTable
    },
    setup() {
        const router = useRouter();
        const selectedBooksArray = ref([]);

        const handleSelectedBooksUpdated = async (newSelectedBooksArray) => {
            selectedBooksArray.value = newSelectedBooksArray;
        };

        const GotoCheckOut = async () => {
            const isSelected = Object.values(selectedBooksArray.value).some(value => value);
            if (!isSelected) {
                Swal.fire({
                    title: 'Vui lòng chọn sách hoặc kiểm tra lại số lượng',
                    text: 'Bạn phải chọn ít nhất một sách để tiếp tục',
                    icon: 'warning',
                    confirmButtonText: 'Đồng ý',
                    timer: 1500,
                });
                return;
            }
            try {
                const res = await axios.post('http://127.0.0.1:3000/api/books/checkNumber', selectedBooksArray.value);
                if (res.status == 200) {
                    try {
                        const token = Cookies.get('accessToken');
                        await axios.post('http://127.0.0.1:3000/api/checkout', { selectedBooks: selectedBooksArray.value }, {
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        });
                        router.push({ name: 'checkout' });
                    } catch (error) {
                        if (error.response && error.response.status === 401) {
                            Swal.fire({
                                title: 'Phiên xử lý hết hạn',
                                text: 'Vui lòng đăng nhập để tiếp tục',
                                icon: 'warning',
                                timer: 1500,
                                showConfirmButton: true,
                            });
                        } else if (error.response && error.response.status === 403) {
                            Swal.fire({
                                title: 'Bạn chưa đăng nhập',
                                text: 'Vui lòng đăng nhập để tiếp tục',
                                icon: 'warning',
                                timer: 1500,
                                showConfirmButton: true,
                            });
                        }
                    }

                }
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    await Swal.fire({
                        title: 'Lỗi',
                        text: error.response.data.message,
                        icon: 'error',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } else {
                    console.log(error);
                }
            }
        }

        const selectedBooksTotalPrice = computed(() => {
            const booksArray = selectedBooksArray.value;
            if (Array.isArray(booksArray) && booksArray.length > 0) {
                return booksArray.reduce((totalPrice, book) => totalPrice + book.total_price, 0);
            }
        });

        const formatPrice = (price) => {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        }

        return {
            handleSelectedBooksUpdated,
            GotoCheckOut,
            selectedBooksTotalPrice,
            formatPrice
        }

    }
}
</script>