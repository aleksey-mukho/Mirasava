import { of } from "rxjs";
import { expectEpic } from "testUtils/epics";
import * as epics from "../articlesEpic";
import * as actions from "../articlesActions";

describe("articlesEpic", () => {
  test("Return querySuccess action, when articlesApi.query answered", () => {
    const store = {};
    const dependencies = {
      articlesApi: {
        query: jest.fn().mockReturnValue(
          of({
            response: "responce",
          })
        ),
      },
    };

    expectEpic(epics.articlesEpic, dependencies, store, {
      i: {
        t: "-c--c",
        a: {
          c: actions.query(),
        },
      },
      o: {
        t: "-c--c",
        a: {
          c: actions.querySuccess(),
        },
      },
    });

    expect(dependencies.articlesApi.query).toHaveBeenCalledTimes(2);
  });
});
