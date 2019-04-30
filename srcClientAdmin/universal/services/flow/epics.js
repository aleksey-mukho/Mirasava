// @flow
import { Observable } from "rxjs";

export type ActionType = {
  pipe: <T>(...args: Array<T>) => Observable<T>,
};

export type StoreType = {};
