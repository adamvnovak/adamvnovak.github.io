const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 4,
  velocityX: 4,
  velocityY: 4,
};

const paddle = {
  width: 10,
  height: 100,
};

const leftPaddle = {
  x: 0,
  y: canvas.height / 2 - paddle.height / 2,
};

const rightPaddle = {
  x: canvas.width - paddle.width,
  y: canvas.height / 2 - paddle.height / 2,
};

function drawPaddle(x, y) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function moveBall() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
}

function checkCollision() {
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  if (ball.x + ball.radius > canvas.width) {
    if (
      ball.y > rightPaddle.y &&
      ball.y < rightPaddle.y + paddle.height &&
      ball.x < canvas.width
    ) {
      ball.velocityX = -ball.velocityX;
    } else {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
    }
  } else if (ball.x - ball.radius < 0) {
    if (
      ball.y > leftPaddle.y &&
      ball.y < leftPaddle.y + paddle.height &&
      ball.x > 0
    ) {
      ball.velocityX = -ball.velocityX;
    } else {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
    }
  }
}

function movePaddle(evt) {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  const mouseY = evt.clientY - rect.top - root.scrollTop;

  leftPaddle.y = mouseY - paddle.height / 2;
}

canvas.addEventListener("mousemove", movePaddle);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle(leftPaddle.x, leftPaddle.y);
  drawPaddle(rightPaddle.x, rightPaddle.y);
  drawBall();

  moveBall();
  aiMovePaddle();
  checkCollision();

  requestAnimationFrame(gameLoop);
}

function aiMovePaddle() {
  const paddleCenter = rightPaddle.y + paddle.height / 2;

  if (paddleCenter < ball.y - 35) {
    rightPaddle.y += 3;
  } else if (paddleCenter > ball.y + 35) {
    rightPaddle.y -= 3;
  }
}

gameLoop();
