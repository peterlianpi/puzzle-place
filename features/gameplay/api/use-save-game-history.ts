import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";
import { GameHistory } from "@/lib/types";

export interface SaveGameHistoryParams {
  eventId: string;
  wonPrizeName?: string;
  wonPrizeValue?: number;
}

export const saveGameHistory = async (
  params: SaveGameHistoryParams
): Promise<GameHistory> => {
  const response = await client.api.gameplay["game-history"].$post({
    json: params,
  });

  if (!response.ok) {
    throw new Error("Failed to save game history");
  }

  const data = await response.json();
  return {
    HistoryID: data.historyId,
    EventID: data.eventId,
    PlayerUserID: data.playerUserId,
    WonPrizeName: data.wonPrizeName??"",
    WonPrizeValue: Number(data.wonPrizeValue)??0,
    PlayedAt: new Date(data.playedAt),
  };
};

export const useSaveGameHistory = () => {
  return useMutation({
    mutationFn: saveGameHistory,
  });
};
