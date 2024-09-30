export const NBR_OF_DICES = 5;
export const NBR_OF_THROWS = 3;
export const MIN_SPOT = 1;
export const MAX_SPOT = 6;
export const BONUS_POINTS_LIMIT = 63;
export const BONUS_POINTS = 50;
export const MAX_NBR_OF_SCOREBOARD_ROWS = 7;
export const SCOREBOARD_KEY = "@scoreboard";

export const GAMERULES = `
THE GAME: Upper section of the classic Yahtzee dice game.
You have ${NBR_OF_DICES} dices and for every dice, you have ${NBR_OF_THROWS} throws.
After each throw, you can keep dices to get the same dice spot counts as many as possible.
In the end, you must select your points from ${MIN_SPOT} to ${MAX_SPOT}.
Game ends when all points have been selected. The order for selecting those is free.

POINTS: After each turn, the game calculates the sum for the dices you selected.
Only the dices with the same spot count are calculated.
Inside the game, you cannot select the same points from ${MIN_SPOT} to ${MAX_SPOT} again.

GOAL: To get as many points as possible. ${BONUS_POINTS_LIMIT} points is the limit of getting a bonus which gives you ${BONUS_POINTS} points more.
`.trim();
