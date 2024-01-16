/* eslint-disable import/prefer-default-export */
import type { RootState } from "./Store";

export const selectAccessPermitState = (state: RootState) => state.accessPermit;
