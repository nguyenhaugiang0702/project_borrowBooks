<template>
    <div class="modal fade z-5" id="SignInModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-dark">
                    <h1 class="modal-title fs-5 text-white" id="exampleModalLabel">Đăng Nhập</h1>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <Form :submit="SignInUser" :validation-schema="signInFormSchema">
                        <div class="Form-outline mb-3">
                            <label class="form-label" for="user_nameToSignIn">Tên Người Dùng</label>
                            <Field name="user_nameToSignIn" class="form-control" v-model="getUserToSignIn.user_name"
                                type="text" id="user_nameToSignIn" />
                            <ErrorMessage name="user_nameToSignIn" class="text-danger" />
                        </div>

                        <div class="form-outline mb-3">
                            <label class="form-label" for="user_passwordToSignIn">Mật Khẩu</label>
                            <div class="row">
                                <div class="col-sm-11">
                                    <Field name="user_passwordToSignIn" v-model="getUserToSignIn.user_password"
                                        :type="showPassword ? 'text' : 'password'" id="user_passwordToSignIn"
                                        class="form-control" />
                                </div>
                                <div class="col-sm-1 my-auto">
                                    <span class="toggle-password" @click="togglePasswordVisibility">
                                        <i :class="[showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash']"></i>
                                    </span>
                                </div>
                                <ErrorMessage name="user_passwordToSignIn" class="text-danger col-sm-6" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-center">
                            <button type="submit" class="btn btn-primary btn-block btn-lg gradient-custom-4 text-white">
                                Đăng Nhập
                            </button>
                        </div>
                        <p class="text-center text-muted my-3">Bạn chưa có tài khoản ? <a href="#!"
                                class="fw-bold text-body"><u>Đăng
                                    ký ở đây</u></a></p>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import Swal from 'sweetalert2';
import { useStore } from 'vuex';

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    setup() {
        const getUserToSignIn = ref({
            user_name: '',
            user_password: '',
        });

        const store = useStore();
        const showPassword = ref(false);
        const togglePasswordVisibility = () => {
            showPassword.value = !showPassword.value;
        }

        const SignInUser = async () => {
            await axios.post('http://127.0.0.1:3000/api/users/login', getUserToSignIn.value)
                .then(async (response) => {
                    if (response.status == 200) {
                        getUserToSignIn.value = {
                            user_name: '',
                            user_password: '',
                        }
                        await Swal.fire({
                            title: 'Thành công!',
                            text: 'Bạn đã đăng nhập thành công.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false, 
                        });
                        store.dispatch('login', {
                            userType: 'user',
                            user_name: response.data.user.user_name,
                            user_id: response.data.user._id,
                        }
                        );
                        $('#SignInModal').modal('hide');
                        window.location.reload();
                    }

                })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {
                        console.log('Lỗi đăng nhập: Tên người dùng hoặc mật khẩu không đúng');
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

        const signInFormSchema = yup.object().shape({
            user_nameToSignIn: yup
                .string()
                .required("Vui lòng nhập tên")
                .min(1, "Tên phải ít nhất 1 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
            user_passwordToSignIn: yup
                .string()
                .required("Vui lòng nhập mật khẩu")
                .min(1, "Mật khẩu phải ít nhất 1 ký tự."),
        });

        return {
            getUserToSignIn,
            showPassword,
            signInFormSchema,
            togglePasswordVisibility,
            SignInUser,
        }
    }
}
</script>