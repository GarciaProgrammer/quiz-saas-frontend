<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold mb-6">Quiz Admin Dashboard</h1>

            <!-- Quiz Creation Form -->
            <div v-if="!quizActive" class="mb-8">
                <h2 class="text-xl font-semibold mb-4">Create New Quiz</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Quiz Title</label>
                        <input v-model="quizTitle" type="text" class="w-full p-2 border rounded-md"
                            placeholder="Enter quiz title" />
                    </div>

                    <!-- Questions Section -->
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="text-lg font-medium">Questions</h3>
                            <button @click="addQuestion"
                                class="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                                Add Question
                            </button>
                        </div>

                        <div v-for="(question, qIndex) in questions" :key="qIndex" class="border p-4 rounded-md mb-4">
                            <div class="flex justify-between mb-2">
                                <h4 class="font-medium">Question {{ qIndex + 1 }}</h4>
                                <button @click="removeQuestion(qIndex)" class="text-red-500 hover:text-red-700">
                                    <span class="sr-only">Remove</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>

                            <input v-model="question.text" type="text" class="w-full p-2 border rounded-md mb-2"
                                placeholder="Enter question text" />

                            <div class="space-y-2">
                                <div v-for="(option, oIndex) in question.options" :key="oIndex"
                                    class="flex items-center gap-2">
                                    <input type="radio" :id="`q${qIndex}o${oIndex}`" :name="`question${qIndex}`"
                                        :checked="question.correctOption === oIndex"
                                        @change="question.correctOption = oIndex" />
                                    <input v-model="question.options[oIndex]" type="text"
                                        class="flex-1 p-2 border rounded-md" placeholder="Enter option text" />
                                </div>
                            </div>

                            <div class="mt-2">
                                <label class="block text-sm font-medium mb-1">Time Limit (seconds)</label>
                                <input v-model.number="question.timeLimit" type="number" min="5" max="60"
                                    class="w-full p-2 border rounded-md" />
                            </div>
                        </div>
                    </div>

                    <button @click="createQuiz" class="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        :disabled="!isFormValid">
                        Create Quiz
                    </button>
                </div>
            </div>

            <!-- Active Quiz Section -->
            <div v-if="quizActive" class="text-center">
                <h2 class="text-xl font-semibold mb-4">Quiz Active!</h2>
                <div class="bg-gray-100 p-8 rounded-lg mb-6">
                    <p class="text-lg mb-2">Share this PIN with your players:</p>
                    <p class="text-4xl font-bold text-blue-600">{{ pinCode }}</p>
                </div>

                <div class="mb-6">
                    <h3 class="text-lg font-medium mb-2">Connected Players ({{ players.length }})</h3>
                    <div class="flex flex-wrap gap-2">
                        <div v-for="player in players" :key="player.id"
                            class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {{ player.name }}
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <button v-if="!gameStarted" @click="startGame"
                        class="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        :disabled="players.length === 0">
                        Start Quiz
                    </button>

                    <button v-if="gameStarted" @click="nextQuestion"
                        class="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        {{ currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Show Final Results' }}
                            </button>

                            <button @click="endQuiz"
                                class="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                                End Quiz
                            </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Quiz creation state
const quizTitle = ref('');
const questions = ref([]);
const quizActive = ref(false);
const pinCode = ref('');
const players = ref([]);
const gameStarted = ref(false);
const currentQuestionIndex = ref(0);

// Add a new question
const addQuestion = () => {
    questions.value.push({
        text: '',
        options: ['', '', '', ''],
        correctOption: 0,
        timeLimit: 20
    });
};

// Remove a question
const removeQuestion = (index) => {
    questions.value.splice(index, 1);
};

// Check if form is valid
const isFormValid = computed(() => {
    if (!quizTitle.value) return false;
    if (questions.value.length === 0) return false;

    for (const question of questions.value) {
        if (!question.text) return false;
        for (const option of question.options) {
            if (!option) return false;
        }
    }

    return true;
});

// Create quiz and generate PIN
const createQuiz = async () => {
    try {
        // In a real app, you would send this data to your backend
        // const response = await fetch('/api/quizzes', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     title: quizTitle.value,
        //     questions: questions.value
        //   })
        // });
        // const data = await response.json();
        // pinCode.value = data.pinCode;

        // For demo purposes, generate a random PIN
        pinCode.value = Math.floor(1000 + Math.random() * 9000).toString();
        quizActive.value = true;

        // In a real app, you would set up a WebSocket connection here to listen for players joining
        // For demo purposes, we'll simulate players joining
        setTimeout(() => {
            players.value.push({ id: 1, name: 'Player 1' });
        }, 2000);
        setTimeout(() => {
            players.value.push({ id: 2, name: 'Player 2' });
        }, 3500);
    } catch (error) {
        console.error('Error creating quiz:', error);
    }
};

// Start the game
const startGame = () => {
    gameStarted.value = true;
    currentQuestionIndex.value = 0;

    // In a real app, you would notify all connected players that the game has started
    // and send the first question
};

// Move to the next question
const nextQuestion = () => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
        currentQuestionIndex.value++;
        // In a real app, you would send the new question to all players
    } else {
        // Show final results
        // In a real app, you would calculate and display final scores
    }
};

// End the quiz
const endQuiz = () => {
    quizActive.value = false;
    gameStarted.value = false;
    players.value = [];
    // In a real app, you would notify all players that the quiz has ended
};
</script>