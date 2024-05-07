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
            'You are given an array of items with text, duration, offset, and language. You will provide key points from the entire',
        },
        {
          role: 'user',
          content: `from this array, give me key points and return the timestamp in which they exist, the timestamp is in seconds, so do offset - duration in seconds: ${JSON.stringify(
            transcript
          )}`,
        },
        {
          role: 'system',
          content: `The answer must be an array with items like this, only return an array and nothing else return a string with the array only:
            {
              keypoint: 'this is the key point',
              duration: 'duration from the array item',
              offset: 'offset from the array item'
            }
          `,
        },
      ],
      model: 'gpt-4-turbo',
    })

    const takeaway = chatCompletion.choices[0].message?.content

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
