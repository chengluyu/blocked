
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
  
  renderer.backgroundColor = 0xFFFFFF;
  
  document.getElementById("stage").appendChild(renderer.view);
  
  function render() {
    renderer.render(stage);
  }
  
  var Color = {
    EMPTY: 0xa4ff49,
    WALL: 0xbf5f00,
    PRISONER: 0xFF0000
  };
  
  var directions = [
    "left", "right", "upleft", "upright", "downleft", "downright"
  ];
  
  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  Array.prototype.randomElement = function () {
    return this[random(0, this.length)];
  };
  
  var circles = []
    , prisoner = null
    ;
  
  function decision() {
    var adjacent = [];
    for (var i = 0; i < directions.length; i++) {
      var direction = directions[i];
      if (prisoner[direction] === null) {
        alert("You lost!");
        return;
      }
      if (prisoner[direction].status === "empty")
        adjacent.push(prisoner[direction]);
    }
    if (adjacent.length === 0) {
      alert("You win!");
    } else {
      var next = adjacent.randomElement();
      next.changeStatus("prisoner");
      prisoner.changeStatus("empty");
      prisoner = next;
    }
  }
  
  (function () {
    
    var BASE_X = 0, BASE_Y = 0, RATIO = 0.85;
    
    function Circle(row, col) {
      var graphics = new PIXI.Graphics()
        , self = this
        ;
      
      graphics.beginFill(Color.EMPTY);
      graphics.drawCircle(0, 0, R * RATIO);
      graphics.endFill();
      graphics.x = BASE_X + 2 * R * (col + 1);
      if (row % 2 == 0) graphics.x -= R;
      graphics.y = BASE_Y + R + R * row * SQRT3;
      graphics.interactive = true;
      graphics.changeColor = function (color) {
        this.clear();
        this.beginFill(color);
        this.drawCircle(0, 0, R * RATIO);
        this.endFill();
      };
      graphics.mousedown = function (data) {
        if (self.status === "empty") {
          this.changeColor(Color.WALL);
          self.status = "wall";
          render();
          decision();
          render();
        }
      };
      
      this.status = "empty";
      this.row = row;
      this.col = col;
      this.graphics = graphics;
      this.changeStatus = function (status) {
        graphics.changeColor(Color[status.toUpperCase()]);
        this.status = status;
      };
    }
    
    var ROW = HEIGHT / (SQRT3 * R) - 2 / SQRT3
      , COL = WIDTH / D - 1
      ;
    
    for (var i = 0; i < ROW; i++) {
      var cs = [];
      for (var j = 0; j < COL; j++) {
        var circle = new Circle(i, j);
        stage.addChild(circle.graphics);
        cs.push(circle);
      }
      circles[i] = cs;
    }
    
    for (var i = 0; i < ROW; i++) {
      for (var j = 0; j < COL; j++) {
        var c = circles[i][j];
        c.left = j > 0 ? circles[i][j - 1] : null;
        c.right = j + 1 < COL ? circles[i][j + 1] : null;
        if (i > 0) {
          c.upleft = circles[i - 1][j];
          c.upright = j + 1 < COL ? circles[i - 1][j + 1] : null;
        } else {
          c.upleft = null;
          c.upright = null;
        }
        if (i + 1 < ROW) {
          c.downleft = circles[i + 1][j];
          c.downright = j + 1 < COL ? circles[i + 1][j + 1] : null;
        } else {
          c.downleft = null;
          c.downright = null;
        }
      }
    }
    
    prisoner = circles[Math.floor(ROW / 2)][Math.floor(COL / 2)];
    
  })();
  
  prisoner.changeStatus("prisoner");
  
  render();
  
})();