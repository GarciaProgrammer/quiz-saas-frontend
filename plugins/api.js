import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
    const api = {
        getQuizzes: async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/quizzes')
                return response.data
            } catch (error) {
                console.error('Error fetching quizzes:', error)
                return { error: error.message }
            }
        },
    }
    nuxtApp.provide('api', api)
})
