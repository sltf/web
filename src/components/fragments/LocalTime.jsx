import React from "react";
import moment from "moment";

export default function LocalTime({ hour, min }) {
  let nextDay = false;
  if (hour >= 24) {
    hour = hour % 24;
    nextDay = true;
  }
  let time = moment().hour(hour).minute(min).format("hh:mm a");
  let result = `${time}${nextDay ? "(Next Day)" : ""}`;
  return <>{result}</>;
}
