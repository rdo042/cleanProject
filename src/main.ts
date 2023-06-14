import Address from "./domain/customer/value-object/address";
import Customer from "./domain/customer/entity/customer";
import OrderItem from "./domain/checkout/entity/order_item";
import Order from "./domain/checkout/entity/order";

let customer = new Customer("1", "Ronaldo Orling");

const address = new Address("Rua João Américo Watsko", 691, "88309-800", "Itajai");

customer.changeAddress(address);
customer.activate();

const item1 = new OrderItem("1", "Item 1", "REF-P1", 10, 15);
const item2 = new OrderItem("1", "Item 2", "REF-P1", 10, 15);

let listaItens: OrderItem[] = [];
listaItens.push(item1);
listaItens.push(item2);

const order = new Order("1", "123", listaItens);


