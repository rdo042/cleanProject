import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequilize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequilize/product.repository";
import FindProductUseCase from "./find.product.usercase";
import Product from "../../../domain/product/entity/product";

describe("Test find product integration use case", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true},
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    })

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find a product", async () => {

        const productRepository = new ProductRepository();

        const usecase = new FindProductUseCase(productRepository);

        const product = new Product("123", "Product 1", 10.0);
        
        await productRepository.create(product);

        const input = {
            id: "123"
        }

        const output = {
            id: "123",
            name: "Product 1",
            price: 10.0,
        }

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    });
});