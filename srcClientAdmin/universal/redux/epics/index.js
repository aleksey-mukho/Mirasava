// @flow
import { combineEpics } from "redux-observable";

export default combineEpics(
  require("universal/modules/authorization/ducks/authEpic").default,
  require("universal/modules/articles/ducks/articlesEpic").default,
  require("./errorsEpic").default
);
