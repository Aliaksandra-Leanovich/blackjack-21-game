import { createSlice } from "@reduxjs/toolkit";

interface IUserStore {
  isAuthorized: string | null;
  email: string | undefined;
  name?: string | undefined;
  password: string | undefined;
  budget: number;
}

const initialState: IUserStore = {
  isAuthorized: null,
  email: undefined,
  name: undefined,
  password: undefined,
  budget: 10000,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserEmail: (state, action) => {
      state.isAuthorized = localStorage.getItem("user");
      state.email = action.payload;
    },
    setUserName: (state, action) => {
      state.name = action.payload;
    },
    setUserPassword: (state, action) => {
      state.password = action.payload;
    },
    setBudget: (state, action) => {
      state.budget = action.payload;
    },

    unsetUser: (state) => {
      state.isAuthorized = null;
      state.email = undefined;
    },
  },
});
export const { setUserEmail, setUserName, setUserPassword, unsetUser } =
  userSlice.actions;
export default userSlice.reducer;