const axios = require('axios');

async function askGemini(req, res) {
  try {
    let requestBody;
    if (req.body.query) {
      requestBody = {
        contents: [
          {
            parts: [
              {
                text: req.body.query
              }
            ]
          }
        ]
      };
    } else if (req.body.contents) {
      requestBody = {
        contents: req.body.contents
      };
    } else {
      return res.status(400).json({ 
        error: 'Invalid request format. Expected either "query" or "contents" field.' 
      });
    }

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API
        }
      }
    );

    const textResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    
    res.json({
      success: true,
      text: textResponse
    });

  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        success: false,
        error: error.response.data || 'API Error',
        status: error.response.status
      });
    } else if (error.request) {
      res.status(503).json({
        success: false,
        error: 'Service unavailable - no response from Gemini API'
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  }
}

module.exports = { askGemini };