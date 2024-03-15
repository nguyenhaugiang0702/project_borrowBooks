<template>
    <div class="col-sm-5">
        <div class="input-group my-4 w-100 border border-dark rounded-2">
            <input name="search_key" v-model="search_key" type="text" class="form-control border-0"
                placeholder="Nhập để tìm kiếm">
            <button type="button" @click="searchBook" class="rounded-end border px-2">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
export default {
    setup() {
        const search_key = ref('');
        const books = ref([]);
        const router = useRouter();
        const searchBook = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:3000/api/books/search?book_name=${search_key.value}`);
                if (res.status === 200) {
                    books.value = res.data;
                    console.log(res.data);
                    // router.push({name: 'booksPage'});
                }
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
        return {
            search_key,
            books,
            searchBook
        };
    }
};
</script>