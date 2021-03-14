process.env.NODE_ENV = "test";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiHttp from "chai-http";
import "mocha";
import server from "../src";

chai.use(chaiAsPromised);
chai.use(chaiHttp);

describe("Get All Visualization", () => {
    let visualizations: any[] = [];

    it("should load all visualizations on [GET] /visualization", async () => {
        const res = await chai.request(server).get("/visualizations?page=1&limit=10");

        chai.expect(res.body.error).to.eql(false);
        chai.expect(res.body.message).to.eql("OK");
        chai.expect(res.body).to.haveOwnProperty("visualizations")
        chai.expect(res.body).to.haveOwnProperty("total")
        chai.expect(res.body.visualizations).to.have.length(10)

        visualizations = res.body.visualizations;
    });

    it("next page result should different from previous test", async () => {
        const res = await chai.request(server).get("/visualizations?page=2&limit=10");

        chai.expect(res.body.error).to.eql(false);
        chai.expect(res.body.message).to.eql("OK");
        chai.expect(visualizations).not.eql(res.body.visualizations);
    });
});
