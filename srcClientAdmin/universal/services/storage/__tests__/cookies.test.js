import * as cookiesTest from "../cookies";

describe("cookies", () => {
  describe("setCookie", () => {
    const cookies = {
      set: jest.fn(),
      get: jest.fn(),
    };
    const cookieName = "name";
    const cookieValue = "value";

    test("Call cookies.set", () => {
      cookiesTest.setCookie({ cookies, cookieName, cookieValue });

      expect(cookies.set).toHaveBeenCalledTimes(1);
      expect(cookies.set).toHaveBeenCalledWith(cookieName, cookieValue);
    });

    test("Call cookies.get", () => {
      cookiesTest.getCookie({ cookies, cookieName });

      expect(cookies.get).toHaveBeenCalledTimes(1);
      expect(cookies.get).toHaveBeenCalledWith(cookieName);
    });
  });
});
