import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "../find/find.customer.usercase";
import CreateCustomerUseCase from "./create.customer.usecase";

describe("Test create customer integration use case", () => {

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

    it("should create a customer", async () => {

        const customerRepository = new CustomerRepository();

        const usecase = new CreateCustomerUseCase(customerRepository);

        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const input = {
            name: customer.name,
            address: {
                street: customer.address.street,
                city: customer.address.city,
                number: customer.address.number,
                zip: customer.address.zip,
            }
        };
    
        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                city: input.address.city,
                number: input.address.number,
                zip: input.address.zip,
            },
        });
    });

    it("should thrown an error when name is missing", async () => {

        const customerRepository = new CustomerRepository();

        const usecase = new CreateCustomerUseCase(customerRepository);

        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        
        const input = {
            name: "",
            address: {
                street: customer.address.street,
                city: customer.address.city,
                number: customer.address.number,
                zip: customer.address.zip,
            }
        };
        
        await expect(usecase.execute(input)).rejects.toThrow("Name is required");
    });

    it("should thrown  an error when street is missing", async () => {

        const customerRepository = new CustomerRepository();

        const usecase = new CreateCustomerUseCase(customerRepository);

        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        
        const input = {
            name: "",
            address: {
                street: "",
                city: customer.address.city,
                number: customer.address.number,
                zip: customer.address.zip,
            }
        };

        await expect(usecase.execute(input)).rejects.toThrow("Street is required");
    });
});