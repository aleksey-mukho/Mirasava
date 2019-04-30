import { Observable } from "rxjs";
import AjaxSubscriber from "../AjaxSubscriber";
import { TOKEN_ACCESS } from "../../../storage/cookies";
import { environment } from "../../../constants/auth";

const config = {
  method: "method",
  url: "url",
};
const body = {};
const responce = {
  responce: "responce",
};
const err = {
  error: "error",
};
const tokenAccess = TOKEN_ACCESS;
// const mockSettingXHRrequest = jest.fn();

// jest.mock('../AjaxSubscriber', () => {
//   return jest.fn().mockImplementation(() => {
//     return {
//       req: {},
//       settingXHRrequest: mockSettingXHRrequest,
//     };
//   });
// });

describe("AjaxSubscriber", () => {
  describe("this.req.onload", () => {
    global.XMLHttpRequest = () => ({
      send: jest.fn(),
      open: jest.fn(),
      setRequestHeader: jest.fn(),
    });

    test("Return responce when this.req.status === 200", done => {
      Observable.create(observer => {
        const subscriber = new AjaxSubscriber({
          observer,
          config,
          body,
          tokenAccess,
        });

        subscriber.settingXHRrequest = jest.fn();
        subscriber.req.status = 200;
        subscriber.req.responce = responce;
        subscriber.req.onload().subscribe({
          next: resp => {
            expect(resp).toEqual(subscriber.req.responce);
          },
        });
      }).subscribe({ complete: done });
    });

    test("Return responce when this.req.status === 201", done => {
      Observable.create(observer => {
        const subscriber = new AjaxSubscriber({
          observer,
          config,
          body,
          tokenAccess,
        });

        subscriber.settingXHRrequest = jest.fn();
        subscriber.req.status = 201;
        subscriber.req.responce = responce;
        subscriber.req.onload().subscribe({
          next: resp => {
            expect(resp).toEqual(subscriber.req.responce);
          },
        });
      }).subscribe({ complete: done });
    });

    test("Return responce when this.req.status === 204", done => {
      Observable.create(observer => {
        const subscriber = new AjaxSubscriber({
          observer,
          config,
          body,
          tokenAccess,
        });

        subscriber.settingXHRrequest = jest.fn();
        subscriber.req.status = 204;
        subscriber.req.responce = responce;
        subscriber.req.onload().subscribe({
          next: resp => {
            expect(resp).toEqual(subscriber.req.responce);
          },
        });
      }).subscribe({ complete: done });
    });

    test("Return error when this.req.status !== 200 || 201 || 204", done => {
      Observable.create(observer => {
        const subscriber = new AjaxSubscriber({
          observer,
          config,
          body,
          tokenAccess,
        });

        subscriber.settingXHRrequest = jest.fn();
        subscriber.req.status = 404;
        subscriber.req.responce = responce;
        subscriber.req.onload().subscribe({
          error: error => {
            expect(error).toEqual(err);
          },
        });
      }).subscribe({ error: done });
    });
  });

  test("observer.error was called when onerror was called", done => {
    global.XMLHttpRequest = () => ({
      send: jest.fn(),
      open: jest.fn(),
      onload: jest.fn(),
      setRequestHeader: jest.fn(),
    });

    Observable.create(observer => {
      const subscriber = new AjaxSubscriber({
        observer,
        config,
        body,
        tokenAccess,
      });

      subscriber.settingXHRrequest = jest.fn();
      subscriber.req.onerror(err).subscribe({
        error: error => {
          expect(error).toEqual(err);
        },
      });
    }).subscribe({ error: () => done() });
  });

  describe("this.unsubscribe", () => {
    test("this.req.abort was called when this.completed === false", () => {
      global.XMLHttpRequest = () => ({
        send: jest.fn(),
        open: jest.fn(),
        onload: jest.fn(),
        abort: jest.fn(),
        setRequestHeader: jest.fn(),
      });
      const subscriber = new AjaxSubscriber({
        config,
        body,
        tokenAccess,
      });
      subscriber.completed = false;
      subscriber.unsubscribe();

      expect(subscriber.req.abort).toHaveBeenCalled();
      expect(subscriber.req.abort).toHaveBeenCalledTimes(1);
      expect(subscriber.completed).toBeTruthy();
    });

    test("this.req.abort wasn't called when this.completed === true", () => {
      global.XMLHttpRequest = () => ({
        send: jest.fn(),
        open: jest.fn(),
        onload: jest.fn(),
        abort: jest.fn(),
        setRequestHeader: jest.fn(),
      });
      const subscriber = new AjaxSubscriber({
        config,
        body,
        tokenAccess,
      });
      subscriber.completed = true;
      subscriber.unsubscribe();

      expect(subscriber.req.abort).not.toHaveBeenCalled();
      expect(subscriber.completed).toBeTruthy();
    });
  });

  describe("settingXHRrequest", () => {
    global.XMLHttpRequest = () => ({
      send: jest.fn(),
      open: jest.fn(),
      onload: jest.fn(),
      abort: jest.fn(),
      setRequestHeader: jest.fn(),
    });

    test("setRequestHeader was called 2 times, when accessToken !== undefined", () => {
      const subscriber = new AjaxSubscriber({
        config,
        body,
        tokenAccess,
      });

      expect(subscriber.req.responseType).toBe("json");
      expect(subscriber.req.open).toHaveBeenCalled();
      expect(subscriber.req.open).toHaveBeenCalledTimes(1);
      expect(subscriber.req.open).toHaveBeenCalledWith(
        config.method,
        `${environment}/${config.url}`,
        true
      );
      expect(subscriber.req.setRequestHeader).toHaveBeenCalled();
      expect(subscriber.req.setRequestHeader).toHaveBeenCalledTimes(2);
      expect(subscriber.req.setRequestHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/json"
      );
      expect(subscriber.req.setRequestHeader).toHaveBeenCalledWith(
        "x-auth-token",
        tokenAccess
      );
    });

    test("setRequestHeader was called 1 time, when accessToken === undefined", () => {
      const subscriber = new AjaxSubscriber({
        config,
        body,
      });

      expect(subscriber.req.setRequestHeader).toHaveBeenCalled();
      expect(subscriber.req.setRequestHeader).toHaveBeenCalledTimes(1);
      expect(subscriber.req.setRequestHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/json"
      );
      expect(subscriber.req.setRequestHeader).not.toHaveBeenCalledWith(
        "x-auth-token",
        tokenAccess
      );
    });
  });
});
