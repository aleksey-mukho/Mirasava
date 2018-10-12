// @flow
import { Subscriber } from 'rxjs';
import { environment } from '../../constants/auth';

const R = require('ramda');

type SubscriberType = {
  unsubscribe: () => void
};

export default class AjaxSubscriber extends Subscriber<SubscriberType> {
  completed: boolean

  req: XMLHttpRequest

  constructor({
    observer, config, body, tokenAccess,
  }: {
    observer: rxjs$Observer<*>,
    config: {
      method: string,
      url: string
    },
    body?: Object,
    tokenAccess?: string
  }) {
    super(observer);
    this.completed = false;

    this.req = new XMLHttpRequest();

    this.settingXHRrequest({ config, tokenAccess });

    this.req.onload = () => {
      R.when(
        R.anyPass([R.equals(200), R.equals(201), R.equals(204)]),
        () => {
          observer.next(this.req.response);
          observer.complete();
        },
      )(this.req.status);

      observer.error(this.req.response);
    };

    this.req.onerror = (err) => {
      observer.error(err);
    };

    this.req.send(JSON.stringify(body));
  }

  settingXHRrequest = ({ config: { method, url }, tokenAccess }: {
    config: {
      method: string,
      url: string
    },
    tokenAccess?: string
  }) => {
    this.req.responseType = 'json';
    this.req.open(method, `${environment}/${url}`, true);
    this.req.setRequestHeader('Content-Type', 'application/json');
    R.when(
      R.pipe(R.isNil, R.not),
      // $FlowFixMe
      () => this.req.setRequestHeader('x-auth-token', tokenAccess),
    )(tokenAccess);
  };

  unsubscribe() {
    super.unsubscribe();
    R.when(
      R.equals(false),
      () => {
        this.req.abort();
        this.completed = true;
      },
    )(this.completed);
  }
}
