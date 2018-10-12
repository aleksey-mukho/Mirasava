// @flow
export const NOTIFICATION_CLOSE = 'notification/close';

export const closeNotification = (id: string) => ({
  type: NOTIFICATION_CLOSE,
  id,
});
