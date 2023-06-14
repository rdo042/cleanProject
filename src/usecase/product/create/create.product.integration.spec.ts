import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequilize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequilize/product.repository";
import CreateProductUseCase from "./create.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Test create product integration use case", () => {

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

    it("should create a product", async () => {

        const productRepository = new ProductRepository();

        const usecase = new CreateProductUseCase(productRepository);

        const product = new Product("123", "Product 1", 10.0);
        
        await productRepository.create(product);

        const input = {
            type: "a",
            name: product.name,
            price: product.price
        };
    
        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });
    });

    it("should thrown an error when name is missing", async () => {

        const productRepository = new ProductRepository();

        const usecase = new CreateProductUseCase(productRepository);

        const product = new Product("123", "Product 1", 10.0);
        
        await productRepository.create(product);
        
        const input = {
            type: "a",
            name: "",
            price: product.price
        };
        
        await expect(usecase.execute(input)).rejects.toThrow("Name is required");
    });

    it("should thrown  an error when street is missing", async () => {

        const productRepository = new ProductRepository();

        const usecase = new CreateProductUseCase(productRepository);

        const product = new Product("123", "Product 1", 10.0);
        
        await productRepository.create(product);


        const input = {
            type: "a",
            name: product.name,
            price: -10.0
        };

        await expect(usecase.execute(input)).rejects.toThrow("Price must be greater than zero");
    });
});