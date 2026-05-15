const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) return res.status(400).json({ error: 'Message required' });

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful educational assistant for Pak eduTool.' },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 500,
            temperature: 0.7
        });
        res.json({ reply: completion.choices[0].message.content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'AI error' });
    }
});

module.exports = router;