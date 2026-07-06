const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

exports.smartSearch = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    const systemPrompt = `You are an AI assistant for a luxury real estate platform.
The user will provide a natural language search query.
Extract the following details and return ONLY a valid JSON object matching this schema. Do not return markdown, just raw JSON.
Schema:
{
  "budget": Number or null,
  "location": String or null,
  "propertyType": String or null (e.g. "villa", "apartment"),
  "bedrooms": Number or null,
  "amenities": Array of Strings
}

Example Query: "I need a luxury villa under 3 million in Malibu with a pool"
Example Output:
{
  "budget": 3000000,
  "location": "Malibu",
  "propertyType": "villa",
  "bedrooms": null,
  "amenities": ["pool"]
}

User Query: "${query}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });

    const responseText = response.text;
    
    // Clean up potential markdown formatting
    let cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const parsedFilters = JSON.parse(cleanJson);
      res.json(parsedFilters);
    } catch (parseError) {
      console.error('Failed to parse Gemini output:', cleanJson);
      res.status(500).json({ message: 'Failed to parse AI response', raw: cleanJson });
    }
  } catch (error) {
    console.error('AI Search Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.generateDescription = async (req, res) => {
  try {
    const { title, location, type, price } = req.body;

    const systemPrompt = `You are an elite luxury real estate copywriter.
Write a compelling, premium listing description for the following property.
Do NOT use markdown or quotes. Keep it strictly to 3 or 4 paragraphs. Make it sound extremely high-end and appealing.
Property Details:
Title: ${title}
Location: ${location}
Type: ${type}
Price: $${price}

Write the description now:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });

    res.json({ description: response.text.trim() });
  } catch (error) {
    console.error('AI Description Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.chatAssistant = async (req, res) => {
  try {
    const { message, context } = req.body;

    const systemPrompt = `You are the ultimate omnipotent luxury real estate AI assistant for NestLux.
You handle all of the following domains perfectly:
1. Mortgage Calculator: If asked about loans or EMIs, calculate them logically and explain interest rates and affordability.
2. Investment Analyst: If asked if a property is a good investment, generate an "Investment Score" (1-100), evaluate ROI, rental potential, and risk.
3. Location Expert: Describe neighborhood demographics and why it's good for families or professionals.
4. Interior Designer: If asked about styling, suggest furniture, wall colors, and layouts (Minimal, Luxury, Modern).
5. Buying Assistant: Summarize pros and cons of the property.
6. Website Guide: You have the full power of the website. If a user needs an EMI calculator, tell them to visit the 'Calculators' tab or link them to [Calculators](/calculators). If they want to search, link them to [Properties](/properties).

Current Context (URL or Property Details):
${context}

Client Message: ${message}
Respond professionally, accurately, and beautifully. YOU MUST USE MARKDOWN FORMATTING (bolding, headers, bullet points) to make your response easy to read.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
