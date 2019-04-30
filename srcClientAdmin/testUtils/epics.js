import { TestScheduler } from "rxjs/testing";
import { ActionsObservable } from "redux-observable";

// Related docs
// https://www.nexthink.com/blog/marble-testing-redux-observable-epics/
// https://github.com/redux-observable/redux-observable/issues/108
// https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md
// https://github.com/redux-observable/redux-observable/issues/144

// const frames = (n, unit = '-') => {
//   return n === 1 ? unit : unit + frames(n - 1, unit);
// };

const createTestScheduler = () =>
  new TestScheduler((actual, expected) => expect(actual).toEqual(expected));

const expectEpic = (epic, dependencies, store, actions) => {
  const testScheduler = createTestScheduler();

  const epicDependencies = {
    ...dependencies,
    scheduler: testScheduler,
  };

  testScheduler.run(({ expectObservable, hot }) => {
    const action$ = new ActionsObservable(hot(actions.i.t, actions.i.a));
    const output = epic(action$, store, epicDependencies);
    expectObservable(output).toBe(actions.o.t, actions.o.a);
  });
};

export {
  expectEpic,
  // frames,
  createTestScheduler,
};
