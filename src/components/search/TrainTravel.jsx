import React from "react";
import style from "../../style/searchStyle.module.css";
import LocalTime from "../fragments/LocalTime";
import TrainIcon from "@material-ui/icons/Train";

export default function TrainTravel({ train, from, to }) {
  let trainUrl = `/schedule/train/${train.id}`;
  let fromStationUrl = `/schedule/station/${from.station}`;
  let toStationUrl = `/schedule/station/${to.station}`;

  const getTrainDesc = (name, from, to) => {
    let displayName = `${from} → ${to}`;
    if (name) {
      displayName = `${name} (${displayName})`;
    }
    return displayName;
  }
  return (
    <div className={style.resultHop}>
      <div className={style.trainTravel}>
        <div>
          <TrainIcon />
          <a href={trainUrl}>
            {`${getTrainDesc(train.name, train.startStation, train.endStation)} `} 
            Train
          </a>
        </div>
      </div>
      <div className={style.stations}>
        <div className={style.station}>
          <p>
            <a href={fromStationUrl}>{from.station}</a>
          </p>
        </div>
        <div className={style.station}>
          <p>
            <a href={toStationUrl}>{to.station}</a>
          </p>
        </div>
      </div>
      <div className={style.separator}>
        <div className={style.nodeDot}></div>
        <div className={style.straightLine}></div>
        <div className={style.dashedLine}></div>
        <div className={style.nodeDot}></div>
      </div>
      <div className={style.times}>
        <div className={style.time}>
          <LocalTime hour={from.hour} min={from.min} />
        </div>
        <div className={style.time}>
          <LocalTime hour={to.hour} min={to.min} />
        </div>
      </div>
    </div>
  );
}
