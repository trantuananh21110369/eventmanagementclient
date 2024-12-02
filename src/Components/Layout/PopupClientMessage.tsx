import { useState } from 'react'
import ChatPopup from './ChatPopup'
import { Button } from '@headlessui/react'

interface PopupMessageProps {
  organizationId: string | undefined
}

function PopupMessage({ organizationId }: PopupMessageProps) {
  const [isOpened, setIsOpened] = useState(false)

  const handleClose = () => {
    setIsOpened(false)
  }

  const handleOpen = () => {
    setIsOpened(true)
  }

  return (
    <div>
      <div className='fixed bottom-0 right-0 m-1'>
        <Button className="px-4 py-2 bg-primary rounded-sm text-second" onClick={handleOpen}>Chat</Button>
      </div>
      <ChatPopup open={isOpened} handleClose={handleClose} organizationId={organizationId} />
    </div>
  )
}

export default PopupMessage