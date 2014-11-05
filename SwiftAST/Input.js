/**
 * Created by krzysztofkaczor on 11/2/14.
 */
(function () {
  //for now very simple implementation
  //handling multiple files as input should be done here
  var Input = function (input) {
    this.contents = input;
    this.processInput();
  }

  //make platform independence
  Input.prototype.processInput = function () {
    this.contents = this.contents.replace(/\r/g, '');
  };

  module.exports = Input;
})();