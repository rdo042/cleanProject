import CreateCustomerUseCase from "./create.customer.usecase";

describe("Unit Test create customer use case", () => {

    const input = {
        name: "Customer 1",
        address: {
            street: "Street 1",
            city: "City 1",
            number: 1,
            zip: "Zipcode 1",
        }
    }

    const MockRepository = () => {
        return {
            find: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        }
    }

    it("should create a customer", async () => {

        const customerRepository = MockRepository();

        const usecase = new CreateCustomerUseCase(customerRepository);

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

        const customerRepository = MockRepository();

        const usecase = new CreateCustomerUseCase(customerRepository);
        
        input.name = "";
        
        await expect(usecase.execute(input)).rejects.toThrow("Name is required");
    });

    it("should thrown  an error when street is missing", async () => {

        const customerRepository = MockRepository();

        const usecase = new CreateCustomerUseCase(customerRepository);
        
        input.address.street = "";
        
        await expect(usecase.execute(input)).rejects.toThrow("Street is required");
    });
    
});