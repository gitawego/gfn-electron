import type { BrowserWindow } from "electron";

export type GameId = "gfn";

export type Games = Record<GameId, string>;

export interface AppConfig {
  mainWindow?: BrowserWindow;
  gameId?: GameId;
  gameUrl?: string;
}
