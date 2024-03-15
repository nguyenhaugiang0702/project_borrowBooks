// Trong file store/index.js
import { createStore } from 'vuex';

export default createStore({
    state() {
        return {
            isLoggedIn: false,
            userType: null, 
            user_name: null,
            user_id: null,
            selectedBooks: [] 
        };
    },
    mutations: {
        setLoggedIn(state, { isLoggedIn, userType, user_name, user_id }) {
            state.isLoggedIn = isLoggedIn;
            state.userType = userType;
            state.user_name = user_name;
            state.user_id = user_id;
        },
        setSelectedBooks(state, selectedBooks) {
            state.selectedBooks = selectedBooks;
        }
    },
    actions: {
        login({ commit }, { userType, user_name, user_id}) {
            // Thực hiện logic xác minh đăng nhập tại đây

            // Ví dụ đơn giản, giả sử xác minh thành công
            commit('setLoggedIn', { isLoggedIn: true, userType, user_name, user_id });
            sessionStorage.setItem('isLoggedIn', true);
            sessionStorage.setItem('userType', userType);
            sessionStorage.setItem('user_name', user_name);
            sessionStorage.setItem('user_id', user_id);
        },
        logout({ commit }) {
            // Logic đăng xuất ở đây
            commit('setLoggedIn', { isLoggedIn: false, userType: null, user_name: null });
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('userType');
            sessionStorage.removeItem('user_name');
            sessionStorage.removeItem('user_id');
        },
        updateSelectedBooks({ commit }, selectedBooks) {
            commit('setSelectedBooks', selectedBooks);
        }
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn,
        userType: state => state.userType,
        user_name: state => state.user_name, 
        user_id: state => state.user_id, 
        selectedBooks: state => state.selectedBooks,
    }
});
