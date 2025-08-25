import type { CardType } from "../types/Card";

const images = [
  "TUTO.png",
  "jp.png",
  "RODRIGO.png",
  "LARA.png",
];

export const generateShuffledCards = (): CardType[] => {
  const paired = [...images, ...images];
  const shuffled = paired.sort(() => Math.random() - 0.5);

  return shuffled.map((img, index) => ({
    id: index,
    image: `/images/${img}`,
    matched: false,
    flipped: false,
  }));
};
