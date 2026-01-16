"use client";

import { useParams } from "next/navigation";
import { useGetEvent } from "@/features/events/api/use-get-event";
import { useGameplay } from "@/features/gameplay/hooks/use-gameplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/features/auth/api/use-auth-status";
import { Navbar } from "@/components/Navbar";

export default function GameplayPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const router = useRouter();

  // Check authentication
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();

  const { data, isLoading, error } = useGetEvent(eventId);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/play/" + eventId);
    }
  }, [isAuthenticated, authLoading, router, eventId]);

  // API now returns event directly
  const gameEvent = data && !('error' in data) ? data : null;
  const prizes = gameEvent?.prizePools.map(prize => ({
    ...prize,
    PrizeValue: Number(prize.PrizeValue),
  })) || [];

  const {
    gameState,
    isRevealing,
    pickPlayerCase,
    openCase,
    acceptOffer,
    declineOffer,
    finalSwap,
  } = useGameplay(prizes, eventId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading event</AlertTitle>
            <AlertDescription>
              Event not found or an error occurred.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (gameState.phase === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4">Congratulations!</h1>
              <p className="text-xl mb-2">You won:</p>
              <div className="text-6xl font-bold text-primary mb-6">
                {gameState.wonPrize?.PrizeName || 'Nothing'}
              </div>
              {!gameState.wonPrize?.IsBlank && (
                <div className="text-2xl text-green-600 mb-6">
                  ${Number(gameState.wonPrize?.PrizeValue).toFixed(2)}
                </div>
              )}
              <div className="space-x-4">
                <Button onClick={() => router.push('/events')}>
                  Play Another Event
                </Button>
                <Button variant="outline" onClick={() => router.push('/leaderboard')}>
                  View Leaderboard
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">{gameEvent?.EventName}</h1>
          <p className="text-center text-muted-foreground">Choose wisely!</p>
        </div>

        {/* Case Selection Phase */}
        {gameState.phase === 'pick-case' && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6">Pick Your Case</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {gameState.remainingCases.map((caseNum) => (
                <motion.button
                  key={caseNum}
                  className="h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => pickPlayerCase(caseNum)}
                >
                  {caseNum}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Elimination Phase */}
        {(gameState.phase === 'elimination' || gameState.phase === 'banker-offer') && (
          <div>
            <div className="mb-6 text-center">
              <p className="text-lg">Your case: <span className="font-bold text-primary">{gameState.playerCase}</span></p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto mb-8">
              {gameState.remainingCases.map((caseNum) => {
                const isPlayerCase = caseNum === gameState.playerCase;
                const isOpened = gameState.openedCases.includes(caseNum);
                const prize = gameState.caseValues[caseNum];

                return (
                  <motion.button
                    key={caseNum}
                    className={`h-20 font-bold text-xl rounded-lg shadow-lg transition-all ${
                      isPlayerCase
                        ? 'bg-yellow-500 text-yellow-900'
                        : isOpened
                        ? prize?.IsBlank
                          ? 'bg-gray-500 text-white'
                          : Number(prize?.PrizeValue) < 100
                          ? 'bg-green-500 text-white'
                          : Number(prize?.PrizeValue) < 1000
                          ? 'bg-blue-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl'
                    }`}
                    whileHover={!isPlayerCase && !isOpened ? { scale: 1.05 } : {}}
                    whileTap={!isPlayerCase && !isOpened ? { scale: 0.95 } : {}}
                    onClick={() => !isPlayerCase && openCase(caseNum)}
                    disabled={isPlayerCase || isOpened || isRevealing}
                  >
                    {isOpened ? (
                      <div className="text-center">
                        <div className="text-sm">{caseNum}</div>
                        <div className="text-xs">{prize?.PrizeName.slice(0, 10)}</div>
                        {!prize?.IsBlank && <div className="text-xs">${Number(prize?.PrizeValue)}</div>}
                      </div>
                    ) : (
                      caseNum
                    )}
                  </motion.button>
                );
              })}
            </div>

            {isRevealing && (
              <div className="text-center mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <Trophy className="h-8 w-8 text-primary" />
                </motion.div>
                <p className="mt-2">Revealing case...</p>
              </div>
            )}
          </div>
        )}

        {/* Banker Offer */}
        {gameState.phase === 'banker-offer' && gameState.currentOffer && (
          <Card className="max-w-md mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Banker&apos;s Offer</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-primary mb-4">
                ${gameState.currentOffer.toLocaleString()}
              </div>
              <p className="mb-6">Do you accept this offer?</p>
              <div className="flex gap-4">
                <Button
                  onClick={acceptOffer}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Deal
                </Button>
                <Button
                  onClick={declineOffer}
                  variant="destructive"
                  className="flex-1"
                >
                  No Deal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Final Swap */}
        {gameState.phase === 'final-swap' && (
          <Card className="max-w-md mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Final Decision</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">
                You have your case ({gameState.playerCase}) and one remaining case.
              </p>
              <p className="mb-6">Do you want to swap cases?</p>
              <div className="flex gap-4">
                <Button
                  onClick={() => finalSwap(false)}
                  className="flex-1"
                >
                  Keep My Case
                </Button>
                <Button
                  onClick={() => finalSwap(true)}
                  variant="outline"
                  className="flex-1"
                >
                  Swap Cases
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
