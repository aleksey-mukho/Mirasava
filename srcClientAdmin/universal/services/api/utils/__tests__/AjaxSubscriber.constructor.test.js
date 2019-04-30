import { Observable } from "rxjs";
import AjaxSubscriber from "../AjaxSubscriber";
import { TOKEN_ACCESS } from "../../../storage/cookies";

const config = {
  method: "method",
  url: "url",
};
const body = {
  text: "text",
};
const tokenAccess = TOKEN_ACCESS;

global.XMLHttpRequest = () => ({
  send: jest.fn(),
  open: jest.fn(),
  setRequestHeader: jest.fn(),
});
const mockSettingXHRrequest = jest.fn();

jest.mock("../AjaxSubscriber", () => {
  return jest.fn().mockImplementation(() => {
    return {
      settingXHRrequest: mockSettingXHRrequest,
    };
  });
});

describe("AjaxSubscriber.constructor", () => {
  test("Functions call when init constructor", () => {
    Observable.create(observer => {
      const subscriber = new AjaxSubscriber({
        observer,
        config,
        body,
        tokenAccess,
      });

      expect(subscriber.settingXHRrequest).toHaveBeenCalled();
      expect(subscriber.settingXHRrequest).toHaveBeenCalledTimes(1);
      expect(subscriber.settingXHRrequest).toHaveBeenCalledWith({
        config,
        tokenAccess,
      });

      expect(subscriber.req.onload).toHaveBeenCalled();
      expect(subscriber.req.onload).toHaveBeenCalledTimes(1);

      expect(subscriber.req.onerror).toHaveBeenCalled();
      expect(subscriber.req.onerror).toHaveBeenCalledTimes(1);

      expect(subscriber.req.send).toHaveBeenCalled();
      expect(subscriber.req.send).toHaveBeenCalledTimes(1);
      expect(subscriber.req.send).toHaveBeenCalledWith(JSON.stringify(body));

      expect(subscriber.unsubscribe).not.toHaveBeenCalled();
    });
  });
});
