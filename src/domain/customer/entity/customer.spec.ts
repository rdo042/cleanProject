import EventDispatcher from "../../@shared/event/event-dispatcher";
import SendEmailWhenCustomerAddressIsChangedHandler from "../event/handler/send-email-when-customer-address-is-changed.handler";
import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {

    it("should throw error when id is empty", () => {

        expect(() => {
            let customer = new Customer("", "John");
        }).toThrowError("customer: Id is required");

    });

    it("should throw error when name is empty", () => {

        expect(() => {
            let customer = new Customer("123", "");
        }).toThrowError("customer: Name is required");

    });

    it("should throw error when name  and id are empty", () => {

        expect(() => {
            let customer = new Customer("", "");
        }).toThrowError("customer: Id is required,customer: Name is required");

    });

    it("should change name", () => {

        const customer = new Customer("123", "Ronaldo");
        customer.changeName("Jane");
                
        expect(customer.name).toBe("Jane");

    });

    it("should active customer", () => {

        const customer = new Customer("123", "Ronaldo");
        const address = new Address("Rua João Américo Watsko", 691, "88309-800", "Itajaí");
        customer.changeAddress(address);

        customer.activate();
                
        expect(customer.isActive()).toBe(true);

    });

    it("should deactive customer", () => {

        const customer = new Customer("123", "Ronaldo");
       
        customer.deactivate();
                
        expect(customer.isActive()).toBe(false);

    });

    it("should throw error when address is undefined when you activate a customer", () => {

        expect(() => {
            const customer = new Customer("123", "Ronaldo");

            customer.activate();

        }).toThrowError("customer: Address is mandatory to activate a customer");

    });

    it("should add reward reward points", () => {
        const customer = new Customer("1", "Customer 1");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });

    it("Should notify When Customer Address changed", () => {
        
        expect(() => {
            const eventDispatcher = new EventDispatcher();
            const eventHandler = new SendEmailWhenCustomerAddressIsChangedHandler();
            const spyEventHandler = jest.spyOn(eventHandler, "handle");

            const customer = new Customer("123", "Customer 1");
            const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
            customer.changeAddress(address);

        }).not.toThrowError("Problem in sent message to handler");

    });
});