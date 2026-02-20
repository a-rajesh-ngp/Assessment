<template>
    <v-app-bar color="primary">
        <v-app-bar-title 
            class="cursor-pointer"
            >
            Learning Management System
        </v-app-bar-title>
        <v-spacer />

        <v-btn v-if="authStore.isAuthenticated && authStore.user.role==='instructor'" variant="text" to="/instructor/createCourse">
            Create Course
        </v-btn>

        <v-btn v-if="authStore.isAuthenticated" variant="text" to="/instructor/viewCourses">
            View Courses
        </v-btn>
        
       
        <v-btn 
            v-if="authStore.isAuthenticated"
            icon
            color="red"
            class="mr-2"
            @click="logout">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        <slot name="btn"></slot>
    </v-app-bar>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '@/stores/authStore';
    
    const authStore = useAuthStore()
    const router= useRouter()


    const logout = () => {
        authStore.logout()
        router.push('/login')
    }
</script>
