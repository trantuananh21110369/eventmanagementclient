import React from "react";
import { useParams } from "react-router-dom";
import { useGetOrderHeaderByIdQuery } from "Apis/orderApi";
import { useGetPurchasedTicketsByIdOrderHeaderQuery } from "Apis/purchasedTicketApi";
import { InfoOrderHeader } from 'Components/Page/Order';
import { ListPurchasedTicket } from 'Components/Page/PurchasedTicket';

function UserOrderDetailPage() {
  const { idOrderHeader } = useParams();
  const { data: dataInfoOrderHeader, isFetching: isFetchingInfoOH } = useGetOrderHeaderByIdQuery(idOrderHeader);
  const { data: dataPurchasedTicket, isFetching: isFetchingPT } = useGetPurchasedTicketsByIdOrderHeaderQuery(idOrderHeader);
  console.log(dataPurchasedTicket?.apiResponse.result)

  return (
    <div>
      {/*Order*/}
      <InfoOrderHeader orderHeader={dataInfoOrderHeader?.result} isLoading={isFetchingInfoOH} />
      {/*Order List Purchased Ticket*/}
      <ListPurchasedTicket dataTickets={dataPurchasedTicket?.apiResponse.result} isLoading={isFetchingPT} isOrganization={false} />
    </div>
  )
}

export default UserOrderDetailPage;
