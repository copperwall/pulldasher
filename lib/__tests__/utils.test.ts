import * as utils from "../utils";

describe("Utils", () => {
  describe("toUnixTime", () => {
    it("should return a timestamp from a given Date", () => {
      const expected = Date.now();
      const date = new Date(expected * 1000);

      expect(utils.toUnixTime(date)).toBe(expected);
    });

    it("should return the date argument if it is undefined", () => {
      expect(utils.toUnixTime(undefined)).toBeUndefined();
    });

    it("should return the date argument if it is a non-Date object", () => {
      const dateLike = {
        getTime() {
          return 1234;
        }
      };

      expect(utils.toUnixTime(dateLike)).toBe(dateLike);
    });

    it("should return the date argument if it is a timestamp", () => {
      const timestamp = Date.now();

      expect(utils.toUnixTime(timestamp)).toBe(timestamp);
    });
  });

  describe("fromUnixTime", () => {
    it("should return a Date from a given timestamp", () => {
      const timestamp = Date.now();
      const expected = new Date(timestamp * 1000);

      expect(utils.fromUnixTime(timestamp)).toEqual(expected);
    });

    it("should return the timestamp argument if it is undefined", () => {
      expect(utils.fromUnixTime(undefined)).toBeUndefined();
    });

    it("should return the timestamp argument if it is not a timestamp", () => {
      const date = new Date();

      expect(utils.fromUnixTime(date)).toEqual(date);
    });
  });

  describe("fromDateString", () => {
    it("should return a Date if str is a Date", () => {
      const date = new Date();

      expect(utils.fromDateString(date)).toEqual(date);
    });

    it("should return a Date from the given date string", () => {
      const dateString = "2018-10-15";
      const expected = new Date(dateString);

      expect(utils.fromDateString(dateString)).toEqual(expected);
    });

    it("should return an Invalid Date if the string is not a date format", () => {
      const dateString = "bad";

      const date = utils.fromDateString(dateString);
      expect(date.toString()).toBe("Invalid Date");
    });

    it("should return null if str is null", () => {
      expect(utils.fromDateString(null)).toBeNull();
    });

    it("should return null if str is undefined", () => {
      expect(utils.fromDateString(undefined)).toBeNull();
    });
  });
});
