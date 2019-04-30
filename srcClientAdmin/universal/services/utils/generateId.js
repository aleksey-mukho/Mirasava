// @flow
const s4 = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

const guid = function() {
  return (
    `${this.s4()}${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}` +
    `${this.s4()}${this.s4()}`
  );
};

export { s4, guid };
