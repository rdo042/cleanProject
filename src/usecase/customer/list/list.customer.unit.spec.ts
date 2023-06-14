import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./list.customer.usercase";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import ListCustomerUseCase from "./list.customer.usercase";

describe("Unit Test for listing customer use case", () => {

    const customer = CustomerFactory.createWithAddress(
        "John Doe",
        new Address("Street 1", 1, "12345", "City 1"),
    );

    const customer2 = CustomerFactory.createWithAddress(
        "Jane Doe",
        new Address("Street 2", 2, "12456", "City 2"),
    );

    const MockRepository = () => {
        return {
            find: jest.fn(),
            findAll: jest.fn().mockReturnValue(Promise.resolve([customer, customer2])),
            create: jest.fn(),
            update: jest.fn(),
        }
    }

    it("should list a customer", async () => {

        const customerRepository = MockRepository();

        const usecase = new ListCustomerUseCase(customerRepository);

        const output = await usecase.execute({});

        expect(output.customers.length).toBe(2);
        expect(output.customers[0].id).toBe(customer.id);
        expect(output.customers[0].name).toBe(customer.name);
        expect(output.customers[0].address.street).toBe(customer.address.street);
        expect(output.customers[1].id).toBe(customer2.id);
        expect(output.customers[1].name).toBe(customer2.name);
        expect(output.customers[1].address.street).toBe(customer2.address.street);
    });

});