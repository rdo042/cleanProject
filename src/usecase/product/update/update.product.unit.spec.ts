import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

describe("Unit Test update product use case", () => {

    const product = ProductFactory.create(
        "a",
        "Product 1",
        10.0,
    );

    const input = {
        id: product.id,
        name: "Product Updated",
        price: 20.0,
    }

    const MockRepository = () => {
        return {
            find: jest.fn().mockReturnValue(Promise.resolve(product)),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        }
    }

    it("should update a product", async () => {

        const productRepository = MockRepository();

        const usecase = new UpdateProductUseCase(productRepository);

        const output = await usecase.execute(input);

        expect(output).toEqual(input);
    });

});