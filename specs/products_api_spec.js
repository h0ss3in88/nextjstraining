const superTest = require("supertest");
const should = require("should");
const { default: validator } = require("validator");
const { initApp } = require("../src/server/app");
const { ProductMockRepo } = require("../src/server/db");
const { productGenerator } = require("../src/server/helpers");
describe.only("Products Api", function () {
  let app;
  let productRepo;
  let number = 50;
  let products = [];
  before(async function () {
    try {
      productRepo = new ProductMockRepo();
      products = await productRepo.seedRepo({ number });
      let repos = { productRepo };
      app = await initApp({ repos });
    } catch (error) {
      should(error == undefined && error == null);
    }
  });
  describe("Happy PATH", function () {
    it("products has 50 number", async () => {
      try {
        const response = await superTest(app)
          .get("/api/products/")
          .expect("Content-Type", /json/)
          .expect(200);
        should(response.body.products).length(50);
        should(response.body.products[0].id == 1);
      } catch (error) {
        console.log(error);
        should(error).be.null().and.undefined();
      }
    });
    it("returns only one product successfully", async () => {
      try {
        let productId = 3;
        const response = await superTest(app)
          .get(`/api/products/${productId}`)
          .expect("Content-Type", /json/)
          .expect(200);
        should(response.body.product).has.property("id", 3);
        should(response.body.product).has.property("name");
      } catch (error) {
        console.log(error);
        should(error).be.null().and.undefined();
      }
    });
    it("create product successfully", async function () {
      try {
        let newProduct = productGenerator(50).next().value;
        const response = await superTest(app)
          .post(`/api/products`)
          .send({ product: newProduct })
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(201);
        should(response.body.product).has.properties(["id", "name", "price"]);
        products.push(response.body.product);
        should(response.body.product).has.property("id", 51);
      } catch (error) {
        should(error).be.null().and.undefined();
      }
    });
    it("update product by id successfully", async () => {
      try {
        let item = products[50];
        item.name = "x";
        let productId = item.id;
        const response = await superTest(app)
          .put(`/api/products/${productId}`)
          .send({
            id: item.id,
            productId: item.productId,
            productName: item.name,
            description: "this is updated description",
            price: 390,
            count: 1000,
          })
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200);
        should(response.body.success).be.true;
        should(response.body.updatedId).equal(51);
      } catch (error) {
        should(error).be.null().and.undefined();
      }
    });
    it("delete product by id successfully", async () => {
      try {
        let productId = 51;
        const response = await superTest(app)
          .del(`/api/products/${productId}`)
          .expect("Content-Type", /json/)
          .expect(200);
        response.body.success && products.pop();
        should(response.body.success).be.true;
        should(response.body.deletedId).equal(51);
        should(products.length).equal(50);
      } catch (error) {
        should(error).be.null().and.undefined();
      }
    });
  });
});
