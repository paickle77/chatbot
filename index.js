const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Route mặc định cho GET /
app.get('/', (req, res) => {
  res.json({ message: 'Chatbot server đang chạy!' });
});

// Route xử lý chat
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Bạn là chatbot hỗ trợ app di động, trả lời chính xác, ngắn gọn, thân thiện.' },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Xin lỗi, tôi chưa hiểu ý bạn.';

    res.json({ reply });
  } catch (err) {
    console.error('Lỗi gọi OpenAI API:', err);
    res.status(500).json({ reply: 'Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server chạy port ${port}`));
