import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetOrderHeaderByIdQuery } from 'Apis/orderApi';
import InfoOrderHeader from 'Components/Page/Order/InfoOrderHeader';
import ListPurchasedTicket from 'Components/Page/PurchasedTicket/ListPurchasedTicket';
import { useGetPurchasedTicketsByIdOrderHeaderQuery } from 'Apis/purchasedTicketApi';

function OrderDetailPage() {
  const { idOrderHeader } = useParams();
  const { data: dataInfoOrderHeader, isFetching: isFetchingInfoOH } = useGetOrderHeaderByIdQuery(idOrderHeader);
  const { data: dataPurchasedTicket, isFetching: isFetchingPT } = useGetPurchasedTicketsByIdOrderHeaderQuery(idOrderHeader);

  return (
    <div>
      {/*Order*/}
      <InfoOrderHeader orderHeader={dataInfoOrderHeader?.result} isLoading={isFetchingInfoOH} />
      {/*Order List Purchased Ticket*/}
      <ListPurchasedTicket dataTickets={dataPurchasedTicket?.apiResponse.result} isLoading={isFetchingPT} isOrganization={true} />
    </div>
  )
}

export default OrderDetailPage


