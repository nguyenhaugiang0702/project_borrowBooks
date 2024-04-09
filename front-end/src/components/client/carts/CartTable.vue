<template>
    <div class="my-3 row">
        <h3 class="mx-auto my-4">Giỏ hàng của tôi</h3>
        <table class="table">
            <thead class="table-light">
                <tr>
                    <th><input type="checkbox" class="w-100" v-model="selectAll" @change="toggleSelectAll"></th>
                    <th>Hình</th>
                    <th>Tên Sách</th>
                    <th>Số Lượng</th>
                    <th>Giá</th>
                    <th>Tổng Giá</th>
                    <th>Thao Tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="book in booksInCart.books" :key="book.book_id">
                    <td>
                        <input type="checkbox" class="w-100" v-model="selectedBooks[book.book_id]"
                            @change="handleCheckboxChange">
                    </td>
                    <td style="width:180px">
                        <img class="img-fluid" :src="`http://localhost:3000/` + book.book_image" alt="">
                    </td>
                    <td>
                        <a class="text-decoration-none text-break text-dark">
                            {{ book.book_name }}
                            <div>
                                <small>Còn lại ({{ book.book_number - book.book_borrowedNumber }})</small>
                            </div>
                        </a>
                    </td>
                    <td>
                        <div class="input-group">
                            <button class="border p-2" type="button" @click="decreaseQuantity(book, $event)">-</button>
                            <input :id="'inputQuantity_' + book.book_id"
                                class="col-sm-3 col-md-3 border border-3 text-center"
                                @change="updateQuantity(book, $event)" :value="book.quantity" min="1">
                            <button class="border p-2" type="button" @click="increaseQuantity(book)">+</button>
                        </div>
                    </td>
                    <td>
                        <span class="price text-danger fw-bold">
                            {{ formatPrice(book.book_price) }}
                        </span>
                    </td>
                    <td>
                        <span class="price text-danger fw-bold">
                            {{ formatPrice(book.total_price) }}
                        </span>
                    </td>
                    <td><a href=""> <button @click="deleteBook(book.book_id, $event)" class="btn btn-danger"
                                type="button">Xóa</button> </a></td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="d-flex justify-content-end">
        <div class="mb-3">
            <a href="">
                <button class="btn btn-danger" @click="deleteAllBook($event)">Xóa tất cả</button>
            </a>
        </div>
    </div>
</template>

<script>
import { computed, onMounted, ref, } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

export default {
    setup(props, { emit }) {

        const user_id = sessionStorage.getItem('user_id');
        const booksInCart = ref([]);
        const selectedBooks = ref({});
        const selectAll = ref(false);
        const bookNumber = ref({})
        const store = useStore();
        const router = useRouter();

        const getCarts = async () => {
            const token = Cookies.get('accessToken');
            if (token) {
                await axios.get('http://127.0.0.1:3000/api/cart/', {
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
                        console.log(error);
                    })
            }
        }

        onMounted(() => {
            getCarts();
        })

        const increaseQuantity = (book) => {
            document.getElementById(`inputQuantity_${book.book_id}`).value++;
            updateTotalPrice(book);
            propsBooksGotoCart();
        }

        const decreaseQuantity = (book, event) => {
            if (document.getElementById(`inputQuantity_${book.book_id}`).value > 1) {
                document.getElementById(`inputQuantity_${book.book_id}`).value--;
                updateTotalPrice(book);
                propsBooksGotoCart();
            } else {
                if (user_id) {
                    deleteBook(book.book_id, event);
                }
            }
        }

        const updateTotalPrice = (book) => {
            book.total_price = book.quantity * book.book_price;
        };

        const updateQuantity = (book, event) => {
            const newQuantity = event.target.value;
            book.quantity = newQuantity;
            updateTotalPrice(book);
            propsBooksGotoCart();
        };

        const deleteBook = async (book_id, event) => {
            event.preventDefault();
            const token = Cookies.get('accessToken');
            if (token) {
                const isConfirmed = await Swal.fire({
                    title: 'Xác nhận xóa',
                    text: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Đồng ý',
                    cancelButtonText: 'Hủy bỏ',
                })
                if (isConfirmed.isConfirmed) {
                    await axios.delete(`http://127.0.0.1:3000/api/cart/${book_id}`, {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    })
                        .then((response) => {
                            if (response.status == 200) {
                                getCarts();
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    window.location.reload();
                }
            }
            return;
        };

        const toggleSelectAll = () => {
            for (const book of booksInCart.value.books) {
                selectedBooks.value[book.book_id] = selectAll.value;
            }
            propsBooksGotoCart();
        };

        const propsBooksGotoCart = () => {
            const selectedBooksArray = [];
            const booksArray = booksInCart.value.books;
            if (Array.isArray(booksArray) && booksArray.length > 0) {
                for (const bookId in selectedBooks.value) {
                    const isSelected = selectedBooks.value[bookId];
                    if (isSelected) {
                        const book = booksArray.find(book => book.book_id === bookId);
                        if (book) {
                            const inputQuantityElement = document.getElementById(`inputQuantity_${book.book_id}`).value;
                            const inputQuantityValue = inputQuantityElement.trim();
                            if (inputQuantityValue !== "") {
                                const inputQuantity = parseInt(inputQuantityValue);
                                if (!isNaN(inputQuantity) && inputQuantity >= 1) {
                                    book.quantity = inputQuantity;
                                    updateTotalPrice(book);

                                    selectedBooksArray.push({
                                        book_id: book.book_id,
                                        quantity: book.quantity,
                                        total_price: book.total_price
                                    });
                                } else {
                                    return;
                                }
                            } else {
                                return;
                            }
                        }
                    }
                }
            }
            emit('update:selected-books-updated', selectedBooksArray);
        }

        const deleteAllBook = async (event) => {
            event.preventDefault();
            const token = Cookies.get('accessToken');
            if (token) {
                const isConfirmed = await Swal.fire({
                    title: 'Xác nhận xóa',
                    text: 'Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Đồng ý',
                    cancelButtonText: 'Hủy bỏ',
                });

                if (isConfirmed.isConfirmed) {
                    await axios.delete('http://127.0.0.1:3000/api/cart/deleteAll', {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    })
                        .then(async (response) => {
                            if (response.status == 200) {
                                await Swal.fire({
                                    title: 'Xóa thành công',
                                    text: 'Xóa thành công tất cả sách khỏi giỏ hàng',
                                    icon: 'success',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                window.location.reload();
                            }
                        })
                        .catch((error) => {
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
                        })
                }

            }
        }

        const handleCheckboxChange = () => {
            propsBooksGotoCart();
        }

        const formatPrice = (price) => {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        }

        return {
            booksInCart,
            user_id,
            selectedBooks,
            selectAll,
            updateQuantity,
            toggleSelectAll,
            getCarts,
            increaseQuantity,
            decreaseQuantity,
            deleteBook,
            propsBooksGotoCart,
            deleteAllBook,
            handleCheckboxChange,
            formatPrice
        }
    }
}
</script>