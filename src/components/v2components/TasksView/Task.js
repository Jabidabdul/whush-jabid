import {useEffect, useState} from "react";
import {WhooshIcons} from "../../../assets";
import {PRIORITIES} from "../../../constants";
import {fromBase64} from "js-base64";
import {FetchTasks} from "../../../actions/actions";
import {useDispatch} from "react-redux";
import chrome from '../../chrome';
import {message} from "antd";


export default function Task (props) {
  const dispatch = useDispatch();
  const [taskTime, setTaskTime]  = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [priority, setPriority] = useState(props.priority || PRIORITIES.none);
  const [description, setDescription] = useState("");
  const [calendarTask, setCalendarTask] = useState(false);
  const [status, setStatus] = useState(props.status);
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    updateTaskStatus(props.id, newStatus);
  }

  const updateTaskStatus = async (taskId, status) => {
    console.log("Delete the other task  : " + taskId, status);
    await chrome.storage.sync.get(["accessToken"], function (r) {
      const token = r.accessToken;
      const UPDATE_TASK_URL = "https://whush.pro/api/api/taskstatus";
      fetch(UPDATE_TASK_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ id: taskId, status: status }),
      }).then((data) => {
        handleRefreshTasksList();
      });
    });
  };
  const handleRefreshTasksList = () => {
    FetchTasks(dispatch);
  };

  const [attachment, setAttachment] = useState()

  useEffect(() => {
    setCalendarTask("start_time" in props);
    if("date" in props || "start_time" in props) {
      setTaskTime(new Date(props["start_time"] || `${props.date || ""} ${props.time || ""}`))
    }

    if(props.description) {
      fetch(props.description).then(res => {
        res.text().then(base64Description => setDescription(fromBase64(base64Description)))
      })
    }
  }, [])

  const prioritySpecificColors = {
    [PRIORITIES.none]: {
      backgroundColor: '#EFF0F7',
      color: '#383838',
    },
    [PRIORITIES.low]: {
      backgroundColor: 'rgba(51, 219, 255, 0.2)',
      color: '#2AB1FC',
    },
    [PRIORITIES.medium]: {
      backgroundColor: 'rgba(255, 212, 69, 0.2)',
      color: '#FEB910',
    },
    [PRIORITIES.high]: {
      backgroundColor: 'rgba(254, 165, 159, 0.2)',
      color: '#F8392A',
    },
  }

  const backgroundColor = expanded ? prioritySpecificColors[priority].backgroundColor || undefined : undefined;

  return <div className="task-container" style={{backgroundColor}}>
    <div className="tasks">
      <div className="task-label-color-div" style={{backgroundColor: prioritySpecificColors[priority].color}} />
      <div className="task-data-container">
        <div className="task-data-container__input-select">
          <img
            className="button-animate"
            style={{height: 26, width: 26, marginTop: 5, marginRight: 6}}
            src={status === "done" ? WhooshIcons.SelectChecked : WhooshIcons.SelectUnchecked}
            onClick={() => handleStatusChange(status === "done" ? "active" : "done")}
          />
        </div>
        <div className="task-data">
          <div className="click-to-expand-div" onClick={() => setExpanded(!expanded)}>
            <div className="task-data-heading">
              <div>{props.taskDetails || props["event_summary"] || "No Title"}</div>
              <img src={WhooshIcons.CalendarBlue} style={{visibility: "start_time" in props ? "visible" : "hidden"}} /*see if calendar task*//>
            </div>
            <div className="task-detail-container">
              <div>
                {calendarTask ? "Calendar Event" : (props.label || "No Label")}
              </div>
              <div>
                {!!taskTime ?
                  `${taskTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} ` +
                  `${taskTime.getDate()}/${taskTime.getMonth()}/${taskTime.getFullYear()}`
                  : "All Day"
                }
              </div>
            </div>
          </div>

          <div className="expanded-task-info" style={{display: expanded ? undefined : 'none'}}>
            <div
              style={{color: prioritySpecificColors[priority].color, display: props["meeting_link"] ? undefined : "none"}}
              className="task-data__join-meeting"
            >
              <a style={{color: 'inherit', textDecoration: 'none'}} target="_blank" href={props["meeting_link"]} className="task-data__join-meeting__label">Join Meeting</a>
            </div>

            <div className="task-description">
              {description && description.replace(/<[^>]+>/g, '')}
            </div>
            <div className="expanded-task-info__delegated-email">
              {props.assignedTo || ""}
            </div>
            <div className="expanded-task-info__task-attachment-options">
              <div
                style={{color: prioritySpecificColors[priority].color, visibility: props.attachment ? "visible": "hidden"}}
                className="expanded-task-info__task-attachment-options__label"
              >
                <img src={WhooshIcons.AttachIcon} className="task-attach-icon" style={{marginRight: 5}}/>
                Attachment
              </div>
              <div>
                <img
                  src={WhooshIcons.DeleteIcon}
                  className="button-animate" style={{marginRight: 15}}
                  onClick={() => message.info("Delete not available")}
                />
                <img
                  onClick={() => calendarTask ? message.info("Edit not available on this task!"): props.onClickEditTask(props)}
                  src={WhooshIcons.EditIcon}
                  className="button-animate"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}
