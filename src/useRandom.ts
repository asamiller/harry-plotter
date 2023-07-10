import { useEffect, useState } from "react";

export const useRandom = () => {
  const [random, setRandom] = useState(0);

  useEffect(() => {
    setRandom(Math.random());
  }, []);

  return random;
};

export const useRandomXY = (): [number, number] => {
  const [randomX, setRandomX] = useState(0);
  const [randomY, setRandomY] = useState(0);

  useEffect(() => {
    setRandomX(Math.random());
    setRandomY(Math.random());
  }, []);

  return [randomX, randomY];
};
