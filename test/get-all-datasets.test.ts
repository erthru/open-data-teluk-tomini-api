import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";
import { BASE_URL } from "../../src/helpers/environments";
import fetch from "node-fetch";

chai.use(chaiAsPromised);

describe("Get All Datasets", () => {
    it("should load all datasets on [GET] /datasets", async () => {
        const _fetch = await fetch(BASE_URL + "datasets?page=1&limit=10");
        const res = await _fetch.json();

        chai.expect(res.error).to.eql(false);
        chai.expect(res.message).to.eql("OK");
        chai.expect(res.datasets).to.have.length(10);

        console.log(res);
    });
});
