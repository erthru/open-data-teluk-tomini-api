process.env.NODE_ENV = "test";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiHttp from "chai-http";
import "mocha";
import server from "../src";

chai.use(chaiAsPromised);
chai.use(chaiHttp);

describe("Get All Categories", () => {
    it("should load all categories on [GET] /categories", async () => {
        const res = await chai.request(server).get("/categories");

        chai.expect(res.body.error).to.eql(false);
        chai.expect(res.body.message).to.eql("OK");
    });
});
