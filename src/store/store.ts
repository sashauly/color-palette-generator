import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import paletteReducer from "./paletteSlice";
import uiReducer from "./uiSlice";
import { AppState } from "@/types";

const localStorageKey = "colorPaletteGeneratorState";

const loadState = (): AppState | undefined => {
  try {
    const savedState = localStorage.getItem(localStorageKey);
    if (savedState) {
      const parsedState: AppState = JSON.parse(savedState);

      return parsedState;
    }
  } catch (e) {
    console.error("Error parsing saved state:", e);
    return undefined;
  }
  return undefined;
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    palette: paletteReducer,
    ui: uiReducer,
  },
  preloadedState: preloadedState,
});

store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  } catch (e) {
    console.error("Error saving state to local storage:", e);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
