import { Sequelize } from "sequelize-typescript";
import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequilize/product.model";
import OrderRepository from "./order.repository";
import Order from "../../../../domain/checkout/entity/order";
import Product from "../../../../domain/product/entity/product";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductRepository from "../../../product/repository/sequilize/product.repository";
import OrderModel from "./order.model";


describe("Order repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true},
        });
        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    })

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new Order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.id,
            product.price,
            2
        )

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                }
            ],
        });

    });

    it("should update a order by customer", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.id,
            product.price,
            2
        )

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const customer2 = new Customer("124", "Customer 2");
        const address2 = new Address("Street 2", 1, "Zipcode 2", "City 2");
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);


        order.changeCustomer("124");

        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "124",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                }
            ],
        });
    });

    it("should find a order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.id,
            product.price,
            2
        )

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.find(order.id);

        expect(order).toStrictEqual(orderResult);
    });

    it("should find all order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.id,
            product.price,
            2
        )

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const customer2 = new Customer("124", "Customer 2");
        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);

        const product2 = new Product("124", "Product 2", 30);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem(
            "2",
            product2.name,
            product2.id,
            product2.price,
            5
        )

        const order2 = new Order("124", "124", [orderItem2]);

        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();
        
        expect(orders).toHaveLength(2);
        expect(orders).toContainEqual(order);
        expect(orders).toContainEqual(order2);

    });

    
});