var FeedbackController, config,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

config = window.config;

FeedbackController = (function() {
  function FeedbackController() {
    this.time = bind(this.time, this);
    console.log("Feedback control ready");
  }

  FeedbackController.prototype.audioNotification = function(clip) {
    var audio;
    audio = new Audio(clip);
    return audio.play();
  };

  FeedbackController.prototype.visualNotification = function(viewID, msg) {
    window.viewModel[viewID] = msg;
    return window.main.setState(window.viewModel);
  };

  FeedbackController.prototype.time = function(elapsed) {
    return this.visualNotification('timer', elapsed);
  };

  FeedbackController.prototype.handVisible = function(visible) {
    return this.visualNotification('handVisible', visible);
  };

  FeedbackController.prototype.confidenceMeter = function(confidence) {
    var adjustedConfidence;
    adjustedConfidence = confidence * 100;
    return this.visualNotification('meter', adjustedConfidence);
  };

  return FeedbackController;

})();

window.FeedbackController = FeedbackController;

//# sourceMappingURL=app/maps/FeedbackController.js.map
