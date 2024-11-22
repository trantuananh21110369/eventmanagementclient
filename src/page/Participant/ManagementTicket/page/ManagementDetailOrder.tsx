import React from 'react'
import { useParams } from 'react-router-dom'

function ManagementDetailOrder() {
  const { idOrder } = useParams();

  return (
    <div>
      {/*Detail Order*/}
      <div> </div>
      {/*List Purchased Ticket*/}
      <div> </div>
    </div>
  )
}

export default ManagementDetailOrder
