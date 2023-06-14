import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequilize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequilize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Test update product integration use case", () => {

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

    it("should update a product", async () => {

        const productRepository = new ProductRepository();

        const usecase = new UpdateProductUseCase(productRepository);

        const product = new Product("123", "Product 1", 10.0);
        await productRepository.create(product);

        const input = {
            id: product.id,
            name: "Product Updated",
            price: 30.0,
        }
    
        const output = await usecase.execute(input);

        expect(output).toEqual(input);
    });
});