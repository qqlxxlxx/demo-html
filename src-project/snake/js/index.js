let sw = 20, // 方块宽
  sh = 20, // 方块高
  tr = 30, // 行数
  td = 30, // 列数
  speed = 150;

let snake = null,
  food = null,
  game = null

class Square {
  constructor(x, y, classname) {
    this.x = x * sw; // 坐标信息
    this.y = y * sh;
    this.classname = classname;
    this.viewContent = document.createElement('div');
    this.viewContent.className = this.classname;
    this.parent = document.getElementById('snakeWrap');
  }
  create() {
    this.viewContent.style.position = 'absolute';
    this.viewContent.style.width = sw + 'px';
    this.viewContent.style.height = sh + 'px';
    this.viewContent.style.left = this.x + 'px';
    this.viewContent.style.top = this.y + 'px';
    this.parent.appendChild(this.viewContent);
  }
  remove() {
    this.parent.removeChild(this.viewContent);
  }
}

class Snake {
  constructor() {
    this.head = null; // 存储蛇头的信息
    this.tail = null; // 存储蛇尾的信息
    this.pos = []; // 存储蛇身每个方块位置
    this.directionNum = { // 存储蛇的走向，用一个对象表示
      left: {
        x: -1,
        y: 0,
        rotate: 90
      },
      right: {
        x: +1,
        y: 0,
        rotate: -90
      },
      up: {
        x: 0,
        y: -1,
        rotate: 180
      },
      down: {
        x: 0,
        y: 1,
        rotate: 0
      }
    }
  }
  init() {
    let snakeHead = new Square(2, 0, 'snakeHead');
    snakeHead.create();
    this.head = snakeHead;
    this.pos.push([2, 0]);
    let snakeBody1 = new Square(1, 0, 'snakeBody');
    snakeBody1.create();
    this.pos.push([1, 0]);
    let snakeBody2 = new Square(0, 0, 'snakeBody');
    snakeBody2.create();
    this.tail = snakeBody2;
    this.pos.push([0, 0]);

    // 形成链表关系
    snakeHead.last = null;
    snakeHead.next = snakeBody1;
    snakeBody1.last = snakeHead;
    snakeBody1.next = snakeBody2;
    snakeBody2.last = snakeBody1;
    snakeBody2.next = null;

    // 添加一条属性，用来表示蛇的走向
    this.direction = this.directionNum.right;
  }
  getNextPos() {
    let nextPos = [this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y];

    let selfCollide = false;
    this.pos.forEach((val) => {
      if (val[0] === nextPos[0] && val[1] === nextPos[1]) {
        selfCollide = true;
      }
    });
    if (selfCollide) {
      // console.log('撞到自己！');
      this.strategies.die.call(this);
      return;
    }

    if (nextPos[0] < 0 || nextPos[0] > tr - 1 || nextPos[1] < 0 || nextPos[1] > td - 1) {
      // console.log('撞到墙了！');
      this.strategies.die.call(this);
      return;
    }

    if (nextPos[0] === food.x / sw && nextPos[1] === food.y / sh) {
      // console.log('吃到食物');
      this.strategies.eat.call(this);
      game.score++;
      scores.innerHTML = game.score;
      return;
    }

    this.strategies.move.call(this);
  }
}
Snake.prototype.strategies = {
  move: function(format) {
    let newBody = new Square(this.head.x / sw, this.head.y / sh, 'snakeBody');
    newBody.next = this.head.next;
    newBody.next.last = newBody;
    newBody.last = null;
    this.head.remove();
    newBody.create();

    let newHead = new Square(this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y, 'snakeHead');
    newHead.next = newBody;
    newHead.last = null;
    newBody.last = newHead;
    newHead.viewContent.style.transform = 'rotate(' + this.direction.rotate + 'deg)';
    newHead.create();

    this.pos.unshift([this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y]);
    this.head = newHead;

    if (!format) {
      this.tail.remove();
      this.tail = this.tail.last;
      this.tail.next = null;
      this.pos.pop();
    }
  },
  eat: function() {
    this.strategies.move.call(this, true);
    createFood();
  },
  die: function() {
    game.over();
  }
}

function createFood() {
  let x = null;
  let y = null;
  let include = true;
  while (include) {
    x = Math.floor(Math.random() * (td - 1));
    y = Math.floor(Math.random() * (tr - 1));
    snake.pos.some((val) => {
      if (val[0] === x && val[1] === y) {
        include = true;
        return true;
      } else {
        include = false;
      }
    })
  }
  food = new Square(x, y, 'food');
  food.pos = [x, y];

  var foodDom = document.querySelector('.food');
  if (foodDom) {
    foodDom.style.left = x * sw + 'px';
    foodDom.style.top = y * sh + 'px';
  } else {
    food.create();
  }
}

class Game {
  constructor() {
    this.score = 0;
    this.timer = null;
  }
  init() {
    snake.init();
    createFood();
    scores.innerHTML = game.score;

    document.onkeydown = function(ev) {
      if (ev.which === 37 && snake.direction !== snake.directionNum.right) {
        snake.direction = snake.directionNum.left;
      } else if (ev.which === 38 && snake.direction !== snake.directionNum.down) {
        snake.direction = snake.directionNum.up
      } else if (ev.which === 39 && snake.direction !== snake.directionNum.left) {
        snake.direction = snake.directionNum.right
      } else if (ev.which === 40 && snake.direction !== snake.directionNum.up) {
        snake.direction = snake.directionNum.down
      }
    }

    this.start();
  }
  start() {
    this.timer = setInterval(function() {
      snake.getNextPos();
    }, speed);
  }
  pause() {
    clearInterval(this.timer);
  }
  over() {
    clearInterval(this.timer);
    alert('你的得分为：' + this.score)

    snakeWrap.innerHTML = '';
    snake = new Snake();
    game = new Game();
    let startBtnWrap = document.querySelector('.start-btn');
    startBtnWrap.style.display = 'block';
  }
}

snake = new Snake();

game = new Game();

let scores = document.querySelector('.score-warp span');

let startBtn = document.querySelector('.start-btn button');
startBtn.onclick = function() {
  game.init();
  this.parentNode.style.display = 'none';
}

let snakeWrap = document.getElementById('snakeWrap');
let pauseBtn = document.querySelector('.pause-btn button');
snakeWrap.onclick = function() {
  game.pause();
  pauseBtn.parentNode.style.display = 'block';
}
pauseBtn.onclick = function() {
  this.parentNode.style.display = 'none';
  game.start();
}
