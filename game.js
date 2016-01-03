
(function newGame () {
  
  // Constant definition
  
  var WIDTH = 800
    , HEIGHT = 600
    , R = 30
    , D = 2 * R
    , RATIO = 0.85
    , SQRT3 = Math.sqrt(3)
    , ROW = HEIGHT / (SQRT3 * R) - 2 / SQRT3
    , COL = WIDTH / D - 1
    ;
  
  // Helper functions
  Array.prototype.randomElement = function () {
    return this[_.random(0, this.length - 1)];
  };
  
  // Initialize renderer
  
  var renderOptions = {
        antialias: true
      }
    , renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, renderOptions)
    ;
  renderer.backgroundColor = 0xFFFFFF;
  document.getElementById("stage").appendChild(renderer.view);
  
  // Create game stage
  
  var stage = new PIXI.Container();
  
  function renderStage() {
    renderer.render(stage);
  }
  
  // Create cell map
  
  var cells = [];
  
  for (var i = 0; i < ROW; i++) {
    var line = [];
    for (var j = 0; j < COL; j++) {
      var cell = new Cell(i, j);
      stage.addChild(cell.graphics);
      line.push(cell);
    }
    cells.push(line);
  }
  
  // Generate relations
  
  var directions = [
    "left", "right", "upleft", "upright", "downleft", "downright"
  ];
  
  for (var i = 0; i < ROW; i++) {
    for (var j = 0; j < COL; j++) {
      var c = cells[i][j];
      c.left = j > 0 ? cells[i][j - 1] : null;
      c.right = j + 1 < COL ? cells[i][j + 1] : null;
      
      // Odd line
      if (i % 2 === 0) {
        if (i > 0) {
          c.upleft = j - 1 >= 0 ? cells[i - 1][j - 1] : null;
          c.upright = cells[i - 1][j];
        } else {
          c.upleft = null;
          c.upright = null;
        }
        if (i + 1 < ROW) {
          c.downleft = j - 1 >= 0 ? cells[i + 1][j - 1] : null;
          c.downright = cells[i + 1][j];
        } else {
          c.downleft = null;
          c.downright = null;
        }
      } else { // Even line
        if (i > 0) { // Not the first line
          c.upleft = cells[i - 1][j];
          c.upright = j + 1 < COL ? cells[i - 1][j + 1] : null;
        } else {
          c.upleft = null;
          c.upright = null;
        }
        if (i + 1 < ROW) {// Not the last line
          c.downleft = cells[i + 1][j];
          c.downright = j + 1 < COL ? cells[i + 1][j + 1] : null;
        } else {
          c.downleft = null;
          c.downright = null;
        }
      }
      
      c.adjacent = _.map(directions, function (x) {
        return c[x];
      });
    }
  }
  
  // The prisoner
  
  var prisoner = cells[Math.floor(ROW / 2)][Math.floor(COL / 2)];
  prisoner.transform("prisoner");
  
  // Strategy
  
  var visitedCycle = 0;
  
  function computerLose() {
    visitedCycle += 1;
    
    var q = [];
    q.push(prisoner);
    
    while (q.length > 0) {
      var u = q.shift()
        , found = false;
        ;
      _.map(directions, function (d) {
        var v = u[d];
        if (v === null) {
          found = true;
        } else if (v.visited !== visitedCycle && v.status === "empty") {
          q.push(v);
          v.visited = visitedCycle;
        }
      });
      if (found) {
        return false;
      }
    }
    return true;
  }
  
  function decision() {
    if (computerLose()) {
      alert("You win!");
      return;
    }
    // Check if on border
    if (_.some(prisoner.adjacent, function (x) {return x === null;})) {
      alert("You lost!");
      return;
    }
    // Find available direction
    var ds = _.filter(prisoner.adjacent, function (x) {
      return x && x.status === "empty";
    });
    if (ds.length === 0) {
      alert("You win!");
    } else {
      prisoner.transform("empty");
      var next = ds.randomElement();
      if (next === undefined)
        debugger;
      prisoner = next;
      prisoner.transform("prisoner");
    }
  }
  
  // Cell class
  
  function Cell(row, col) {
    
    var self = this;
    
    var Colors = {
      empty: 0x00FF00,
      prisoner: 0xFF0000,
      wall: 0x0000FF
    };
    
    var graphics = new PIXI.Graphics();
    
    // Set graphics position
    graphics.x = 2 * R * (col + 1);
    if (row % 2 == 0) graphics.x -= R;
    graphics.y = R + R * row * SQRT3;
    
    // Make interaction available
    graphics.interactive = true;
    
    // Change color
    function changeColor(status) {
      graphics.clear();
      graphics.beginFill(Colors[status]);
      graphics.drawCircle(0, 0, R * RATIO);
      graphics.endFill();
    }
    
    // Transform
    function transform(status) {
      changeColor(status);
      self.status = status;
    }
    
    // Mouse down event
    graphics.mousedown = function (data) {
      if (self.status === "empty") {
        // Place wall
        transform("wall");
        // Decision
        decision();
        // Re-render
        renderStage();
      } else if (self.status === "prisoner") {
        alert("You cannot hit me!");
      } else if (self.status === "wall") {
        alert("You cannot put a wall on a wall!");
      }
    };
    
    // Make self empty
    transform("empty");
    
    this.row = row;
    this.col = col;
    this.graphics = graphics;
    this.transform = transform;
    this.visited = visitedCycle;
    this.factor = 1.0;
  }
  
  renderStage();
  
})();