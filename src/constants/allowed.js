import {IS_DEVELOPMENT} from "constants/environment.ts";

export const ALLOWED_TO_FILL_OUT = IS_DEVELOPMENT? ["H001", "F001"] : ["H001"]
