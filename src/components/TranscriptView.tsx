'use client'
import { transcribeYoutubeVideo } from '@/app/actions'
import React, { useRef, useState } from 'react'
import { useFormState } from 'react-dom'
import FormButton from './FormButton'
import { Input } from './ui/input'
import { Label } from './ui/label'
import Link from 'next/link'
import Image from 'next/image'

const TranscriptView = () => {
  const ref = useRef<HTMLFormElement>(null)

  const [state, formAction] = useFormState(transcribeYoutubeVideo, {
    transcript: '',
    error: '',
    takeaway: '',
    // youtubeThumbnail: '',
  })
  const [thumbnail, setThumbnail] = useState<{
    metaTitle: string
    metaDescription: string
    metaImage: string
    url: string
  }>()

  return (
    <div className="w-full h-full pt-32 px-12">
      <form
        ref={ref}
        action={async (formData) => {
          const url = formData.get('youtube-url')
          await formAction(formData)
          const source = await fetch(`/api/proxy`, {
            method: 'POST',
            body: JSON.stringify({
              url,
            }),
          })
          const youtubeThumbnail = await source.json()
          setThumbnail(youtubeThumbnail)
          ref.current?.reset()
        }}
        // action={formAction}
      >
        <Label htmlFor="youtube-url">Enter a Youtube Url</Label>
        <Input
          type="url"
          name="youtube-url"
          id="youtube-url"
          placeholder="https://www.youtube.com/watch?v=xxx"
        />

        <FormButton>AI Summarize</FormButton>
      </form>
      <div className="">
        {state.takeaway && state.takeaway?.length > 0 && (
          <ul className="space-y-2">
            {JSON.parse(state.takeaway)?.map(
              (
                val: { keypoint: string; duration: number; offset: number },
                i: number
              ) => (
                <li key={i}>
                  {val.keypoint} |{' '}
                  <Link
                    className="text-blue-400"
                    target="_blank"
                    href={`${thumbnail?.url}&t=${val.offset - val.duration}s`}
                  >
                    View Video at timestamp
                  </Link>
                </li>
              )
            )}
          </ul>
        )}
      </div>
      {state.takeaway && thumbnail && (
        <Link href={thumbnail.url}>
          <Image
            className="mt-12 w-full max-w-xl mx-auto"
            width={1920}
            height={1080}
            src={thumbnail.metaImage}
            alt={thumbnail.metaTitle + ' ' + thumbnail.url}
          />
        </Link>
      )}
    </div>
  )
}

export default TranscriptView
