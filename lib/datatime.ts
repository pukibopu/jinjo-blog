import type { Dayjs } from "dayjs";
import dayjs, { ConfigType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export type DateTime = Dayjs;
export type DateTimeProps = {
  date: DateTime | null | undefined;
  format?: string;
  relative?: boolean;
};

type ParseOptions = {
  date?: ConfigType;
  timezone?: string;
};
/**
 * Parse a datetime string in UTC to a local timezone
 *
 * @ref https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
 * @ref https://day.js.org/docs/en/parse/utc
 */
export const parseDateTime = (
  options?: Nullish<string> | Nullish<ParseOptions>
): DateTime | null => {
  if (!options) {
    return null;
  }

  // take either a string or an object
  const { date, timezone = null } =
    typeof options === "string" ? { date: options } : options;
  if (!date) {
    return null;
  }

  try {
    return dayjs(dayjs.utc(date)).tz(timezone ?? dayjs.tz.guess());
  } catch {
    return dayjs(date);
  }
};

export type Nullish<T> = null | undefined | T;
export type Nullable<T> = T | null;
