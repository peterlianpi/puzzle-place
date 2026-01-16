import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, EventPrizePool } from '@/lib/types';

export const useGameplay = (prizes: EventPrizePool[], eventId: string) => {
  const [gameState, setGameState] = useState<GameState>({
    eventId,
    playerCase: undefined,
    openedCases: [],
    remainingCases: [],
    currentOffer: undefined,
    phase: 'pick-case',
    caseValues: {},
  });

  const [isRevealing, setIsRevealing] = useState(false);
  const initializedRef = useRef(false);

  // Initialize cases when prizes change
  useEffect(() => {
    if (prizes.length > 0 && !initializedRef.current) {
      initializedRef.current = true;
      const caseNumbers = Array.from({ length: prizes.length }, (_, i) => i + 1);
      const shuffledPrizes = [...prizes].sort(() => Math.random() - 0.5);

      const caseValues: { [caseNum: number]: EventPrizePool } = {};
      caseNumbers.forEach((num, index) => {
        caseValues[num] = shuffledPrizes[index];
      });

      // eslint-disable-next-line react-hooks/exhaustive-deps
      setGameState(prev => ({
        ...prev,
        remainingCases: caseNumbers,
        caseValues,
      }));
    }
  }, [prizes]);

  const pickPlayerCase = useCallback((caseNum: number) => {
    setGameState(prev => ({
      ...prev,
      playerCase: caseNum,
      phase: 'elimination',
    }));
  }, []);

  const openCase = useCallback(async (caseNum: number) => {
    if (isRevealing || gameState.openedCases.includes(caseNum) || caseNum === gameState.playerCase) return;

    setIsRevealing(true);

    // Suspense delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setGameState(prev => {
      const newOpenedCases = [...prev.openedCases, caseNum];
      const newRemainingCases = prev.remainingCases.filter(c => c !== caseNum);

      // Calculate banker offer after certain eliminations
      let newOffer: number | undefined;
      let newPhase = prev.phase;

      if (newRemainingCases.length <= 2) {
        newPhase = 'final-swap';
      } else if ([10, 8, 6, 4].includes(newRemainingCases.length)) {
        // Banker offers at 10, 8, 6, 4 cases remaining
        const remainingPrizes = newRemainingCases.map(c => prev.caseValues[c]);
        const average = remainingPrizes.reduce((sum, p) => sum + Number(p.PrizeValue), 0) / remainingPrizes.length;
        const multiplier = newRemainingCases.length === 10 ? 0.6 :
                          newRemainingCases.length === 8 ? 0.75 :
                          newRemainingCases.length === 6 ? 0.85 : 1.0;
        newOffer = Math.round(average * multiplier);
        newPhase = 'banker-offer';
      }

      return {
        ...prev,
        openedCases: newOpenedCases,
        remainingCases: newRemainingCases,
        currentOffer: newOffer,
        phase: newPhase,
      };
    });

    setIsRevealing(false);
  }, [gameState, isRevealing]);

  const acceptOffer = useCallback(() => {
    if (!gameState.currentOffer) return;

    const wonPrize = gameState.caseValues[gameState.playerCase!];

    setGameState(prev => ({
      ...prev,
      wonPrize,
      phase: 'finished',
    }));
  }, [gameState]);

  const declineOffer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentOffer: undefined,
      phase: 'elimination',
    }));
  }, []);

  const finalSwap = useCallback((swap: boolean) => {
    const playerCase = gameState.playerCase!;
    const remainingCases = gameState.remainingCases;
    const otherCase = remainingCases.find(c => c !== playerCase)!;

    const wonCase = swap ? otherCase : playerCase;
    const wonPrize = gameState.caseValues[wonCase];

    setGameState(prev => ({
      ...prev,
      wonPrize,
      phase: 'finished',
    }));
  }, [gameState]);

  return {
    gameState,
    isRevealing,
    pickPlayerCase,
    openCase,
    acceptOffer,
    declineOffer,
    finalSwap,
  };
};