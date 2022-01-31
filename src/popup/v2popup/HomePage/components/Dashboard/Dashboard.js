import DashboardBackground from "../../../../../assets/v2assets/dashboard-background.png";
import StatusLightRed from "../../../../../assets/v2assets/status-light-red.png";
import DashboardBadge from "../../../../../assets/v2assets/dashboard-badge.svg";
import React from "react";
import './dashboard.css';

export default function Dashboard(props) {
  const dateNow = new Date();

  function getDashboardTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    return `${hours}:${minutes} ${ampm} - ${date.toDateString()}`;
  }

  return (
    <div className="dashboard">
      <div className="bg-pattern-card">
        <img
          className="union"
          src={DashboardBackground}
        />
      </div>
      <div className="status">
        <img
          className="status-light-img"
          src={StatusLightRed}
        />
        <p style={{textAlign:'center', verticalAlign: 'middle', margin: 0}}>BUSY</p>
      </div>
      <div className="frame-188">
        <p className="dashboard-time-text">
          {getDashboardTime()}
        </p>
        <div className="frame-181">
          <div className="frame-187">
            <GoldBadge />
            <p className="dashboard-text-primary">
              {`You are in Top ${5}% of productive users`}
            </p>
          </div>
          <div className="dashboard-text-primary">
            Your tasks
          </div>
          <div className="task-counter-card-container">
            <TaskCounterCard title="Remaining" number={props.remainingTasksCount || 0}/>
            <TaskCounterCard title="Completed" number={props.completedTasksCount || 0} className="second-card"/>
            <TaskCounterCard title="Total" number={props.totalTasksCount || 0} className="third-card"/>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoldBadge() {
  return (
    <img
      className="mask-group badge-animation"
      src={DashboardBadge}
    />
  );
}

function TaskCounterCard({title, number, className}) {
  return (
    <div className={`task-counter-card ${className || ""}`}>
      <div className="task-counter-card-title">
        {title}
      </div>
      <div className="task-counter-card-number">
        {number}
      </div>
    </div>
  );
}
