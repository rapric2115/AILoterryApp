import { create } from 'zustand';

interface LotteryDraw {
  date: string;
  numbers: number[];
}

interface LotteryState {
  lotteryNumbers: LotteryDraw[];
  addDraw: (draw: LotteryDraw) => void;
}

export const useLotteryStore = create<LotteryState>((set) => ({
  lotteryNumbers: [
    {
      date: '2024-02-20',
      numbers: [7, 14, 21, 28, 35, 40, 11, 11]
    },
    {
      date: '2024-02-19',
      numbers: [3, 9, 15, 27, 33, 39, 2, 5]
    },
    {
      date: '2024-02-18',
      numbers: [5, 12, 19, 26, 38, 40, 8, 10]
    },
  ],
  addDraw: (draw) =>
    set((state) => ({
      lotteryNumbers: [draw, ...state.lotteryNumbers],
    })),
}));