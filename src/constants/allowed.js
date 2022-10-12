import {IS_DEVELOPMENT} from "constants/environment.ts";

export const ALLOWED_TO_FILL_OUT = IS_DEVELOPMENT ? ["H001", "F001"] : ["H001"]
export const ALLOWED_SAKSHANDLINGER = IS_DEVELOPMENT ?
    ["H001", "X001", "X009", "F002", "F004", "F022", "F023", "F026", "F027", "F016", "R001", "R003", "R004", "Delete_Case"] :
    ["H001", "X001", "X009", "F002", "Delete_Case"]

export const HIDDEN_SAKSHANDLINGER = ["multipleParticipants", "singleParticipant"]
export const ALLOWED_SED_HANDLINGER = ["H002", "F002", "X008", "X010", "X011", "X012", ]
export const ALLOWED_SED_EDIT_AND_UPDATE = ["H001", "H002", "F002", "X008", "X010", "X011", "X012"]
