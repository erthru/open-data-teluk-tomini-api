process.env.NODE_ENV = "test";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiHttp from "chai-http";
import "mocha";
import server from "../src";

chai.use(chaiAsPromised);
chai.use(chaiHttp);

describe("Get All Datasets", () => {
    let datasets: any[] = [];

    it("should load all datasets on [GET] /datasets", async () => {
        const res = await chai.request(server).get("/datasets?page=1&limit=10");

        chai.expect(res.body.error).to.eql(false);
        chai.expect(res.body.message).to.eql("OK");
        chai.expect(res.body.datasets).to.have.length(10);

        datasets = res.body.datasets;
    });

    it("next page result should different from previous test", async () => {
        const res = await chai.request(server).get("/datasets?page=2&limit=10");

        chai.expect(res.body.error).to.eql(false);
        chai.expect(res.body.message).to.eql("OK");
        chai.expect(res.body.datasets).to.have.length(10);
        chai.expect(datasets).not.eql(res.body.datasets);
    });
});
