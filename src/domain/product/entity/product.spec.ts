import Product from "./product";

describe("Product unit tests", () => {

    it("should throw error when id is empty", () => {

        expect(() => {
            let product = new Product("", "Produto 1", 100);
        }).toThrowError("Id is required");

    });

    it("should throw error when name is empty", () => {

        expect(() => {
            let product = new Product("2", "", 100);
        }).toThrowError("Name is required");

    });

    it("should throw error when price is less than zero", () => {

        expect(() => {
            const product = new Product("2", "Produto 1", -1);
        }).toThrowError("Price must be greater than zero");

    });

    it("should change name", () => {

        let product = new Product("123", "Produto 1", 100);
        product.changeName("Product 2");

        expect(product.name).toBe("Product 2");

    });

    it("should change price", () => {

        let product = new Product("123", "Produto 1", 100);
        product.changePrice(200);

        expect(product.price).toBe(200);

    });
});