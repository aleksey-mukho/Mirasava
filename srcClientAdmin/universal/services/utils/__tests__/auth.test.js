import authUtils from "../auth";
import { expiresInAccess } from "../../constants/auth";

jest.unmock("../auth");

const dateNow = Date.now();

describe("authUtils", () => {
  describe("getTimeExpires", () => {
    test("Get time when token expired", () => {
      global.Date.now = () => dateNow;
      const timeExpires = authUtils.getTimeExpires();
      expect(timeExpires).toBe(dateNow + expiresInAccess);
    });
  });

  describe("getStringifyAccessToken", () => {
    global.Date.now = () => dateNow;
    const accessToken = "accessToken";

    test("Get stringify access token when accessToken !== undefined", () => {
      authUtils.getTimeExpires = jest.fn().mockReturnValue(dateNow);
      const stringifyToken = authUtils.getStringifyAccessToken(accessToken);

      expect(stringifyToken).toBe(
        JSON.stringify({
          token: accessToken,
          timeExpires: dateNow,
        })
      );
    });

    test("Catch Error when accessToken === undefined", () => {
      function getStringifyAccessToken() {
        authUtils.getStringifyAccessToken(undefined);
      }

      authUtils.getTimeExpires = jest.fn().mockReturnValue(dateNow);
      expect(getStringifyAccessToken).toThrowError(Error);
    });
  });
});
