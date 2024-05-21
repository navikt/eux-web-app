export const HIDDEN_SAKSHANDLINGER = ["multipleParticipants", "singleParticipant"]

type Allowed = {[key: string]: string[]}

const allowed:Allowed = {
  ADMIN_ALLOWED_TO_FILL_OUT: ["H001", "F001", "F003"],
  ALLOWED_TO_FILL_OUT: ["H001", "F001"],
  ADMIN_ALLOWED_SAKSHANDLINGER: ["H001", "X001", "X009", "F002", "F004", "F022", "F023", "F026", "F027", "F016", "R001", "R003", "R004", "Delete_Case"],
  ALLOWED_SAKSHANDLINGER: ["H001", "X001", "X009", "F002", "Delete_Case"],
  ADMIN_ALLOWED_SED_HANDLINGER: ["H002", "F002", "U002", "U004", "U017", "X008", "X010", "X011", "X012", "Delete", "Update", "Read", "Send", "Participants_Send"],
  ALLOWED_SED_HANDLINGER: ["H002", "F002", "U002", "U004", "U017", "X008", "X010", "X011", "X012", "Delete", "Update", "Read", "Send", "Participants_Send"],
  ADMIN_ALLOWED_SED_EDIT_AND_UPDATE: ["H001", "H002", "F001", "F002", "F003", "U002", "U004", "U017", "X001", "X008", "X009", "X010", "X011", "X012"],
  ALLOWED_SED_EDIT_AND_UPDATE: ["H001", "H002", "F001", "F002", "U002", "U004", "U017", "X001", "X008", "X009", "X010", "X011", "X012"]
}

export const getAllowed = (feature: string, isAdmin: boolean): string[] => {
  const key = isAdmin ? "ADMIN_" + feature : feature
  return allowed[key]
}
