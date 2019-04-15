var contentMS = require("../public/bundle.js");

describe("Convert milliseconds at minutes, hours and days", function() {
  it("should be returned 1 day", function() {
    expect(convertMS(86400000)).toEqual("2 day");
  });

});
