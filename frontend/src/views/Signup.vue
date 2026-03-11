<template>

    <v-container class="fill-height" fluid>
        <v-row  justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card elevation="8" class="mt-10">
                    <v-card-title class="text-center">
                        Create Account
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form" @submit.prevent="submitSignup">
                    
                            <v-text-field
                                v-model="formData.username"
                                label="User Name"
                                variant="outlined"
                                prepend-inner-icon="mdi-account"
                                :rules="usernameRules"
                                required
                            />
                            
                            <v-text-field
                                v-model="formData.email"
                                label="Email"
                                variant="outlined"
                                prepend-inner-icon="mdi-email"
                                type="email"
                                :rules="emailRules"
                                required
                            />
                            <v-select
                                v-model="formData.role"
                                :items = "roles"
                                label="Role"
                                variant="outlined"
                                :rules="[required]"
                                prepend-inner-icon="mdi-account-badge"
                                required
                            />
                            <v-text-field 
                                v-model="formData.password"
                                label="Password"
                                variant="outlined"
                                prepend-inner-icon="mdi-lock"
                                type="password"
                                :rules="passwordRules"
                                required
                            />
                            <v-text-field
                                v-model="confirmPassword"
                                label="Confirm Password"
                                variant="outlined"
                                prepend-inner-icon="mdi-lock-check"
                                type="password"
                                :rules="[required]"
                                required
                            />
                            <v-btn
                                block
                                color="primary"
                                :loading="authStore.loading"
                                type="submit"
                                >
                                Sign up
                            </v-btn>
                            <v-snackbar
                                v-model="showSnackBar"
                                :color="snackBarColor"
                                timeout="3000"
                                location="top"
                            >
                                {{ snackBarText }}
                            </v-snackbar>
                            
                            <v-alert
                                v-if="authStore.error"
                                type="error"
                                variant="tonal"
                                class="mt-2"
                                density="compact"
                            >
                                {{ authStore.error }}
                            </v-alert>

                            <div class="d-flex justify-center align-center mt-4">
                                <span class="text-body-2 " >
                                    Already have an account?
                                </span>
                                <v-btn
                                    variant="text"
                                    color="primary"
                                    class="text-none pa-0"
                                    @click="navigateToLoginPage"
                                >
                                    Login
                                </v-btn>
                            </div>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import Navbar from '../components/Navbar.vue';
    import { reactive, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '@/stores/authStore';
    const router = useRouter();
    const authStore = useAuthStore()

    const showSnackBar = ref(false)
    const snackBarText = ref('')
    const snackBarColor = ref('success')

    const required = v => !!v || 'This field is required'
    const usernameRules= [
        required,
        v=> /^[a-z0-9_]+$/.test(v) || 'Username should have characters, underscore and numbers only'
    ]
    const emailRules = [
        required,
        v => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || 'Email is not valid',
    ]
    const passwordRules = [
        required,
        v => v.length >= 6 || 'Password must be at least 6 characters',
    ]

    const form = ref()
    const formData = reactive({
        username: '',
        email: '',
        password:'',
        role: null,
    })

    const confirmPassword = ref('')

    const roles = ref([
        {title: 'Student', value: 'student'},
        {title: 'Instructor', value: 'instructor'}
    ])

    const submitSignup = async() => {
        const {valid} = await form.value.validate()
        if(!valid) return

        if(formData.password!==confirmPassword.value) {
            snackBarColor.value = 'error'
            snackBarText.value = 'Passwords do not match'
            showSnackBar.value = true
            return
        }

        const payload = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role
        }
        try {
            const res = await authStore.signup(payload)
            snackBarColor.value = 'success'
            snackBarText.value = 'Signed up successfully'
            showSnackBar.value = true

            setTimeout(() => {
                router.push({
                    path: '/login'
                })
            }, 1000)
            
        } catch(err) {
            console.error(err.errors)
        }
    }

    const navigateToLoginPage = () => {
        router.push('/login')
    }

</script>