import * as generateId from "../generateId";

describe("generateId", () => {
  test("Return 0000, when Math.random = () => 1", () => {
    global.Math.random = () => 1;

    expect(generateId.s4()).toBe("0000");
  });

  test("Return 7a5a7a5a-7a5a-7a5a-7a5a-7a5a7a5a7a5a", () => {
    global.Math.random = () => 1;
    const s4 = "7a5a";
    generateId.s4 = jest.fn().mockReturnValue(s4);
    const guid = generateId.guid();

    expect(guid).toBe(`${s4}${s4}-${s4}-${s4}-${s4}-${s4}${s4}${s4}`);
    expect(generateId.s4).toHaveBeenCalledTimes(8);
  });
});
