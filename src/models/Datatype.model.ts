export const enum BATTLETYPE {
  AUTH = 0, // server -> client set id
  START_BATTLE, // data: (room id)
  WAIT_BATTLE, // data: (none)
  STOP_BATTLE = 3, // data: (node)

  TELEMETRY = 200,
}

export const enum ROOMTYPE {
  JOIN_ROOM = 4, // data: (room id)
  LEAVE_ROOM,
  BAD_ROOM = 6,

  JOIN_USER = 10, // data: (user id)
  LEAVE_USER, // data: (user id)

  GET_USERS = 22, // data: (array connect users)
  GET_ROOMMETA, // payload: (RoomMeta)
  GET_ROOMTIME, // payload: { time white and black }
  NEW_ROOMSTATUS, // payload ROOMSTATUS
  NEW_ROOMRESULT, // payload RoomResult

  GET_MESSAGES = 30, // data: (array messages)
  NEW_MESSAGE, // data: ({ sender id, message })

  GET_HISTORY = 40, // data: (array steps)
  NEW_HISTORY, // data: ({ from, to, time })
  DEL_HISTORY, // data: (none) / delete last step.

  ROOM_CLAIM = 50, // payload CLAIMS request
  NEW_CLAIM, // payload CLAIMS responce
}

export type DATATYPE = BATTLETYPE | ROOMTYPE;
