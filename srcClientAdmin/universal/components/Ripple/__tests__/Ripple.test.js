import Ripple from "../Ripple";

describe("Ripple", () => {
  describe("calculateRipplePosition", () => {
    test("Return position x and y", () => {
      const ripple = new Ripple();
      const event = {
        clientX: 11,
        clientY: 21,
      };
      const size = 6;
      const parent = {
        getBoundingClientRect: jest.fn(() => ({
          left: 4,
          top: 5,
        })),
      };

      const coordinates = ripple.calculateRipplePosition({
        event,
        parent,
        size,
      });
      expect(coordinates).toEqual({
        x: 4,
        y: 13,
      });

      expect(parent.getBoundingClientRect).toHaveBeenCalledTimes(1);
    });
  });

  describe("calculateRippleSize", () => {
    test("Return offsetWidth when offsetWidth > offsetHeight", () => {
      const parent = {
        offsetWidth: 123,
        offsetHeight: 21,
      };

      const ripple = new Ripple();
      expect(ripple.calculateRippleSize({ parent })).toBe(parent.offsetWidth);
    });

    test("Return offsetHeight when offsetHeight > offsetWidth", () => {
      const parent = {
        offsetWidth: 21,
        offsetHeight: 123,
      };

      const ripple = new Ripple();
      expect(ripple.calculateRippleSize({ parent })).toBe(parent.offsetHeight);
    });
  });

  describe("doTheRipple", () => {
    test("Call this.renderRipple when this.rippleContainer isn't null", () => {
      const event = {
        clientX: 11,
        clientY: 22,
      };
      const rippleSize = 23;
      const rippleRef = "rippleRef";
      const rippleContainer = "rippleContainer";
      const ripplePosition = "ripplePosition";

      const ripple = new Ripple();

      ripple.ripple = rippleRef;
      ripple.rippleContainer = rippleContainer;
      ripple.calculateRipplePosition = jest.fn(() => ripplePosition);
      ripple.calculateRippleSize = jest.fn(() => rippleSize);
      ripple.renderRipple = jest.fn();

      ripple.doTheRipple(event);

      expect(ripple.calculateRippleSize).toHaveBeenCalledTimes(1);
      expect(ripple.calculateRippleSize).toHaveBeenCalledWith({
        parent: rippleContainer,
      });

      expect(ripple.calculateRipplePosition).toHaveBeenCalledTimes(1);
      expect(ripple.calculateRipplePosition).toHaveBeenCalledWith({
        event,
        parent: rippleContainer,
        size: rippleSize,
      });

      expect(ripple.renderRipple).toHaveBeenCalledTimes(1);
      expect(ripple.renderRipple).toHaveBeenCalledWith({
        toNode: rippleRef,
        position: ripplePosition,
        size: rippleSize,
      });
    });

    test("Don't call this.renderRipple when this.rippleContainer is null", () => {
      const event = {
        clientX: 11,
        clientY: 22,
      };

      const ripple = new Ripple();

      ripple.rippleContainer = null;
      ripple.calculateRipplePosition = jest.fn();
      ripple.calculateRippleSize = jest.fn();
      ripple.renderRipple = jest.fn();

      ripple.doTheRipple(event);

      expect(ripple.calculateRippleSize).toHaveBeenCalledTimes(0);
      expect(ripple.calculateRipplePosition).toHaveBeenCalledTimes(0);
      expect(ripple.renderRipple).toHaveBeenCalledTimes(0);
    });
  });
});
