<template>
    <div class="container-fluid text-center py-4 bg-primary text-white fs-3">Welcome to admin control panel</div>
    <div class="center">
        <h1>Login by Teacher</h1>
        <form action="/teacher_login" method="POST">
            <div class="txt_field">
                <input type="text" name="id_number" required />
                <span></span>
                <label>ID Number</label>
            </div>
            <div class="txt_field">
                <input type="email" name="email" required />
                <span></span>
                <label>Email</label>
            </div>
            <div class="txt_field">
                <input type="password" name="password" required />
                <span></span>
                <label>Password</label>
            </div>
            <button type="submit" class="btn_login">Login</button>
            <div class="text_bottom">
                Forgot Password. Please contact your teacher or IT Team.
                <br />
            </div>
            <div class="text_bottom">
                
                <br />
            </div>
        </form>
        <button class="back_home" onclick="window.location.href='/'">Home</button>
    </div>
</template>
<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

export default {
    setup() {
        const admin = ref({
            admin_name: '',
            admin_pass: '',
        })
        const router = useRouter();

        const loginAdmin = async () => {
            await axios.post('http://127.0.0.1:3000/api/admins', admin.value)
                .then((res) => {
                    if (res.status == 200) {
                        admin.value = {
                            admin_name: '',
                            admin_pass: ''
                        }
                        const token = res.data.accessToken;
                        Cookies.set('accessToken', token, { expires: 24 });
                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Đăng nhập thành công.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false,
                        });
                        window.location.reload();
                        router.push({ name: 'admin-books' });
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {
                        Swal.fire({
                            title: 'Thất bại',
                            text: 'Tên người dùng hoặc mật khẩu không đúng.',
                            icon: 'error',
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    } else {
                        console.error('Lỗi khi login:', error);
                    }
                })
        }
        return {
            loginAdmin,
            admin,
        }
    }
}
</script>