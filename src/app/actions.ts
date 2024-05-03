'use server'

import { YoutubeTranscript } from 'youtube-transcript'
import OpenAI from 'openai'
import { revalidatePath } from 'next/cache'
const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
})

async function transcribeYoutubeVideo(_: any, formData: FormData) {
  const url = formData.get('youtube-url')

  try {
    let stringTranscript = ''
    const transcript = await YoutubeTranscript.fetchTranscript(url as string)

    for (const item of transcript) {
      stringTranscript += item.text
    }
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You provide the best summarizer and key takeaways from the provided text. Use bullet points for key takeaways.',
        },
        {
          role: 'user',
          content: `Summarize and then provide key takeaway for this text: ${stringTranscript} `,
        },
      ],
      model: 'gpt-3.5-turbo',
    })

    const takeaway = chatCompletion.choices[0].message?.content as string
    revalidatePath('/')
    // open ai
    return {
      transcript,
      takeaway,
      error: '',
    }
  } catch (error) {
    return {
      transcript: '',
      error: error,
      takeaway: '',
    }
  }
}

export { transcribeYoutubeVideo }
