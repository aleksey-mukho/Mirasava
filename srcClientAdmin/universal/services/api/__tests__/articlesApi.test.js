import articlesApi from "../articlesApi";

describe("articlesApi", () => {
  describe("query", () => {
    const ajax = jest.fn();
    test("Ajax was called with parametres", () => {
      articlesApi(ajax).query();

      expect(ajax).toHaveBeenCalledTimes(1);
      expect(ajax).toHaveBeenCalledWith({
        config: {
          url: "query",
          method: "GET",
        },
      });
    });
  });
});
