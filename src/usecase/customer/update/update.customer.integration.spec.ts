import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import UpdateCustomerUseCase from "./update.customer.usecase";


describe("Test update customer integration use case", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true},
        });
        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    })

    afterEach(async () => {
        await sequelize.close();
    });

    it("should update a customer", async () => {

        const customerRepository = new CustomerRepository();

        const usecase = new UpdateCustomerUseCase(customerRepository);

        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const input = {
            id: customer.id,
            name: "John Updated",
            address: {
                street: "Street 1 Updated",
                city: "City 1 Updated",
                number: 1234,
                zip: "Zip Updated",
            }
        }
    
        const output = await usecase.execute(input);

        expect(output).toEqual(input);
    });
});