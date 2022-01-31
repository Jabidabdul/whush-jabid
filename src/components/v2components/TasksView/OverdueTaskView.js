import './task-view.css';
import Task from "./Task";
import {UpOutlined, DownOutlined} from "@ant-design/icons";
import {useState} from "react";
import {Collapse} from 'react-collapse';

export default function OverdueTaskView({tasks, ...props}) {

  return(
    <div className="overdue-task-view-container">
      <OverdueTaskGroup tasks={tasks} {...props}/>
    </div>
  );
}


const OverdueTaskGroup = ({tasks, onClickEditTask}) => {
  const [show, setShow] = useState(false);

  return <div className="overdue-task-group-container">
    <div className="overdue-task-group-card-main" onClick={() => setShow(!show)}>
      <div className="overdue-text-counter-container">
        <p>Overdue Tasks</p>
        <div className="overdue-task-counter">
          <div>{(tasks && tasks.length) || 0}</div>
        </div>
      </div>
      <div onClick={() => setShow(!show)}>
        {show ? <UpOutlined /> : <DownOutlined />}
      </div>
    </div>
    <Collapse isOpened={show}>
      {tasks && tasks.map((task, index) => {
        return <Task key={task.id} {...task} onClickEditTask={onClickEditTask}/>
      })}
    </Collapse>
  </div>
}

