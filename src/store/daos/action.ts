import { createAction } from "@reduxjs/toolkit";

export const saveDaos = createAction<{
  daos: string[];
}>("daos/save");
