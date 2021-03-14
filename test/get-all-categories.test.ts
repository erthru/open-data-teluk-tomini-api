import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";
import { BASE_URL } from "../src/helpers/environments";
import fetch from "node-fetch";

chai.use(chaiAsPromised);

describe("Get All Categories", () => {
    it("should load all categories on [GET] /categories", async () => {
        const _fetch = await fetch(BASE_URL + "categories");
        const res = await _fetch.json();

        chai.expect(res.error).to.eql(false);
        chai.expect(res.message).to.eql("OK");

        console.log(res);
    });
});
