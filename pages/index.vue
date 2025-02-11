<template>
    <div v-if="quizzes.length">
        <ul>
            <li v-for="quiz in quizzes" :key="quiz.id">{{ quiz.title }}</li>
        </ul>
    </div>
    <div v-else>
        <p>Carregando quizzes...</p>
    </div>
</template>

<script setup>
const { $api } = useNuxtApp()
const quizzes = ref([])

onMounted(async () => {
    quizzes.value = await $api.getQuizzes()
})
</script>
