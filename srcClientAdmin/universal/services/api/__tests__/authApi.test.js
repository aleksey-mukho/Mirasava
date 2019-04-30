import authApi from "../authApi";

describe("authApi", () => {
  describe("fetchTokens", () => {
    const ajax = jest.fn();
    test("Ajax was called with parametres", () => {
      const username = "username";
      const password = "password";
      authApi(ajax).fetchTokens(username, password);

      expect(ajax).toHaveBeenCalledTimes(1);
      expect(ajax).toHaveBeenCalledWith({
        config: {
          url: "auth/login",
          method: "POST",
        },
        body: {
          username,
          password,
        },
        isWithoutToken: true,
      });
    });
  });
});
