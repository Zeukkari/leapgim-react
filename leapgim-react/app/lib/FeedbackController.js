var FeedbackController, config;

config = window.config;

FeedbackController = (function() {
  function FeedbackController() {
    console.log("Feedback control ready");
  }

  FeedbackController.prototype.audioNotification = function(clip) {
    var audio;
    audio = new Audio(clip);
    return audio.play();
  };

  FeedbackController.prototype.visualNotification = function(viewID, msg) {
    var ref;
    if ((((ref = window.viewModel) != null ? ref.viewID : void 0) != null)) {
      console.log("View model: ", window.viewModel);
      console.log("View ID: ", viewID);
      window.viewModel[viewID] = msg;
      return window.main.setState(window.viewModel);
    }
  };

  FeedbackController.prototype.time = function(elapsed) {
    return document.getElementById('timer').innerHTML = elapsed;
  };

  FeedbackController.prototype.handVisible = function(visible) {
    return document.getElementById('handVisible').innerHTML = visible;
  };

  FeedbackController.prototype.confidenceMeter = function(confidence) {
    var adjustedConfidence, meter;
    adjustedConfidence = confidence * 100;
    meter = document.getElementById('meter');
    return meter.value = adjustedConfidence;
  };

  return FeedbackController;

})();

window.FeedbackController = FeedbackController;

//# sourceMappingURL=app/maps/FeedbackController.js.map
