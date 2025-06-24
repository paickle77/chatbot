const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');


const app = express();
app.use(bodyParser.json());

require('dotenv').config();
const OPENAI_API_KEY = 'sk-...0zIA';
console.log("API KEY:", OPENAI_API_KEY);


app.get('/', (req, res) => {
  res.json({ message: 'Chatbot server đang chạy!' });
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: 'Vui lòng gửi message.' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Bạn là chatbot hỗ trợ khách hàng của CakeShop. Trả lời thân thiện, ngắn gọn, ưu tiên gợi ý các loại bánh.' },
          { role: 'user', content: userMessage }
        ]
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error('Lỗi OpenAI API:', errText);
      return res.status(500).json({ reply: 'Xin lỗi, hệ thống đang gặp sự cố.' });
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || 'Xin lỗi, tôi chưa hiểu ý bạn.';

    res.json({ reply });
  } catch (err) {
    console.error('Lỗi gọi OpenAI:', err);
    res.status(500).json({ reply: 'Xin lỗi, hệ thống gặp sự cố. Vui lòng thử lại.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server chạy port ${port}`);
});
