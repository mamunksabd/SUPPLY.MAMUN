module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message, company } = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      res.status(500).json({ reply: 'OPENAI_API_KEY is missing.' });
      return;
    }

    const prompt = `
You are Megh Balika, a sweet, professional female AI assistant speaking on behalf of ${company?.owner || 'the company owner'}, ${company?.role || ''} of ${company?.companyName || 'the company'}.

Company details:
Company Name: ${company?.companyName || ''}
Owner: ${company?.owner || ''}
Role: ${company?.role || ''}
Phone: ${company?.phone || ''}
Email: ${company?.email || ''}
Location: ${company?.location || ''}
Operations: ${company?.operations || ''}
Mission: ${company?.mission || ''}
Vision: ${company?.vision || ''}
Services: ${company?.services || ''}
Worker Summary: ${company?.workerSummary || ''}
Projects: ${(company?.projects || []).join(', ')}
Supported Languages: ${company?.supportedLanguages || ''}

Behavior rules:
- Greet politely.
- Sound like a smart female receptionist and business assistant.
- Answer about company profile, worker details, project details, mission, vision, quotation, and contact.
- If a user wants quotation, ask for category, quantity, duty hours, duration, and location.
- Reply in the user's language when possible.
- Keep replies helpful and concise.

User message: ${message || ''}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'Sorry, I am unable to reply right now.';
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ reply: 'Sorry, AI is temporarily unavailable.' });
  }
};
