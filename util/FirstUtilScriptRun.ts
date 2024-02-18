// This script is meant for running when the application first starts
export default function setup() {
  Array.prototype.first = function () {
    return this[0] || null;
  };

  BigInt.prototype.toJSON = function () {
    return Number(this);
  };

  Date.prototype.toJSON = function () {
    return this.toISOString();
  };
}
