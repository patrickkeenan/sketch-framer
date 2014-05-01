window.FramerStates = window.FramerStates || {};
Framer.config.animationCurve = 'linear';
Framer.config.animationDelay = 0;
Framer.config.animationTime = 300;

var FramerCurves = (FramerCurves) ? FramerCurves : {
  linear: 'spring(400,30,200)',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  spring: 'spring(400,30,200)'
};

View.prototype.ani = function (props, time, delay, curve) {
  if (!curve) curve = Framer.config.animationCurve;
  console.log(time, delay, curve, props, (!time));
  if (!time) time = Framer.config.animationTime;
  var that = this;
  if (delay > 0) {
    var a = new Animation({
      view: this,
      time: time,
      curve: curve,
      properties: props
    });
    utils.delay(Framer.config.animationDelay, function () {
      a.start()
    })
  } else {
    var a = this.animate({
      time: time,
      curve: curve,
      properties: props
    });
  }
  return a;
};

for (var i in FramerCurves) View.prototype[i] = function (props, time, delay) {
    return this.ani(props, time, delay, FramerCurves[i])
};

Framer.jumpToState = function(stateName){
    if(!stateName){
      for (var state in FramerStates) {
        stateName = state;
        break;
      }    
    }
    for (var layer in FramerStates[stateName]) {
      console.log('setting up',layer,stateName,FramerStates[stateName][layer])
      if(PSD[layer]){
        PSD[layer].frame = FramerStates[stateName][layer].frame
        PSD[layer].opacity = FramerStates[stateName][layer].frame.opacity
        PSD[layer].rotationZ = FramerStates[stateName][layer].frame.rotationZ
      }
    }
}

Framer.setUpStateTransitions = function () {
  var stateTransitions = [];
  var makeStateShift = function (state, name) {;
    return function () {
      for (var i in state) {
        var time = state[i].time || Framer.config.animationTime;
        var delay = state[i].delay || Framer.config.animationDelay;
        var curve = state[i].curve || Framer.config.animationCurve;
        if(PSD[i]) PSD[i].ani(state[i].frame, time, delay, curve)
      }
    }
  };
  for (var i in FramerStates) {
    var f = makeStateShift(FramerStates[i], i);
    stateTransitions.push(f)
  };
  return stateTransitions;
};

//Framer.animateToNextState = utils.cycle(setUpStateTransitions());
//FramerStateShift()();