import React from 'react'

interface ButtonProps {
  text: string;
}

function SubmitButton({ text }: ButtonProps) {
  return (
    <button type="submit" className='rounded-full bg-primary text-second px-3 py-1 font-bold '>
      {text}
    </button>
  )
}

export default SubmitButton
