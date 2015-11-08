var ActionController, config, execSh, feedback,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

execSh = nativeRequire('exec-sh');

window.robot = nativeRequire('robotjs');

feedback = window.feedback;

config = window.config;

ActionController = (function() {
  function ActionController() {
    this.getActiveRecipes = bind(this.getActiveRecipes, this);
    this.tearDownRecipe = bind(this.tearDownRecipe, this);
    this.activateRecipe = bind(this.activateRecipe, this);
    this.executeAction = bind(this.executeAction, this);
    this.execSh = bind(this.execSh, this);
    this.delayMouse = bind(this.delayMouse, this);
    this.scrollMouse = bind(this.scrollMouse, this);
    this.keyboard = bind(this.keyboard, this);
    this.mouseButton = bind(this.mouseButton, this);
    this.mouseMove = bind(this.mouseMove, this);
    this.toggleMouseFreeze = bind(this.toggleMouseFreeze, this);
    this.unfreezeMouse = bind(this.unfreezeMouse, this);
    this.freezeMouse = bind(this.freezeMouse, this);
    var name, recipe, ref;
    this.actions = window.config.actions;
    this.recipes = window.config.recipes;
    this.robot = window.robot;
    this.mouseState = 'free';
    this.position = {
      x: 0,
      y: 0
    };
    this.freezePosition = {
      x: 0,
      y: 0
    };
    this.unfreezePosition = {
      x: 0,
      y: 0
    };
    this.keyboardModel = {
      test: false
    };
    this.recipeState = {};
    ref = this.recipes;
    for (name in ref) {
      recipe = ref[name];
      this.recipeState[name] = {
        status: 'inactive',
        timerID: null
      };
      if (recipe.tearDownDelay) {
        this.recipeState[name].tearDownDelay = recipe.tearDownDelay;
      }
    }
  }

  ActionController.prototype.freezeMouse = function(handPosition) {
    this.freezePosition = this.robot.getMousePos();
    return this.mouseState = 'frozen';
  };

  ActionController.prototype.unfreezeMouse = function(handPosition) {
    var normalizedHandPosition, screenSize;
    screenSize = this.robot.getScreenSize();
    normalizedHandPosition = {
      x: handPosition.x * screenSize.width,
      y: handPosition.y * screenSize.height
    };
    this.unfreezePosition = normalizedHandPosition;
    console.log("Unfreeze mouse", this.unfreezePosition);
    return this.mouseState = 'free';
  };

  ActionController.prototype.toggleMouseFreeze = function(handPosition) {
    if (this.mouseState === 'frozen') {
      return this.unfreezeMouse(handPosition);
    } else if (this.mouseState === 'free') {
      return this.freezeMouse(handPosition);
    }
  };

  ActionController.prototype.mouseMove = function(handPosition) {
    var moveTo, normalizedHandPosition, offsetMapping, screenSize;
    if (this.mouseState === 'free') {
      screenSize = this.robot.getScreenSize();
      normalizedHandPosition = {
        x: handPosition.x * screenSize.width,
        y: handPosition.y * screenSize.height
      };
      offsetMapping = {
        x: this.freezePosition.x - this.unfreezePosition.x,
        y: this.freezePosition.y - this.unfreezePosition.y
      };
      moveTo = {
        x: normalizedHandPosition.x + offsetMapping.x,
        y: normalizedHandPosition.y + offsetMapping.y
      };
      return this.robot.moveMouse(moveTo.x, moveTo.y);
    }
  };

  ActionController.prototype.mouseButton = function(buttonAction, button) {
    feedback = window.feedback;
    if (buttonAction === 'up') {
      return this.robot.mouseToggle(buttonAction, button);
    } else if (buttonAction === 'down') {
      return this.robot.mouseToggle(buttonAction, button);
    } else if (buttonAction === 'click') {
      return this.robot.mouseClick(button, false);
    } else if (buttonAction === 'doubleClick') {
      return this.robot.mouseClick(button, true);
    }
  };

  ActionController.prototype.keyboard = function(action, button) {
    feedback = window.feedback;
    if (action === 'up') {
      this.robot.keyToggle(button, action);
    } else if (action === 'down') {
      this.robot.keyToggle(button, action);
    } else if (action === 'tap') {
      this.robot.keyTap(button);
    }
  };

  ActionController.prototype.scrollMouse = function(direction, magnitude) {
    if (direction === 'up' || direction === 'down') {
      return this.robot.scrollMouse(magnitude, direction);
    } else {
      return console.log('This aint 3d, man!');
    }
  };

  ActionController.prototype.delayMouse = function(delay) {
    return this.robot.delayMouse(delay);
  };

  ActionController.prototype.execSh = function(cmd, options, callback) {
    return execSh(cmd, options, callback);
  };

  ActionController.prototype.loadProfile = function(profile) {
    console.log("Load profile " + profile);
    return window.loadProfile(profile);
  };

  ActionController.prototype.executeAction = function(action) {
    var cmd, i, len, options, ref, ref1, ref2, screenSize;
    cmd = this.actions[action];
    screenSize = this.robot.getScreenSize();
    if ((cmd.feedback != null)) {
      if ((cmd.feedback.audio != null)) {
        window.feedback.audioNotification(cmd.feedback.audio);
      }
      if ((cmd.feedback.visual != null)) {
        options = cmd.feedback.visual;
        window.feedback.visualNotification(options.id, options.msg);
      }
    }
    if (cmd.type === 'mouse') {
      if (cmd.action === 'freeze') {
        this.freezeMouse(this.position);
      }
      if (cmd.action === 'unfreeze') {
        this.unfreezeMouse(this.position);
      }
      if (cmd.action === 'toggleFreeze') {
        this.toggleMouseFreeze(this.position);
      }
      if (((ref = cmd.action) === 'up' || ref === 'down' || ref === 'click' || ref === 'doubleClick')) {
        this.mouseButton(cmd.action, cmd.target);
      }
      if (cmd.action === 'move') {
        this.mouseMove(this.position);
      }
      if (cmd.action === 'scroll') {
        this.scrollMouse(cmd.direction, cmd.magnitude);
      }
      if (cmd.action === 'delay') {
        this.delayMouse(cmd.delay);
      }
    }
    if (cmd.type === 'keyboard') {
      if (((ref1 = cmd.action) === 'up' || ref1 === 'down' || ref1 === 'tap')) {
        this.keyboard(cmd.action, cmd.button);
      }
    }
    if (cmd.type === 'compound') {
      ref2 = cmd.actions;
      for (i = 0, len = ref2.length; i < len; i++) {
        action = ref2[i];
        this.executeAction(action);
      }
    }
    if (cmd.type === 'exec') {
      this.execSh(cmd.cmd, cmd.options, function(err) {
        if (err) {
          return console.log("Exec error", err);
        }
      });
    }
    if (cmd.type === 'profile') {
      if (cmd.action === 'load') {
        return this.loadProfile(cmd.target);
      }
    }
  };

  ActionController.prototype.activateRecipe = function(recipeName) {
    var actionName, callback, chargeDelay, recipe;
    recipe = this.recipes[recipeName];
    actionName = recipe.action;
    if (!this.recipeState[recipeName].timerID) {
      if (recipe.continuous) {
        if (this.recipeState[recipeName].status !== 'sleeping') {
          if (recipe.chargeDelay) {
            chargeDelay = recipe.chargeDelay;
            callback = (function(_this) {
              return function() {
                _this.recipeState[recipeName].status = 'inactive';
                return _this.recipeState[recipeName].timerID = null;
              };
            })(this);
            this.recipeState[recipeName].status = 'sleeping';
            this.recipeState[recipeName].timerID = setTimeout(callback, chargeDelay);
          }
          this.executeAction(actionName);
          return true;
        } else {
          return false;
        }
      } else if (this.recipeState[recipeName].status === 'inactive') {
        if (!this.recipeState[recipeName].timerID) {
          this.recipeState[recipeName].status = 'active';
          this.executeAction(actionName);
          return true;
        }
      }
    }
    return false;
  };

  ActionController.prototype.tearDownRecipe = function(recipeName) {
    var actionName, callback, recipe;
    recipe = this.recipes[recipeName];
    if (!recipe) {
      return;
    }
    actionName = recipe.tearDown;
    if (!actionName) {
      this.recipeState[recipeName].status = 'inactive';
      this.recipeState[recipeName].timerID = null;
      return false;
    }
    if (this.recipeState[recipeName].status === 'active') {
      if (!this.recipeState[recipeName].timerID) {
        if (this.recipeState[recipeName].tearDownDelay) {
          callback = (function(_this) {
            return function() {
              console.log("Tear down timed recipe " + recipeName);
              _this.executeAction(actionName);
              _this.recipeState[recipeName].status = 'inactive';
              return _this.recipeState[recipeName].timerID = null;
            };
          })(this);
          this.recipeState[recipeName].timerID = setTimeout(callback, this.recipeState[recipeName].tearDownDelay);
          return true;
        } else {
          console.log("Tear down non-timed recipe " + recipeName);
          this.recipeState[recipeName].status = 'inactive';
          this.recipeState[recipeName].timerID = null;
          this.executeAction(actionName);
          return true;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  ActionController.prototype.getActiveRecipes = function(filter) {
    var recipeList, recipeName, recipeState, recipeStatus, ref;
    recipeList = [];
    ref = this.recipeState;
    for (recipeName in ref) {
      recipeState = ref[recipeName];
      recipeStatus = recipeState.status;
      if (recipeState === 'active') {
        if (typeof filter !== 'function' || filter(recipeName)) {
          recipeList.push(recipeName);
        }
      }
    }
    return recipeList;
  };

  return ActionController;

})();

window.ActionController = ActionController;

//# sourceMappingURL=maps/ActionController.js.map
