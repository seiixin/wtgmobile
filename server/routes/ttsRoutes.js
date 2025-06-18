const express = require('express');
const router = express.Router();
const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient();

router.post('/', async (req, res) => {
  try {
    const { text, language } = req.body;
    let voice;
    if (language === 'tagalog') {
      voice = { languageCode: 'fil-PH', name: 'fil-PH-Wavenet-A' };
    } else {
      voice = { languageCode: 'en-US', name: 'en-US-Wavenet-D' }; // or another English voice
    }
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice,
      audioConfig: { audioEncoding: 'MP3' },
    });
    res.json({ audioContent: response.audioContent });
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'TTS failed' });
  }
});

module.exports = router;