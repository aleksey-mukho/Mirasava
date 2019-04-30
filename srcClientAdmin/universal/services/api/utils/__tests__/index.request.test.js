import AjaxSubscriber from "../AjaxSubscriber";
import utils from "..";

jest.mock("../AjaxSubscriber");

describe("api/utils/index.request", () => {
  test("AjaxSubscriber call, when call request", done => {
    utils
      .request({
        config: {
          url: "url",
          method: "POST",
        },
      })
      .subscribe({
        next: responce => {
          expect(AjaxSubscriber).toHaveBeenCalled();
          expect(AjaxSubscriber).toHaveBeenCalledTimes(1);
          expect(responce).toEqual({ responce: "responce" });
        },
        complete: done,
      });
  });
});
