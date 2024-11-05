import React from 'react'

function ConfirmOrder() {
  return (
    <div>
      {/*Area Order Summary*/}
      <div className='flex flex-col'>
        <h1> Summary Order </h1>
        <div className='flex flex-row gap-3'>
          <p> Quantity x Name Ticket 1 </p>
          <p> Price </p>
        </div>
        <div className='flex flex-row gap-3'>
          <p> Quantity x Name Ticket 2 </p>
          <p> Price </p>
        </div>
      </div>

      {/*Area Payment*/}
      <div>
        <button className='bg-primary p-3 rounded-full'> Confirm </button>
      </div>
    </div>
  )
}

export default ConfirmOrder
