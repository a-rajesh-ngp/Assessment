<template>

    <v-container class="fill-height" fluid>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
            <v-card elevation="8" >
                <v-card-title class="text-center">
                    Login
                </v-card-title>
                <v-spacer/>
                <v-card-text>
                <v-form
                    @submit.prevent="submitLogin"
                    ref="formRef"
                >
                    <v-text-field
                        v-model="email"
                        label="Email"
                        prepend-inner-icon="mdi-email"
                        type="email"
                        variant="outlined"
                        :rules="emailRules"
                        required
                    />
                    <v-text-field
                        v-model="password"
                        label="Password"
                        prepend-inner-icon="mdi-lock"
                        type="password"
                        variant="outlined"
                        :rules="passwordRules"
                        class="mt-2"
                        required
                    />
                    <v-btn 
                        block 
                        color="primary"
                        class="mt-1"
                        :loading="authStore.loading"
                        type="submit"
                    >
                        Login
                    </v-btn>
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
                        <span class="text-body-2 mr-2 ">
                            Don't have an account?
                        </span>
                        <v-btn variant="text" color="primary" class="text-none pa-0"
                            @click="navigateToSignUpPage"
                        >
                            Signup
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
    import { useRouter, useRoute } from 'vue-router';
    import { ref } from 'vue';
    import { useAuthStore } from '../stores/authStore.js';


    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore()
    const formRef = ref(null)
    const email = ref('')
    const password = ref('')

    

    const emailRules = [
        v => !!v || 'Email is required',
    ]
    const passwordRules = [
        v=> !!v || 'Password is required'
    ]

    const submitLogin = async() => {
        const {valid} = await formRef.value.validate()
        if(!valid) return
        try {
            await authStore.login({
                email: email.value,
                password: password.value
            })
            if(authStore.user.role=='instructor') {
                router.push('/instructor/createCourse')
            } else {
                router.push('/instructor/viewCourses')
            }
        } catch(err) {
            console.log(err)
        }
    }

    const navigateToSignUpPage = () => {
        router.push('/signup')
    }
</script>