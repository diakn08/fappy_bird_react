import { useState } from "react";

export default function Menu({ startGame, best }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [hoveredLevel, setHoveredLevel] = useState(null);

  const levels = [
    { id: "easy", name: "🐣 ЛЕГКИЙ", color: "#4CAF50", gradient: "linear-gradient(135deg, #4CAF50, #45a049)" },
    { id: "medium", name: "⚡ СРЕДНИЙ", color: "#FF9800", gradient: "linear-gradient(135deg, #FF9800, #F57C00)" },
    { id: "hard", name: "🔥 СЛОЖНЫЙ", color: "#f44336", gradient: "linear-gradient(135deg, #f44336, #d32f2f)" }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at 50% 50%, #1e3c4f, #0a1a24)',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      {/* Анимированный фон */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.1,
        background: 'repeating-linear-gradient(45deg, #fff 0px, #fff 20px, transparent 20px, transparent 40px)',
        animation: 'moveBackground 20s linear infinite'
      }} />
      
      <div style={{
        width: 'min(90%, 600px)',
        backgroundColor: 'rgba(10, 25, 35, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '50px',
        padding: 'clamp(30px, 8vh, 60px) clamp(20px, 5vw, 40px)',
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 215, 0, 0.2)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        position: 'relative',
        zIndex: 1,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Заголовок */}
        <h1 style={{
          fontSize: 'clamp(40px, 12vw, 82px)',
          fontWeight: '900',
          textAlign: 'center',
          margin: '0 0 10px 0',
          background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF4500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 10px 20px rgba(255, 215, 0, 0.3)',
          lineHeight: 1,
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          FLAPPY
        </h1>
        <h1 style={{
          fontSize: 'clamp(40px, 12vw, 82px)',
          fontWeight: '900',
          textAlign: 'center',
          margin: '-20px 0 20px 0',
          background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF4500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1
        }}>
          BIRD
        </h1>

        {/* Лучший счет */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(30px, 5vh, 50px)'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '30px',
            padding: 'clamp(10px, 2vh, 20px) clamp(20px, 4vw, 40px)',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <span style={{ 
              fontSize: 'clamp(14px, 2vh, 18px)', 
              color: '#aaa',
              display: 'block',
              marginBottom: '5px'
            }}>
              🏆 ЛУЧШИЙ РЕЗУЛЬТАТ
            </span>
            <span style={{ 
              fontSize: 'clamp(40px, 8vh, 70px)', 
              fontWeight: 'bold', 
              color: '#FFD700',
              lineHeight: 1,
              textShadow: '0 0 20px rgba(255,215,0,0.5)'
            }}>
              {best}
            </span>
          </div>
        </div>

        {/* Выбор сложности */}
        <h3 style={{
          textAlign: 'center',
          color: '#fff',
          fontSize: 'clamp(18px, 3vh, 24px)',
          marginBottom: 'clamp(20px, 4vh, 40px)',
          fontWeight: '300',
          letterSpacing: '2px'
        }}>
          ВЫБЕРИ СЛОЖНОСТЬ
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginBottom: 'clamp(30px, 5vh, 50px)'
        }}>
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              onMouseEnter={() => setHoveredLevel(level.id)}
              onMouseLeave={() => setHoveredLevel(null)}
              style={{
                padding: 'clamp(15px, 3vh, 25px)',
                border: 'none',
                borderRadius: '20px',
                background: selectedLevel === level.id 
                  ? level.gradient 
                  : 'rgba(255, 255, 255, 0.03)',
                color: 'white',
                fontSize: 'clamp(18px, 3.5vh, 28px)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: selectedLevel === level.id || hoveredLevel === level.id 
                  ? 'scale(1.02)' 
                  : 'scale(1)',
                boxShadow: selectedLevel === level.id 
                  ? `0 10px 30px ${level.color}80, 0 0 0 2px ${level.color}`
                  : hoveredLevel === level.id
                  ? '0 5px 20px rgba(255,255,255,0.1)'
                  : 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'left',
                paddingLeft: '30px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {level.name}
              {selectedLevel === level.id && (
                <span style={{
                  position: 'absolute',
                  right: '30px',
                  fontSize: '24px'
                }}>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Кнопка старта */}
        <button
          disabled={!selectedLevel}
          onClick={() => startGame(selectedLevel)}
          style={{
            width: '100%',
            padding: 'clamp(15px, 4vh, 25px)',
            fontSize: 'clamp(20px, 4vh, 32px)',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '30px',
            background: selectedLevel 
              ? 'linear-gradient(135deg, #FFD700, #FFA500, #FF4500)'
              : 'linear-gradient(135deg, #333, #111)',
            color: selectedLevel ? '#000' : '#666',
            cursor: selectedLevel ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            transform: selectedLevel ? 'scale(1)' : 'scale(0.98)',
            boxShadow: selectedLevel 
              ? '0 15px 40px rgba(255, 215, 0, 0.4), 0 0 0 3px rgba(255, 215, 0, 0.3)'
              : 'none',
            opacity: selectedLevel ? 1 : 0.3,
            letterSpacing: '2px',
            marginTop: '10px'
          }}
        >
          {selectedLevel ? '🚀 НАЧАТЬ ИГРУ' : 'ВЫБЕРИ СЛОЖНОСТЬ'}
        </button>

        {/* Подсказка по управлению */}
        <div style={{
          marginTop: 'clamp(20px, 4vh, 40px)',
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(20px, 5vw, 50px)',
          color: 'rgba(255,255,255,0.5)',
          fontSize: 'clamp(14px, 2vh, 16px)',
          flexWrap: 'wrap'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>⬆️</span> Прыжок
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>⬇️</span> Падение
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>␣</span> Пробел
          </span>
        </div>
      </div>

      {/* Стили для анимаций */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes moveBackground {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}