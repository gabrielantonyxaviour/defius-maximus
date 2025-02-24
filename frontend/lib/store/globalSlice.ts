import { StateCreator } from "zustand";

interface GlobalState {}

interface GlobalActions {}

export type GlobalSlice = GlobalState & GlobalActions;

export const initialGlobalState: GlobalState = {};

export const createGlobalSlice: StateCreator<
  GlobalSlice,
  [],
  [],
  GlobalSlice
> = (set) => ({
  ...initialGlobalState,
});
