const express = require('express');
const textToSpeech = require('@google-cloud/text-to-speech');
const router = express.Router();

// Text-to-Speech client setup
const path = require('path');
// ...existing code...
const client = new textToSpeech.TextToSpeechClient({
    keyFilename: path.join(__dirname, '../inner-bonus-465405-f3-008391c55b91.json'),
    projectId: 'inner-bonus-465405-f3'
});
// ...existing code...

router.post('/', async (req, res) => {
    try {
        const { text, languageCode = 'en-US', voiceName } = req.body;
        
        const request = {
            input: { text },
            voice: {
                languageCode,
                name: voiceName || (languageCode === 'en-US' ? 'en-US-Wavenet-D' : 'fil-PH-Wavenet-A'),
                ssmlGender: 'NEUTRAL',
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 0.8,
                pitch: -2.0,
                volumeGainDb: 2.0,
            },
        };

        const [response] = await client.synthesizeSpeech(request);
        
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': response.audioContent.length,
        });
        
        res.send(response.audioContent);
    } catch (error) {
        console.error('TTS Error:', error);
        res.status(500).json({ error: 'Failed to synthesize speech' });
    }
});

module.exports = router;