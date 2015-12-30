
(function () {
  
  /*
  circle = {
    graphics: // The PIXI.Graphics object of the circle
    x: // x count
    y: // y count
    left, right, upleft, upright, downleft, downright
    state: // "free" "blocked" "cat"
  }
  */
  
  var WIDTH = 800, HEIGHT = 600, R = 30, D = 2 * R, SQRT3 = Math.sqrt(3);
  
  var renderOptions = {
    antialias: true
  };
  
  var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, renderOptions)
    , stage = new PIXI.Container()
    ;
  
  document.getElementById("stage").appendChild(renderer.view);
  
  var circles = [];
  
  (function () {
    
    var ROW = HEIGHT / (SQRT3 * R) - 2 / SQRT3
      , COL = WIDTH / D - 1
      ;
    
    function y(i) {
      return R + R * i * SQRT3;
    }
    
    function x(i) {
      return 2 * R * (i + 1);
    }
    
    for (var i = 0; i < ROW; i++) {
      var cs = [];
      for (var j = 0; j < COL; j++) {
        var circle = new PIXI.Graphics();
        circle.beginFill(0x9966FF);
        circle.drawCircle(0, 0, R * 0.85);
        circle.endFill();
        circle.x = x(j) + (i % 2 - 1) * R;
        circle.y = y(i);
        circle.mousedown = function (data) {
          this.clear();
          this.beginFill(0xFFFFFF);
          this.drawCircle(0, 0, R * 0.85);
          this.endFill();
          renderer.render(stage);
        };
        circle.interactive = true;
        stage.addChild(circle);
        cs.push(circle);
      }
      circles[i] = cs;
    }
    
  })();
  
  renderer.render(stage);
  
})();