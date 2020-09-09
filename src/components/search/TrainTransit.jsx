import React from "react";
import style from "../../style/searchStyle.module.css";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import { timeDuration } from "../fragments/TimeDuration";

export default function TrainTransit({ station, waitTime }) {
  return (
    <div>
      <hr />
      <div className={style.switchAt}>
        <p>
          <DirectionsWalkIcon />
          Switch at {station} (Wait time: {timeDuration(waitTime)})
        </p>
      </div>
      <hr />
    </div>
  );
}
