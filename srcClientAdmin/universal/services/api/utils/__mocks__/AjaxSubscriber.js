const AjaxSubscriber = jest.fn().mockImplementation(({ observer }) => {
  observer.next({ responce: "responce" });
  observer.complete();
});

export default AjaxSubscriber;
