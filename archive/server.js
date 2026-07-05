// server.js (Updated with a stable, working model)

const express = require('express');
const Groq = require('groq-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        const completion = await groq.chat.completions.create({
            // THIS IS A STABLE AND WIDELY AVAILABLE MODEL
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: `You are an empathetic AI companion named Sophia/Ethan. Your goal is to help the user with their emotional wellbeing. 
                    1.  Listen carefully to the user's message.
                    2.  Detect their primary emotion (Happy, Sad, Angry, Neutral, Surprise, Fear, Disgust, calm, energetic, focused, relaxed).
                    3.  Provide a short, supportive, and conversational response (max 30 words).
                    4.  Your final output must be a JSON object with two keys: "emotion" and "reply". For example: {"emotion": "Sad", "reply": "I'm here for you. It's okay to feel this way."}`
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            response_format: { type: "json_object" },
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content);
        res.json(aiResponse);

    } catch (error) {
        console.error("Error communicating with Groq:", error);
        res.status(500).json({ error: "Sorry, I'm having trouble connecting right now." });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});