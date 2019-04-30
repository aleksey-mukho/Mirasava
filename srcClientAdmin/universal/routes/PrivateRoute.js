// @flow
import * as React from "react";
import { Route, Redirect } from "react-router-dom";

import type { CookiesType } from "../services/storage/cookies";
import { renderPageByUserAuth } from "./utils";

export default (cookies: CookiesType) => ({
  component: Component,
  ...rest
}: {
  component: React.ComponentType<*>,
}) => (
  <Route
    {...rest}
    render={props =>
      renderPageByUserAuth({
        cookies,
        ComponentAuthUser: <Component {...props} />,
        ComponentNotAuthUser: (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        ),
      })
    }
  />
);

// R.pipe(
//   getCookie,
//   R.ifElse(
//     R.always,
//     () => <Component {...props} />,
//     () => (<Redirect
//       to={{
//         pathname: '/login',
//         state: { from: props.location },
//       }}
//     />),
//   ),
// )({
//   cookies: props.cookies, cookieName: authTokensCookiesName,
// })

// const cookies = getCookie({
//   cookies: props.cookies, cookieName: authTokensCookiesName,
// });
// const componentOrRedirect = cookies
//   ? <Component {...props} /> : (<Redirect
//     to={{
//       pathname: '/login',
//       state: { from: props.location },
//     }}
//   />);
// return componentOrRedirect;
