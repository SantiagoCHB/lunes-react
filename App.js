import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView, PanGestureHandler, State } from "react-native-gesture-handler";
import { styles } from "./styles";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  async function guardarPuntuacion(score) {
    try {
      await addDoc(collection(db, "puntuaciones"), {
        score,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error al guardar la puntuación:", error);
    }
  }

  function generateFood() {
    return {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  }

  function resetGame() {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
  }

  useEffect(() => {
    if (gameOver) {
      guardarPuntuacion(score);
      return;
    }

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y < 0 ||
          newHead.y >= BOARD_SIZE ||
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
          }
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood());
          setScore((prev) => prev + 10);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction, food, gameOver, score]);

  function handleSwipe(event) {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY } = event.nativeEvent;
      let newDirection = direction;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        newDirection = translationX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
      } else {
        newDirection = translationY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
      }

      if (
        (newDirection.x !== -direction.x || newDirection.x === 0) &&
        (newDirection.y !== -direction.y || newDirection.y === 0)
      ) {
        setDirection(newDirection);
      }
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onHandlerStateChange={handleSwipe}>
        <View style={styles.gameContainer}>
          <Text style={{ color: "white", fontSize: 24 }}>Snake Game</Text>
          <Text style={{ color: "white" }}>Score: {score} | High Score: {highScore}</Text>
          {gameOver && <Text style={{ color: "red", fontSize: 20 }}>Game Over! Swipe to restart</Text>}

          <View style={styles.board}>
            {[...Array(BOARD_SIZE)].map((_, y) => (
              <View key={y} style={{ flexDirection: "row" }}>
                {[...Array(BOARD_SIZE)].map((_, x) => {
                  const isSnake = snake.some((s) => s.x === x && s.y === y);
                  const isFood = food.x === x && food.y === y;
                  return (
                    <View
                      key={x}
                      style={[
                        styles.cell,
                        isSnake ? styles.snake : {},
                        isFood ? styles.food : {},
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}
