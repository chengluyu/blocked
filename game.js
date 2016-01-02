
(function () {
  
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
  
  // Create cell map
  
  var cells = [];
  
  for (var i = 0; i < ROW; i++) {
    var line = [];
    for (var j = 0; j < COL; j++) {
      var cell = new Cell(i, j);
      stage.addChild(cell.graphics);
      line.push(circle);
    }
    cells.push(line);
  }
  
  // Generate relations
  
  for (var i = 0; i < ROW; i++) {
    for (var j = 0; j < COL; j++) {
      var c = cells[i][j];
      c.left = j > 0 ? cells[i][j - 1] : null;
      c.right = j + 1 < COL ? cells[i][j + 1] : null;
      if (i > 0) {
        c.upleft = cells[i - 1][j];
        c.upright = j + 1 < COL ? cells[i - 1][j + 1] : null;
      } else {
        c.upleft = null;
        c.upright = null;
      }
      if (i + 1 < ROW) {
        c.downleft = cells[i + 1][j];
        c.downright = j + 1 < COL ? cells[i + 1][j + 1] : null;
      } else {
        c.downleft = null;
        c.downright = null;
      }
    }
  }
  
  // The prisoner
  
  var prisoner = cells[Math.floor(ROW / 2)][Math.floor(COL / 2)];
  
  // Strategy
  
  var directions = [
    "left", "right", "upleft", "upright", "downleft", "downright"
  ];
  
  function decision() {
    var adjacent = directions.map(function (x) {
      return prisoner[x];
    });
    // Check if on border
    if 
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
    
    // Mouse down event
    graphics.mousedown = function (data) {
      if (self.status === "empty") {
        // Place wall
        self.status = "wall";
        changeColor("wall");
        // Decision
        decision();
        // Re-render
        renderer.render(stage);
      } else if (self.status === "prisoner") {
        alert("You cannot hit me!");
      } else if (self.status === "wall") {
        alert("You cannot put a wall on a wall!");
      }
    };
    
    this.row = row;
    this.col = col;
    this.status = status;
    this.graphics = graphics;
    this.transform = function (status) {
      changeColor(status);
      this.status = status;
    };
  }
  
});