const date = new Date();
date.setTime(new Date().getTime() + 3600 * 1000 * 10);
const date2 = new Date();
date2.setTime(new Date().getTime() + 3600 * 1000 * 8);

export default {
    session: {
      created_at: "2025-08-04T10:43:45.571915622Z",
      ends_at: date.toISOString(),
      timeout_at: "0001-01-01T00:00:00Z",
      ends_in_seconds: 26417,
      active: true,
      timeout_in_seconds: -1
    },
    tokens: {
      expire_at: date2.toISOString(),
      refreshed_at: "2025-08-04T13:23:20.860879157Z",
      expire_in_seconds: 4775,
      next_auto_refresh_in_seconds: 4475,
      refresh_cooldown: true,
      refresh_cooldown_seconds: 52
  }

}
