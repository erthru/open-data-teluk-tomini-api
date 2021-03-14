process.env.NODE_ENV = "test";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiHttp from "chai-http";
import "mocha";
import server from "../src";

chai.use(chaiAsPromised);
chai.use(chaiHttp);

describe("Get Dataset By Slug", () => {
    it("the data should match the slug in url params", async () => {
        const res = await chai.request(server).get("/datasets?limit=5");
        const _res = await chai.request(server).get(`/dataset/slug/${res.body.datasets[4].slug}`);

        chai.expect(_res.body.error).to.eql(false);
        chai.expect(_res.body.message).to.eql("OK");
        chai.expect(_res.body).to.haveOwnProperty("dataset")
        chai.expect(_res.body.dataset.slug).to.eql(res.body.datasets[4].slug);
    });
});
