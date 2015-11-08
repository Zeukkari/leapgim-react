var GestureController, config,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

config = window.config;

GestureController = (function() {
  function GestureController() {
    this.parseGestures = bind(this.parseGestures, this);
    this.getActiveSigns = bind(this.getActiveSigns, this);
    this.assertSign = bind(this.assertSign, this);
    this.updateRecipeRecord = bind(this.updateRecipeRecord, this);
    this.updateSignRecord = bind(this.updateSignRecord, this);
    this.wipeRecord = bind(this.wipeRecord, this);
    this.resetSignRecord = bind(this.resetSignRecord, this);
    this.directionCalculator = bind(this.directionCalculator, this);
    var recipe, recipeName, ref, ref1, sign, signName, state;
    this.startTime = null;
    state = {};
    state.lastTimestamp = 0;
    state.currentTimestamp = 0;
    state.signRecord = {};
    state.recipeRecord = {};
    state.activeSigns = [];
    state.lastActiveSigns = [];
    state.timeout = window.config.timeout;
    ref = window.config.signs;
    for (signName in ref) {
      sign = ref[signName];
      sign.name = signName;
      sign.timeVisible = 0;
      sign.status = 'inactive';
      state.signRecord[signName] = sign;
    }
    ref1 = window.config.recipes;
    for (recipeName in ref1) {
      recipe = ref1[recipeName];
      recipe.name = recipeName;
      recipe.timeVisible = 0;
      recipe.signIndex = 0;
      state.recipeRecord[recipeName] = recipe;
    }
    this.state = state;
    this.currentFrame = {};
    window.gestureController = this;
  }

  GestureController.prototype.directionCalculator = function(x, y, z) {
    var max, result, status;
    max = Math.max(x, y, z);
    if (max === x) {
      if (x > 0) {
        result = 'left';
      }
      if (x < 0) {
        result = 'right';
      }
    }
    if (max === y) {
      if (y > 0) {
        result = 'down';
      }
      if (y < 0) {
        status = 'up';
      }
    }
    if (max === z) {
      if (z > 0) {
        status = 'forward';
      }
      if (z < 0) {
        status = 'backward';
      }
    }
    return status;
  };

  GestureController.prototype.resetSignRecord = function(sign) {
    var data;
    data = this.state.signRecord[sign];
    data.status = 'inactive';
    return data.timeVisible = 0;
  };

  GestureController.prototype.wipeRecord = function() {
    var manager, recipe, results, sign;
    manager = window.actionHero;
    for (sign in this.state.signRecord) {
      this.resetSignRecord(sign);
    }
    results = [];
    for (recipe in this.state.recipeRecord) {
      this.state.recipeRecord[recipe].signIndex = 0;
      results.push(manager.tearDownRecipe(recipe));
    }
    return results;
  };

  GestureController.prototype.updateSignRecord = function(sign) {
    var data, oldStatus;
    data = this.state.signRecord[sign];
    oldStatus = data.status;
    if (this.assertSign(data, this.state.currentFrame)) {
      if (oldStatus !== 'inactive') {
        data.timeVisible += this.state.currentTimestamp - this.state.lastTimestamp;
      }
      if (!data.minTime || data.minTime < data.timeVisible) {
        return data.status = 'active';
      } else {
        return data.status = 'pending';
      }
    } else {
      return this.resetSignRecord(sign);
    }
  };

  GestureController.prototype.updateRecipeRecord = function(recipe) {
    var data, manager, oldIndex, secondaryIndex, secondarySign, sign;
    data = this.state.recipeRecord[recipe];
    oldIndex = data.signIndex;
    sign = data.signs[oldIndex];
    if (indexOf.call(this.state.activeSigns, sign) >= 0) {
      data.signIndex += 1;
    } else if (oldIndex > 0) {
      secondaryIndex = oldIndex - 1;
      secondarySign = data.signs[secondaryIndex];
      if (indexOf.call(this.state.activeSigns, secondarySign) >= 0) {
        data.signIndex = oldIndex;
      } else {
        data.signIndex = 0;
      }
    } else {
      data.signIndex = 0;
    }
    manager = window.actionHero;
    if (data.signIndex === data.signs.length) {
      return manager.activateRecipe(data.name);
    } else {
      manager.tearDownRecipe(data.name);
      return manager.tearDownRecipe(data.name);
    }
  };

  GestureController.prototype.assertSign = function(sign, frameData) {
    var extendedFingers, gesture, gestureModel, grabStrength, handModel, i, j, len, len1, pinchStrength, pincher, pos, ref, ref1, result, sign_ok, spos, swipe, x, y, z;
    sign_ok = true;
    ref = frameData.hands;
    for (i = 0, len = ref.length; i < len; i++) {
      handModel = ref[i];
      if (sign.grab) {
        grabStrength = handModel.grabStrength;
        if (sign.grab.min) {
          if (grabStrength < sign.grab.min) {
            sign_ok = false;
          }
        }
        if (sign.grab.max) {
          if (grabStrength > sign.grab.max) {
            sign_ok = false;
          }
        }
      }
      if (sign.pinch) {
        pinchStrength = handModel.pinchStrength;
        pincher = handModel.pinchingFinger;
        if (sign.pinch.pincher) {
          if (sign.pinch.pincher !== pincher) {
            sign_ok = false;
          }
        }
        if (sign.pinch.min) {
          if (pinchStrength < sign.pinch.min) {
            sign_ok = false;
          }
        }
        if (sign.pinch.max) {
          if (pinchStrength > sign.pinch.max) {
            sign_ok = false;
          }
        }
      }
      if (sign.extendedFingers) {
        extendedFingers = sign.extendedFingers;
        if ((extendedFingers.indexFinger != null)) {
          if (extendedFingers.indexFinger !== handModel.extendedFingers.indexFinger) {
            sign_ok = false;
          }
        }
        if ((extendedFingers.middleFinger != null)) {
          if (extendedFingers.middleFinger !== handModel.extendedFingers.middleFinger) {
            sign_ok = false;
          }
        }
        if ((extendedFingers.ringFinger != null)) {
          if (extendedFingers.ringFinger !== handModel.extendedFingers.ringFinger) {
            sign_ok = false;
          }
        }
        if ((extendedFingers.pinky != null)) {
          if (extendedFingers.pinky !== handModel.extendedFingers.pinky) {
            sign_ok = false;
          }
        }
        if ((extendedFingers.thumb != null)) {
          if (extendedFingers.thumb !== handModel.extendedFingers.thumb) {
            sign_ok = false;
          }
        }
      }
      if (sign.hover) {
        if (sign.hover.left != null) {
          if (hand.type === !'left' && sign.hover.left === true) {
            sign_ok = false;
          }
        }
        if (sign.hover.minTime != null) {
          if (sign.hover.minTime > hand.timeVisible) {
            sign_ok = false;
          }
        }
      }
    }
    ref1 = frameData.gestures;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      gestureModel = ref1[j];
      gesture = gestureModel;
      if (sign.minDuration != null) {
        if (sign.minDuration > gesture.duration) {
          sign_ok = false;
        }
      }
      if (sign.maxDuration != null) {
        if (sign.maxDuration < gesture.duration) {
          sign_ok = false;
        }
      }
      if (sign.circle) {
        if (sign.circle.minCircles != null) {
          if (sign.circle.minCircles > gesture.progress) {
            sign_ok = false;
          }
        }
        if (sign.circle.maxCircles != null) {
          if (sign.circle.maxCircles < gesture.progress) {
            sign_ok = false;
          }
        }
        if (sign.circle.minRadius != null) {
          if (sign.circle.minRadius > gesture.radius) {
            sign_ok = false;
          }
        }
        if (sign.circle.maxRadius != null) {
          if (sign.circle.maxRadius < gesture.radius) {
            sign_ok = false;
          }
        }
        if (sign.circle.clockwise === true) {
          if (gesture.direction < 0) {
            sign_ok = false;
          }
        }
        if (sign.circle.clockwise === false) {
          if (gesture.direction > 0) {
            sign_ok = false;
          }
        }
        if (gesture.state === 'stop') {
          sign_ok = false;
        }
      }
      if (sign.swipe) {
        swipe = sign.swipe;
        pos = gesture.position;
        spos = gesture.startPosition;
        if (swipe.minDistance != null) {
          if (gesture.position > gesture.startPosition) {
            sign_ok = false;
          }
        }
        if (swipe.maxDistance != null) {
          if (gesture.position < gesture.startPosition) {
            sign_ok = false;
          }
        }
        if (swipe.minSpeed != null) {
          if (swipe.speed < gesture.speed) {
            sign_ok = false;
          }
        }
        if (swipe.maxSpeed != null) {
          if (swipe.speed > gesture.speed) {
            sign_ok = false;
          }
        }
        if (swipe.direction != null) {
          x = Math.abs(spos[0] - pos[0]);
          y = Math.abs(spos[1] - pos[0]);
          z = Math.abs(spos[1] - pos[0]);
          result = this.directionCalculator(x, y, z);
          if (result !== swipe.direction) {
            sign_ok = false;
          }
        }
      }
    }
    return sign_ok;
  };

  GestureController.prototype.getActiveSigns = function() {
    var activeSigns, data, options, ref, ref1, ref2, sign;
    activeSigns = [];
    ref = this.state.signRecord;
    for (sign in ref) {
      data = ref[sign];
      if (data.status === 'active') {
        activeSigns.push(sign);
        if (((ref1 = data.feedback) != null ? ref1.audio : void 0)) {
          if ((indexOf.call(this.state.lastActiveSigns, sign) < 0)) {
            window.feedback.audioNotification(data.feedback.audio);
          }
        }
        if ((((ref2 = data.feedback) != null ? ref2.visual : void 0) != null)) {
          options = data.feedback.visual;
          window.feedback.visualNotification(options.id, options.msg);
        }
      }
    }
    return activeSigns;
  };

  GestureController.prototype.parseGestures = function(model) {
    var callback, confidence, delay, elapsedMS, elapsedSeconds, manager, recipe, sign, visible;
    clearTimeout(this.timerID);
    this.state.lastActiveSigns = this.state.activeSigns;
    manager = window.actionHero;
    manager.position = model.hands[0].position;
    this.state.lastTimestamp = this.state.currentTimestamp;
    this.state.currentTimestamp = model.timestamp;
    this.state.currentFrame = model;
    if (!this.startTime) {
      this.startTime = model.timestamp;
    } else {
      this.currentTotalTime = model.timestamp;
    }
    elapsedMS = this.currentTotalTime - this.startTime;
    elapsedSeconds = elapsedMS / 1000000;
    window.feedback.time(elapsedSeconds);
    visible = model.hands[0].visible;
    window.feedback.handVisible(visible);
    confidence = model.hands[0].confidence;
    window.feedback.confidenceMeter(confidence);
    for (sign in this.state.signRecord) {
      this.updateSignRecord(sign);
    }
    this.state.activeSigns = this.getActiveSigns();
    for (recipe in this.state.recipeRecord) {
      this.updateRecipeRecord(recipe);
    }
    callback = (function(_this) {
      return function() {
        return _this.wipeRecord();
      };
    })(this);
    delay = window.config.timeout;
    return this.timerID = setTimeout(callback, delay);
  };

  return GestureController;

})();

window.GestureController = GestureController;

//# sourceMappingURL=app/maps/GestureController.js.map
