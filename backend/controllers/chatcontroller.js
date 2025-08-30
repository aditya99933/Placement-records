const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://yoursite.com", // Optional
    "X-Title": "YourAppName"                // Optional
  },
});

const chatHandler = async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage)
      return res.status(400).json({ error: "Message is required" });

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert career guide chatbot specializing in technology fields. When a user asks for a career roadmap or learning path, respond with:   - A clear and stepwise roadmap relevant for the specific tech domain mentioned (e.g., AI, Web Development, Data Science, Cloud Computing, DevOps, Cybersecurity, Machine Learning, Mobile Development, Blockchain, etc.).  - Recommendations of the best YouTube channels and specific videos for beginners to advanced learners. - Useful websites, online courses, and documentation resources.   - Tips for gaining practical experience, such as projects or internships.  - Community groups or forums useful for networking and learning.  Format the response in readable, markdown style with headings, bullet points, and clickable links where possible.  If the user does not specify the domain, provide a general technology career roadmap highlighting popular fields and resources.  If asked outside tech careers, politely inform that you specialize only in tech career guidance."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 600
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("OpenRouter API error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate response via OpenRouter" });
  }
};

module.exports = { chatHandler };


