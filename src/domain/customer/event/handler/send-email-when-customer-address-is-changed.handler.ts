import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class SendEmailWhenCustomerAddressIsChangedHandler implements EventHandlerInterface<CustomerAddressChangedEvent>{
    handle(event: CustomerAddressChangedEvent): void {
       console.log("Endereço do cliente: %s, %s alterado para %s",event.eventData.customer.id
        , event.eventData.customer.name
        , event.eventData.customer.address.street+', '+event.eventData.customer.address.number+', '+event.eventData.customer.address.zip+', '+event.eventData.customer.address.city);
    }

}