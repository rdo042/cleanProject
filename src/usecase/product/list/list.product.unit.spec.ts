import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUseCase from "./list.product.usercase";

describe("Unit Test for listing customer use case", () => {

    const product = ProductFactory.create(
        "a", "Product 1", 10.0,
    );

    const product2 = ProductFactory.create(
        "a", "Product 2", 20.0,
    );

    const MockRepository = () => {
        return {
            find: jest.fn(),
            findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2])),
            create: jest.fn(),
            update: jest.fn(),
        }
    }

    it("should list a product", async () => {

        const productRepository = MockRepository();

        const usecase = new ListProductUseCase(productRepository);

        const output = await usecase.execute({});

        expect(output.products.length).toBe(2);
        expect(output.products[0].id).toBe(product.id);
        expect(output.products[0].name).toBe(product.name);
        expect(output.products[0].price).toBe(product.price);
        expect(output.products[1].id).toBe(product2.id);
        expect(output.products[1].name).toBe(product2.name);
        expect(output.products[1].price).toBe(product2.price);
    });

});