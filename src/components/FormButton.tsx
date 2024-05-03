'use client'
import { useFormStatus } from 'react-dom'

import { ReactNode } from 'react'
import { Button } from './ui/button'

const FormButton = ({ children }: { children: ReactNode }) => {
  const { pending } = useFormStatus()
  return (
    <Button className="mt-4" type="submit" disabled={pending}>
      {pending ? 'loading' : children}
    </Button>
  )
}

export default FormButton
