import React from "react";
import Loadable from "react-loadable";
import path from "path";

export { default as Home } from "universal/components/Home/Home";
export {
  default as ArticlesList,
} from "universal/modules/articles/pages/articlesList";

export const LoadableLogin = Loadable({
  loader: () => import("universal/modules/authorization/containers/Login"),
  loading() {
    return null;
  },
  render(loaded, props) {
    const LoadableComponent = loaded.default;
    return <LoadableComponent {...props} />;
  },
  // delay: 25000,
  serverSideRequirePath: path.join(
    __dirname,
    "universal/modules/authorization/containers/Login"
  ),
});
