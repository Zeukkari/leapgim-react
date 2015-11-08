var YAML, defaultProfile, fs, robot, zmq;

robot = nativeRequire('robotjs');

zmq = nativeRequire('zmq');

YAML = nativeRequire('yamljs');

fs = nativeRequire('fs');

defaultProfile = 'app/etc/config.yml';

window.loadProfile = function(profile) {
  var config, slowConnect, socket;
  console.log("Load profile " + profile);
  if (window.socket) {
    console.log("Close socket");
    window.socket.close();
  }
  window.feedback = void 0;
  window.actionHero = void 0;
  window.translator = void 0;
  config = YAML.parse(fs.readFileSync(profile, 'utf8'));
  window.config = config;
  console.log("loaded config: ", config);
  socket = zmq.socket('sub');
  socket.on('connect', function(fd, ep) {
    console.log('connect, endpoint:', ep);
    socket.subscribe('update');
    socket.on('message', function(topic, message) {
      var e, error, model, str_message, str_topic;
      try {
        str_topic = topic.toString();
        str_message = message.toString();
        if (topic.toString() === 'update') {
          model = JSON.parse(str_message);
          translator.parseGestures(model);
        }
      } catch (error) {
        e = error;
        console.log("error", e);
      }
    });
  });
  socket.on('connect_delay', function(fd, ep) {
    console.log('connect_delay, endpoint:', ep);
  });
  socket.on('connect_retry', function(fd, ep) {
    console.log('connect_retry, endpoint:', ep);
  });
  socket.on('listen', function(fd, ep) {
    console.log('listen, endpoint:', ep);
  });
  socket.on('bind_error', function(fd, ep) {
    console.log('bind_error, endpoint:', ep);
  });
  socket.on('accept', function(fd, ep) {
    console.log('accept, endpoint:', ep);
  });
  socket.on('accept_error', function(fd, ep) {
    console.log('accept_error, endpoint:', ep);
  });
  socket.on('close', function(fd, ep) {
    console.log('close, endpoint:', ep);
  });
  socket.on('close_error', function(fd, ep) {
    console.log('close_error, endpoint:', ep);
  });
  socket.on('disconnect', function(fd, ep) {
    console.log('disconnect, endpoint:', ep);
  });
  console.log('Start monitoring...');
  socket.monitor(500, 0);
  window.socket = socket;
  window.feedback = new window.FeedbackController;
  window.actionHero = new window.ActionController;
  window.translator = new window.GestureController;
  console.log("Connect to " + config.socket);
  slowConnect = function() {
    return window.socket.connect(config.socket);
  };
  return setTimeout(slowConnect, 1000);
};

window.loadProfile(defaultProfile);

//# sourceMappingURL=maps/App.js.map
