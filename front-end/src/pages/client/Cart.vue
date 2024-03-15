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
                    <span class="price text-danger">{{ selectedBooksTotalPrice }}</span>
                    <span class="text-danger">VNĐ</span>
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


export default {
    components: {
        CartTable
    },
    setup() {
        const router = useRouter();
        const user_id = sessionStorage.getItem('user_id');
        const selectedBooksArray = ref([]);

        const handleSelectedBooksUpdated = async (newSelectedBooksArray) => {
            selectedBooksArray.value = newSelectedBooksArray;
        };

        const GotoCheckOut = async () => {
            const isSelected = Object.values(selectedBooksArray.value).some(value => value);
            if (!isSelected) {
                Swal.fire({
                    title: 'Vui lòng chọn sách',
                    text: 'Bạn phải chọn ít nhất một sách để tiếp tục',
                    icon: 'warning',
                    confirmButtonText: 'Đồng ý',
                    timer: 1500,
                });
                return;
            }
            console.log(selectedBooksArray.value);
            const res = await axios.post('http://127.0.0.1:3000/api/books/checkNumber', selectedBooksArray.value)
            if (res.status == 204) {
                await await axios.post('http://127.0.0.1:3000/api/checkout', { selectedBooks: selectedBooksArray.value, user_id })
                    .then((response) => {
                        if (response.status == 200) {
                            router.push({ name: 'checkout' });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            } else if (res.status == 200) {
                await Swal.fire({
                    title: 'Lỗi',
                    text: res.data.message,
                    icon: 'error',
                    timer: 1500,
                    showConfirmButton: false,
                });
                return;
            }
        }

        const selectedBooksTotalPrice = computed(() => {
            const booksArray = selectedBooksArray.value;
            if (Array.isArray(booksArray) && booksArray.length > 0) {
                return booksArray.reduce((totalPrice, book) => totalPrice + book.total_price, 0);
            }
        });

        return {
            handleSelectedBooksUpdated,
            GotoCheckOut,
            selectedBooksTotalPrice
        }

    }
}
</script>