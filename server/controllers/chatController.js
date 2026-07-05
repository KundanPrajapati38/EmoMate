const https = require('https');

const ZHIPUAI_API_KEY = process.env.ZHIPUAI_API_KEY;

// Available GLM models to try in order
const GLM_MODELS = ['glm-4-flash', 'glm-4-flash-250414', 'glm-4-air', 'glm-4'];

const SYSTEM_PROMPT = `You are an empathetic AI companion called EmoMate. Your goal is to help the user with their emotional wellbeing. Detect their primary emotion and provide a short, supportive, conversational response (max 30 words). Your final output must be a JSON object with two keys: "emotion" and "reply".`;

// Generate JWT for ZhipuAI API
function generateZhipuToken(apiKey) {
  const [id, secret] = apiKey.split('.');
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', sign_type: 'SIGN' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    api_key: id,
    exp: Math.floor(Date.now() / 1000) + 3600,
    timestamp: Math.floor(Date.now() / 1000),
  })).toString('base64url');

  const crypto = require('crypto');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

// Call ZhipuAI API directly via HTTPS (no SDK needed)
function callZhipuAPI(model, messages) {
  return new Promise((resolve, reject) => {
    const token = generateZhipuToken(ZHIPUAI_API_KEY);
    const body = JSON.stringify({
      model,
      messages,
      response_format: { type: 'json_object' },
    });

    const options = {
      hostname: 'open.bigmodel.cn',
      path: '/api/paas/v4/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message || 'API error'));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error('Failed to parse API response'));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// @desc  Chat with ZhipuAI GLM
// @route POST /api/chat
const chat = async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: message },
  ];

  // Try each model in order until one works
  for (const model of GLM_MODELS) {
    try {
      const result = await callZhipuAPI(model, messages);
      const content = result.choices[0].message.content;
      const parsed = JSON.parse(content);
      return res.json(parsed);
    } catch (err) {
      console.error(`Model ${model} failed: ${err.message}`);
      // Try next model
    }
  }

  return res.status(500).json({ error: 'All AI models failed. Please try again later.' });
};

module.exports = { chat };
