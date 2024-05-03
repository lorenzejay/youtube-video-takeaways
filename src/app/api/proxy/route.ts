// pages/api/proxy.js
import axios from 'axios'
import { NextRequest } from 'next/server'
import cheerio from 'cheerio'

// handle transcribing youtube videos
export async function POST(req: NextRequest) {
  const data = await req.json()
  const url = data.url
  if (!url) return
  try {
    // Make an HTTP request to the external URL
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'topbar', // Some sites require a user agent header
      },
    })

    const $ = cheerio.load(response.data)
    const metaTitle =
      $('meta[property="og:title"]').attr('content') || $('title').text()
    const metaDescription =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content')
    const metaImage = $('meta[property="og:image"]').attr('content')

    // Send back the HTML content

    return Response.json({ metaTitle, metaDescription, metaImage, url })
  } catch (error) {
    console.error('Error fetching data:', error)
    return new Response('Failed to fetch data', {
      status: 400,
    })
  }
}
