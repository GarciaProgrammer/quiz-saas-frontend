<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold text-center mb-6">Join Quiz</h1>
            <!-- Join Form -->
            <div v-if="!joined">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Quiz PIN</label>
                        <input v-model="pinCode" type="text" class="w-full p-2 border rounded-md"
                            placeholder="Enter quiz PIN" maxlength="4" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">Your Name</label>
                        <input v-model="playerName" type="text" class="w-full p-2 border rounded-md"
                            placeholder="Enter your name" />
                    </div>

                    <button @click="joinQuiz" class="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        :disabled="!pinCode || !playerName">
                        Join Quiz
                    </button>
                </div>
            </div>

            <!-- Waiting Room -->
            <div v-else-if="joined && !gameStarted" class="text-center">
                <h2 class="text-xl font-semibold mb-4">Waiting for the quiz to start...</h2>
                <div class="animate-pulse flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="text-blue-500 mb-2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <p class="text-gray-500">The quiz host will start the game soon</p>
                </div>
            </div>

            <!-- Question Display -->
            <div v-else-if="gameStarted && !showResults" class="text-center">
                <div class="mb-4">
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-blue-600 h-2.5 rounded-full"
                            :style="{ width: `${timeRemaining / currentQuestion.timeLimit * 100}%` }"></div>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">Time remaining: {{ timeRemaining }}s</p>
                </div>

                <h2 class="text-xl font-semibold mb-4">{{ currentQuestion.text }}</h2>

                <div class="grid grid-cols-2 gap-3 mb-4">
                    <button v-for="(option, index) in currentQuestion.options" :key="index" @click="submitAnswer(index)"
                        :disabled="answerSubmitted" :class="[
                            'p-4 rounded-lg text-white font-medium',
                            answerSubmitted && index === selectedAnswer ?
                                (index === currentQuestion.correctOption ? 'bg-green-500' : 'bg-red-500') :
                                answerSubmitted ? 'bg-gray-400' :
                                    ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'][index]
                        ]">
                        {{ option }}
                    </button>
                </div>

                <p v-if="answerSubmitted" class="text-lg font-medium">
                    {{ selectedAnswer === currentQuestion.correctOption ?
                        '✅ Correct!' : '❌ Incorrect!' }}
                </p>
            </div>

            <!-- Results Display -->
            <div v-else-if="showResults" class="text-center">
                <h2 class="text-xl font-semibold mb-4">Quiz Results</h2>

                <div class="bg-blue-50 p-4 rounded-lg mb-6">
                    <p class="text-lg">Your Score: <span class="font-bold">{{ playerScore }}</span></p>
                </div>

                <div class="space-y-2">
                    <h3 class="font-medium">Top Players:</h3>
                    <div v-for="(player, index) in topPlayers" :key="player.id"
                        class="flex justify-between items-center p-2 rounded-md"
                        :class="player.id === playerId ? 'bg-blue-100' : 'bg-gray-50'">
                        <div class="flex items-center gap-2">
                            <span class="font-bold">{{ index + 1 }}.</span>
                            <span>{{ player.name }}</span>
                        </div>
                        <span class="font-medium">{{ player.score }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Player state
const pinCode = ref('');
const playerName = ref('');
const joined = ref(false);
const gameStarted = ref(false);
const playerId = ref(null);
const playerScore = ref(0);

// Question state
const currentQuestion = ref({
    text: 'What is the capital of France?',
    options: ['London', 'Paris', 'Berlin', 'Madrid'],
    correctOption: 1,
    timeLimit: 20
});
const timeRemaining = ref(20);
const answerSubmitted = ref(false);
const selectedAnswer = ref(null);
const showResults = ref(false);

// Mock top players
const topPlayers = ref([
    { id: 2, name: 'Player 2', score: 950 },
    { id: 1, name: 'Player 1', score: 800 },
    { id: 3, name: 'Player 3', score: 750 },
]);

// Join the quiz
const joinQuiz = async () => {
    try {
        // In a real app, you would send this data to your backend
        // const response = await fetch('/api/join', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     pinCode: pinCode.value,
        //     playerName: playerName.value
        //   })
        // });
        // const data = await response.json();
        // playerId.value = data.playerId;

        // For demo purposes
        playerId.value = Math.floor(Math.random() * 1000);
        joined.value = true;

        // In a real app, you would set up a WebSocket connection here to listen for game events
        // For demo purposes, we'll simulate the game starting after a delay
        setTimeout(() => {
            gameStarted.value = true;
            startTimer();
        }, 3000);
    } catch (error) {
        console.error('Error joining quiz:', error);
    }
};

// Start the timer for the current question
const startTimer = () => {
    timeRemaining.value = currentQuestion.value.timeLimit;
    const timer = setInterval(() => {
        if (timeRemaining.value > 0 && !answerSubmitted.value) {
            timeRemaining.value--;
        } else {
            clearInterval(timer);
            if (!answerSubmitted.value) {
                // Time's up, auto-submit
                submitAnswer(null);
            }

            // In a real app, you would wait for the host to advance to the next question
            // For demo purposes, we'll show the results after a delay
            setTimeout(() => {
                showResults.value = true;
            }, 3000);
        }
    }, 1000);
};

// Submit an answer
const submitAnswer = (answerIndex) => {
    selectedAnswer.value = answerIndex;
    answerSubmitted.value = true;

    // Calculate score based on correctness and time remaining
    if (answerIndex === currentQuestion.value.correctOption) {
        // More time remaining = more points
        const timeBonus = Math.floor(timeRemaining.value / currentQuestion.value.timeLimit * 100);
        playerScore.value += 100 + timeBonus;
    }

    // In a real app, you would send the answer to your backend
    // await fetch('/api/submit-answer', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     playerId: playerId.value,
    //     questionId: currentQuestion.value.id,
    //     answerIndex,
    //     timeRemaining: timeRemaining.value
    //   })
    // });
};
</script>