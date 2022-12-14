import { RootState } from "../store";

export const getUserInfo = (state: RootState) => state.user;
export const getUserBudget = (state: RootState) => state.user.budget;
export const getUserHand = (state: RootState) => state.user.hand;
export const getUserPoints = (state: RootState) => state.user.points;
