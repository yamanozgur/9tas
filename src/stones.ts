// Raw GitHub URLs as specified by user
export const RAW_WHITE_STONE_URL = 'https://raw.githubusercontent.com/yamanozgur/3stone/main/public/assets/wht_stn.webp';
export const RAW_BLACK_STONE_URL = 'https://raw.githubusercontent.com/yamanozgur/3stone/main/public/assets/blck_stn.webp';
export const RAW_MUSIC_URL = 'https://raw.githubusercontent.com/yamanozgur/3stone/main/public/assets/3stone.mp3';
export const RAW_WOOD_BG_URL = 'https://raw.githubusercontent.com/yamanozgur/3stone/main/public/assets/wood_back.webp';
export const RAW_MARBLE_BG_URL = 'https://raw.githubusercontent.com/yamanozgur/3stone/main/public/assets/marble_back.webp';
export const RAW_3TAS_FRAME_URL = 'https://raw.githubusercontent.com/yamanozgur/3stone/main/public/assets/3tas_frame.webp';
export const RAW_SFX1_URL = 'https://raw.githubusercontent.com/yamanozgur/3stone/main/public/assets/sfx1.mp3';
export const RAW_WIN_URL = 'https://raw.githubusercontent.com/yamanozgur/3stone/main/public/assets/win.mp3';
export const RAW_LOSE_URL = 'https://raw.githubusercontent.com/yamanozgur/3stone/main/public/assets/lose.mp3';

import whiteStoneImport from './wht_stn.webp';
import blackStoneImport from './blck_stn.webp';
import musicImport from './3stone.mp3';
import frame3tasImport from './3tas_frame.webp';
import sfx1Import from './sfx1.mp3';
import winImport from './win.mp3';
import loseImport from './lose.mp3';

export const BUNDLED_WHITE_STONE = whiteStoneImport;
export const BUNDLED_BLACK_STONE = blackStoneImport;
export const BUNDLED_MUSIC = musicImport;
export const BUNDLED_3TAS_FRAME = frame3tasImport;
export const BUNDLED_SFX1 = sfx1Import;
export const BUNDLED_WIN = winImport;
export const BUNDLED_LOSE = loseImport;

// Primary stone & background assets pulling directly from user's GitHub repository raw assets
export const WHITE_STONE_WEBP = RAW_WHITE_STONE_URL;
export const BLACK_STONE_WEBP = RAW_BLACK_STONE_URL;
export const MUSIC_MP3 = RAW_MUSIC_URL;
export const WOOD_BG_WEBP = RAW_WOOD_BG_URL;
export const MARBLE_BG_WEBP = RAW_MARBLE_BG_URL;
export const FRAME_3TAS_WEBP = frame3tasImport || RAW_3TAS_FRAME_URL;
export const SFX1_MP3 = sfx1Import || RAW_SFX1_URL;
export const WIN_MP3 = winImport || RAW_WIN_URL;
export const LOSE_MP3 = loseImport || RAW_LOSE_URL;
