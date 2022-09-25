"use strict";
exports.__esModule = true;
exports.MockLogger = exports.sleep = exports.convertNumber = void 0;
/* eslint-disable import/prefer-default-export */
var convertNumber = function (str) {
    var expanded = str.replace(/,/g, '');
    if (expanded.endsWith('K')) {
        return Math.round(+expanded.slice(0, -1) * 1000);
    }
    if (expanded.endsWith('M')) {
        return Math.round(+expanded.slice(0, -1) * 1000000);
    }
    return Math.round(+expanded);
};
exports.convertNumber = convertNumber;
var sleep = function (ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
};
exports.sleep = sleep;
var MockLogger = /** @class */ (function () {
    function MockLogger() {
    }
    MockLogger.prototype.error = function () {
        return undefined;
    };
    MockLogger.prototype.info = function () {
        return undefined;
    };
    MockLogger.prototype.debug = function () {
        return undefined;
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    MockLogger.prototype.close = function () { };
    MockLogger.prototype.getRootDirectory = function () {
        return '/tmp';
    };
    return MockLogger;
}());
exports.MockLogger = MockLogger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGlEQUFpRDtBQUMxQyxJQUFNLGFBQWEsR0FBRyxVQUFDLEdBQVc7SUFDdkMsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFdkMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzFCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7S0FDbEQ7SUFFRCxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDMUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztLQUNyRDtJQUVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLENBQUMsQ0FBQztBQVpXLFFBQUEsYUFBYSxpQkFZeEI7QUFFSyxJQUFNLEtBQUssR0FBRyxVQUFDLEVBQVU7SUFDOUIsT0FBQSxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sSUFBTyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQXRELENBQXNELENBQUM7QUFENUMsUUFBQSxLQUFLLFNBQ3VDO0FBRXpEO0lBQUE7SUErQkEsQ0FBQztJQTFCQywwQkFBSyxHQUFMO1FBQ0UsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQU1ELHlCQUFJLEdBQUo7UUFDRSxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBTUQsMEJBQUssR0FBTDtRQUNFLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxnRUFBZ0U7SUFDaEUsMEJBQUssR0FBTCxjQUFlLENBQUM7SUFFaEIscUNBQWdCLEdBQWhCO1FBQ0UsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQS9CRCxJQStCQztBQS9CWSxnQ0FBVSJ9