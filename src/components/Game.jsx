import { useEffect, useRef, useState } from "react";

export default function Game({ difficulty, gameOver }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");

    // Настройки сложности
    let gameSpeed, gameGap;
    switch(difficulty) {
      case "easy":
        gameSpeed = 1.8;
        gameGap = 200;
        break;
      case "medium":
        gameSpeed = 2.2;
        gameGap = 170;
        break;
      case "hard":
        gameSpeed = 2.8;
        gameGap = 140;
        break;
      default:
        gameSpeed = 1.8;
        gameGap = 200;
    }

    // Функция обновления размера канваса
    const updateCanvasSize = () => {
      // Фиксированные пропорции для ноутбука
      // Ширина: 100% окна, но не больше 500px для удобства игры
      // Высота: пропорционально ширине (соотношение 4:3)
      const maxWidth = Math.min(window.innerWidth * 0.9, 500);
      const maxHeight = maxWidth * 1.5; // Соотношение 2:3 для вертикальной игры
      
      canvas.width = maxWidth;
      canvas.height = maxHeight;
    };

    // Игровые параметры с фиксированными пропорциями
    let state = "ready";
    let speed = gameSpeed;
    let gap = gameGap; // Фиксированный промежуток, не зависит от высоты экрана
    let frameCount = 0;
    
    // Размеры птицы (фиксированные относительно ширины канваса)
    const birdWidth = canvas.width * 0.08; // 8% от ширины
    const birdHeight = birdWidth * 0.7; // Высота 70% от ширины
    
    const bird = { 
      x: canvas.width * 0.15, 
      y: canvas.height / 2, 
      velocity: 0, 
      gravity: 0.3, // Фиксированная гравитация
      jump: -6, // Фиксированная сила прыжка
      rotation: 0,
      width: birdWidth,
      height: birdHeight
    };
    
    let pipes = [];
    let scoreValue = 0;

    // Вызываем сразу для установки правильных размеров
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    function spawnPipe() {
      // Фиксированные отступы на основе высоты канваса
      const margin = canvas.height * 0.15; // 15% от высоты
      const minTop = margin;
      const maxTop = canvas.height - gap - margin;
      const top = Math.random() * (maxTop - minTop) + minTop;
      pipes.push({ 
        x: canvas.width, 
        top: top, 
        bottom: top + gap, 
        passed: false,
        width: canvas.width * 0.1 // 10% от ширины
      });
    }

    function update() {
      bird.velocity += bird.gravity;
      bird.y += bird.velocity;
      bird.rotation = Math.min(bird.velocity * 3, 90);

      // Ограничение выхода за верх и низ
      if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
      }
      if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
      }

      // Обновляем позиции труб
      pipes = pipes.filter(pipe => {
        pipe.x -= speed;
        return pipe.x + pipe.width > 0;
      });

      // Спавн новых труб (каждые 120 кадров)
      frameCount++;
      if (frameCount % 120 === 0 || (pipes.length === 0 && frameCount > 60)) {
        spawnPipe();
        frameCount = 0;
      }

      // Проверка прохождения труб
      pipes.forEach((pipe) => {
        if (!pipe.passed) {
          if (bird.x > pipe.x + pipe.width) {
            pipe.passed = true;
            scoreValue += 1;
            setScore(scoreValue);
            
            // Увеличение сложности
            if (speed < 4) speed += 0.05;
          }
        }
      });

      // Проверка столкновения
      if (checkCollision()) {
        endGame();
      }
    }

    function checkCollision() {
      // Проверка границ
      if (bird.y <= 0 || bird.y + bird.height >= canvas.height) {
        return true;
      }
      
      // Проверка столкновения с трубами
      for (let pipe of pipes) {
        const birdLeft = bird.x;
        const birdRight = bird.x + bird.width;
        const birdTop = bird.y;
        const birdBottom = bird.y + bird.height;
        
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + pipe.width;
        const pipeTop = pipe.top;
        const pipeBottom = pipe.bottom;

        if (birdRight > pipeLeft && birdLeft < pipeRight) {
          if (birdTop < pipeTop || birdBottom > pipeBottom) {
            return true;
          }
        }
      }
      return false;
    }

    function endGame() {
      if (state === "play") {
        state = "over";
        setTimeout(() => {
          gameOver(scoreValue);
        }, 500);
      }
    }

    function drawBird() {
      ctx.save();
      ctx.translate(bird.x + bird.width/2, bird.y + bird.height/2);
      ctx.rotate((bird.rotation * Math.PI) / 180);
      
      // Тень птицы
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;
      
      // Тело птицы (круглое, как в оригинале)
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.ellipse(0, 0, bird.width/2, bird.height/2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Глаз
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(bird.width/4, -bird.height/6, bird.width/8, 0, Math.PI * 2);
      ctx.fill();
      
      // Блик в глазу
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(bird.width/4 + 2, -bird.height/6 - 2, bird.width/20, 0, Math.PI * 2);
      ctx.fill();
      
      // Клюв
      ctx.fillStyle = "#FFA500";
      ctx.beginPath();
      ctx.moveTo(bird.width/2, 0);
      ctx.lineTo(bird.width/2 + bird.width/4, -bird.height/6);
      ctx.lineTo(bird.width/2 + bird.width/4, bird.height/6);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }

    function drawPipes() {
      pipes.forEach((pipe) => {
        // Тень труб
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        
        // Градиент для труб
        const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
        pipeGradient.addColorStop(0, "#2ecc71");
        pipeGradient.addColorStop(1, "#27ae60");
        
        // Верхняя труба
        ctx.fillStyle = pipeGradient;
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        
        // Край верхней трубы (утолщение)
        ctx.fillStyle = "#27ae60";
        ctx.fillRect(pipe.x - 5, pipe.top - 20, pipe.width + 10, 20);
        
        // Нижняя труба
        ctx.fillStyle = pipeGradient;
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
        
        // Край нижней трубы (утолщение)
        ctx.fillStyle = "#27ae60";
        ctx.fillRect(pipe.x - 5, pipe.bottom, pipe.width + 10, 20);
      });
      
      ctx.shadowColor = "transparent";
    }

    function draw() {
      // Градиентный фон
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(0.5, "#70c5ce");
      gradient.addColorStop(1, "#5fb0c0");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Облака
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(
          (canvas.width * 0.2 + i * 150 + frameCount * 0.5) % (canvas.width + 300) - 150, 
          canvas.height * 0.2, 
          40, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
      }
      
      drawPipes();
      drawBird();
      
      // Счет
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 15;
      ctx.font = `bold ${canvas.height * 0.08}px 'Arial Black', sans-serif`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(scoreValue, canvas.width / 2, canvas.height * 0.1);
      
      // Подсказка в начале
      if (state === "ready") {
        ctx.shadowBlur = 10;
        ctx.font = `${canvas.height * 0.03}px Arial`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillText("👇 Нажми пробел или клик", canvas.width / 2, canvas.height / 2);
        ctx.font = `${canvas.height * 0.025}px Arial`;
        ctx.fillText("⬆️ Вверх / ⬇️ Вниз", canvas.width / 2, canvas.height / 2 + 40);
      }
      
      ctx.shadowColor = "transparent";
    }

    function handleJump() {
      if (state === "ready") {
        state = "play";
        bird.velocity = bird.jump;
      } else if (state === "play") {
        bird.velocity = bird.jump;
        bird.rotation = -25;
      }
    }

    function handleFastFall() {
      if (state === "play") {
        bird.velocity = bird.jump * 0.3;
      }
    }

    function handleKeyDown(e) {
      if (e.code === "Space" || e.key === "ArrowUp") {
        e.preventDefault();
        handleJump();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleFastFall();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    
    canvas.addEventListener("click", handleJump);
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      handleJump();
    });

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (state === "play") {
        update();
      }
      draw();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('touchmove', (e) => e.preventDefault());
      canvas.removeEventListener("click", handleJump);
      canvas.removeEventListener("touchstart", handleJump);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [difficulty, gameOver]);

  return (
    <div 
      ref={containerRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0a1a24',
        margin: 0,
        padding: 0
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{
          display: 'block',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
        }}
      />
    </div>
  );
}