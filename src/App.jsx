import { useState } from "react";
import Menu from "./components/Menu";
import Game from "./components/Game";
import "./App.css"; // Импорт стилей

export default function App() {
  const [state, setState] = useState("menu");
  const [best, setBest] = useState(() => {
    const saved = localStorage.getItem("flappyBest");
    return saved ? parseInt(saved) : 0;
  });
  const [difficulty, setDifficulty] = useState(null);

  function startGame(level) {
    setDifficulty(level);
    setState("play");
  }

  function handleGameOver(score) {
    if (score > best) {
      setBest(score);
      localStorage.setItem("flappyBest", score);
    }
    setState("menu");
  }

  return (
    <div>
      {state === "menu" && <Menu startGame={startGame} best={best} />}
      {state === "play" && <Game difficulty={difficulty} gameOver={handleGameOver} />}
    </div>
  );
}