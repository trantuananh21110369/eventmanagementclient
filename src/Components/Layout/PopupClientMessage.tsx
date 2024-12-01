import { useState } from 'react'
import ChatPopup from './ChatPopup'
import { Button } from '@headlessui/react'

function PopupMessage() {
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
      <ChatPopup open={isOpened} handleClose={handleClose} />
    </div>
  )
}

export default PopupMessage