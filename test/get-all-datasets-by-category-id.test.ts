process.env.NODE_ENV = "test";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiHttp from "chai-http";
import "mocha";
import server from "../src";

chai.use(chaiAsPromised);
chai.use(chaiHttp);

describe("Get All Datasets By Category Id", () => {
    let datasets: any[] = [];

    it("should load all datasets by their categoryId on [GET] /datasets/category-id/:categoryId", async () => {
        const res = await chai.request(server).get("/categories");
        const _res = await chai.request(server).get(`/datasets/category-id/${res.body.categories[0]._id}?page=1&limit=10`);

        let isAllIncluded = true;

        for (let dataset of _res.body.datasets) {
            if (dataset.categoryId !== res.body.categories[0]._id) {
                isAllIncluded = false;
                break;
            }
        }

        chai.expect(_res.body.error).to.eql(false);
        chai.expect(_res.body.message).to.eql("OK");
        chai.expect(_res.body).to.haveOwnProperty("datasets");
        chai.expect(_res.body).to.haveOwnProperty("total");
        chai.expect(_res.body.datasets).to.have.length(10);
        chai.expect(isAllIncluded).to.eql(true);

        datasets = _res.body.datasets;
    });

    it("next page result should different from previous test", async () => {
        const res = await chai.request(server).get("/categories");
        const _res = await chai.request(server).get(`/datasets/category-id/${res.body.categories[0]._id}?page=2&limit=10`);

        chai.expect(_res.body.error).to.eql(false);
        chai.expect(_res.body.message).to.eql("OK");
        chai.expect(datasets).not.eql(_res.body.datasets);
    });
});
