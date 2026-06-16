export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages } = req.body

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: 'You are Rizen Coach — a sharp, motivating, and direct AI personal coach. Help users with fitness, nutrition, habits, focus and mindset. Keep responses concise. Be real, warm and energetic. Use occasional emojis.',
      messages
    })
  })

  const data = await response.json()
  res.status(200).json(data)
}
