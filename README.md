# demo-pc

## 关于贪吃蛇

### 定义变量

```js
let sw = 20, // 方块宽
    sh = 20, // 方块高
    tr = 30, // 行数
    td = 30, // 列数
    speed = 150;

let snake = null, // 蛇实例
    food = null, // 食物实例
    game = null // 游戏实例
```

### 1.方块构造函数

##### 构造器
存储方块x,y坐标和类名信息，创建dom元素、设置类名，获取父容器dom

##### 方法

创建方块的方法：设置方块宽高、设置方块定位、方块添加到父容器上

删除方块的方法：将方块从父容器上删除

### 2.蛇构造函数：

##### 构造器

存储蛇头方块位置、蛇尾方块位置，数组存储蛇身每个方块位置、蛇的走向信息（上下左右和对应蛇头旋转角度）

##### 方法

初始化的方法：使用方块构造函数快速创建蛇默认位置；让每个方块形成链表关系；添加一条属性，用来表示蛇的走向

获取下个点的方法：此方法用于获取蛇头下一个位置对应的元素，要根据元素做不同的事情 die、吃、走。

    - 获取下一个位置：主要根据蛇头位置信息和蛇的走向，来确定下一个点的坐标
    - 行走逻辑：撞到自己、撞到墙就游戏结束，return；吃到食物身长+1，return；以上都不是，就往前走

蛇走向策略的方法：处理蛇的移动、蛇的移动蛇吃食物、蛇碰撞后要做的事

    - 移动要做的事情 加头去尾：
               原头位置创建新身体、更新链表，删除原头创建新头；
               原头位置+走向创建新头、更新链表，创建新头；更新构造器中蛇头方块位置，和蛇头指向新创建蛇头；
               根据传入布尔参数来决定是否去尾，如果去尾，就删掉尾巴，更新链表、删除构造器中蛇身每个方块位置的数组最后一个元素
    - 蛇吃食物要做的事情：调用移动方法，传入参数不要去掉尾巴，并更新下一个食物位置
    - 蛇碰撞后要做的事：调用Game实例游戏结束的方法

### 3.生成食物的函数：判断食物随机坐标是否在蛇身上

while循环中：  
1.随机生成x,y坐标；  
2.循环蛇身信息数组，判断新坐标是否在蛇身上，一旦条件成立立即结束循环，让while进入下一轮循环，循环中条件都不成立，说明食物坐标没有在蛇身上，include = false结束while循环

然后创建食物新实例，更新食物实例坐标位置  
获取页面食物dom元素，如果获取不到，就创建新食物方块添加到页面，反之，更新页面的食物 left top 值（单例模式）

```
let include = true;
while (include) {
    x = Math.floor(Math.random() * (td - 1));
    y = Math.floor(Math.random() * (tr -1));
    snake.pos.some(val => {
        if (val[0] === x && val[1] === y) {
            return true;
        } else {
            // some循环中，上面的条件都不成立，就会执行下面的语句，结束while循环
            include = false;
        }
    })
}
```

> 遇到的问题，过程中使用了forEach循环进行判断，但forEach没有循环完就无法立即结束循环，导致外层循环while无法立即进入新一轮循环  
> 解决办法：使用some循环替换forEach循环  
> 原因解析：当forEach循环中碰到return相关语句，只会跳出本次循环；而some循环，碰到return true语句就会立即结束some循环，如果碰到的是return/return false语句，同forEach一样只跳出本次循环

### 4.游戏构造函数（游戏逻辑）

#####  构造器

存储游戏分数、定时器信息

#####  方法

游戏初始化的方法：蛇初始化方法调用，创建食物函数调用，监听键盘按下事件来改变蛇走向，游戏开始

游戏开始的方法：开启定时器，调用蛇获取下个点的方法

游戏暂停的方法：关闭定时器

游戏结束的方法：关闭定时器，提示得分，清空容器内容，创建蛇新实例、创建游戏新实例，显示开始按钮

### 5.监听页面点击事件

监听页面开始按钮点击，调用蛇初始化方法，隐藏开始按钮

监听游戏容器点击，调用游戏暂停方法，显示暂停按钮

监听暂停按钮点击，隐藏暂停按钮，调用游戏开始方法

```js
let startBtn = document.querySelector('.start-btn button');
startBtn.onclick = function () {
    game.init();
    this.parentNode.style.display = 'none';
}

let snakeWrap = document.getElementById('snakeWrap');
let pauseBtn = document.querySelector('.pause-btn button');
snakeWrap.onclick = function () {
    game.pause();
    pauseBtn.parentNode.style.display = 'block';
}
pauseBtn.onclick = function () {
    this.parentNode.style.display = 'none';
    game.start();
}
```
