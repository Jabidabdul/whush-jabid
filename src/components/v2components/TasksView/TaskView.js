import './task-view.css';
import Task from "./Task";
import OverdueTaskView from "./OverdueTaskView";
import {useEffect, useState} from "react";
import {SORTS, FILTERS, PRIORITIES} from "../../../constants";
import { SyncOutlined } from "@ant-design/icons";
import {fetchGoogleCalendarTasks} from "../../../actions/actions";
import {message} from "antd";
import {useDispatch} from "react-redux";


export default function TaskView({
                                   currentTasks,
                                   futureTasks,
                                   overdueTasks,
                                   delegatAndNotifiedTasks,
                                   draftedTasks,
                                   googleCalendarTasks,
                                   googleCalendarColors,
                                   sort, search, filters, searchRange, ...props}) {

  const [yourTasks, setYourTasks] = useState([]);
  const [yourOverdueTasks, setYourOverdueTasks] = useState([]);

  const [delegatedTasks, setDelegatedTasks] = useState([]);
  const [delegatedOverdueTasks, setDelegatedOverdueTasks] = useState([]);

  const [calendarSynced, setCalendarSynced] = useState(false);
  const dispatch = useDispatch();

  // 0 -> Your Tasks   1-> Delegated Tasks
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    /*
    Combine current future and google calendar tasks
    search
    filter
    sort
    and then use the data
     */

    let yourTasksData = [];
    let yourOverdueTasksData = [];
    let delegatedTasksData = [];

    yourTasksData = yourTasksData.concat(currentTasks, futureTasks, googleCalendarTasks);
    yourOverdueTasksData = yourOverdueTasksData.concat(overdueTasks);
    delegatedTasksData = delegatedTasksData.concat(delegatedTasks);


    //search
    if(search && yourTasksData) {
      const filterWithSearch = (task) => {
        let searchIn = "";
        searchIn = searchIn + ((task.taskDetails || task["event_summary"]) || "");
        return !!searchIn && searchIn.toLowerCase().includes(search.trim().toLowerCase());
      }
      yourTasksData = yourTasksData.filter(filterWithSearch);
      yourOverdueTasksData = yourOverdueTasksData.filter(filterWithSearch);
      delegatedTasksData = delegatedTasksData.filter(filterWithSearch);
    }

    // Filter
    if(filters && filters.length > 0 && yourTasksData) {
      yourTasksData = yourTasksData.filter(task => task.priority && filters.includes(task.priority));
      yourOverdueTasksData = yourOverdueTasksData.filter(task => task.priority && filters.includes(task.priority));
      delegatedTasksData = delegatedTasksData.filter(task => task.priority && filters.includes(task.priority));
    }

    // Date Filter
    if(searchRange && yourTasksData) {
      const taskDateFilter = (task) => {
        const taskDate = new Date(task["start_time"] || `${task.date || ""} ${task.time || ""} `);
        return taskDate <= new Date(searchRange[1]) && taskDate >= new Date(searchRange[0]);
      }
      yourTasksData = yourTasksData.filter(taskDateFilter);
      yourOverdueTasksData = yourOverdueTasksData.filter(taskDateFilter);
      delegatedTasksData = delegatedTasksData.filter(taskDateFilter);
    }

    // sort
    if(yourTasksData) {
      const taskSortCompareFunction = (a, b) => {
        // whush tasks have 'date' but calendar tasks have 'start_time'
        // calendar time is utc but whush task date time is IST
        let aTime = new Date(a["start_time"] || `${a.date || ""} ${a.time || ""}`);
        let bTime = new Date(b["start_time"] || `${b.date || ""} ${b.time || ""}`);
        let timeDiff = bTime - aTime;
        let priorityScore = {
          [PRIORITIES.high]: 3,
          [PRIORITIES.medium]: 2,
          [PRIORITIES.low]: 1,
          [PRIORITIES.none]: null,
        }
        if(sort === SORTS.SORT_NEWEST_TO_OLDEST || !sort) {
          return -timeDiff
        } else if(sort === SORTS.SORT_OLDEST_TO_NEWEST) {
          return timeDiff
        } else if (sort === SORTS.SORT_HIGH_TO_LOW) {
          return priorityScore[b.priority || -10] - priorityScore[a.priority || -10]
        } else if (sort === SORTS.SORT_LOW_TO_HIGH) {
          return priorityScore[a.priority || -10] - priorityScore[b.priority || -10]
        } else {
          return 0;
        }
      }
      yourTasksData = yourTasksData.sort(taskSortCompareFunction)
      yourOverdueTasksData = yourOverdueTasksData.sort(taskSortCompareFunction);
      delegatedTasksData = delegatedTasksData.sort(taskSortCompareFunction);
    }


    setYourTasks(yourTasksData);
    setYourOverdueTasks(yourOverdueTasksData);
    setDelegatedTasks(delegatedTasksData);

  }, [
    futureTasks, currentTasks, overdueTasks, delegatAndNotifiedTasks, draftedTasks, googleCalendarTasks,
    sort, search, filters, searchRange,
  ])


  const DelegatedTasksView = ({tasks, overdueTasks, sort, onClickEditTask}) => {
    let data = [];

    if(sort === SORTS.SORT_LOW_TO_HIGH || sort === SORTS.SORT_HIGH_TO_LOW) {
      data = groupTasksWithPriority(tasks);
    } else {
      data = groupTasksWithDate(tasks);
    }

    return <div className="task-view-container">
      {/*<OverdueTaskView onClickEditTask={onClickEditTask}/>*/}
      {data && data.map((taskGroup, index) => {
        return <TaskGroup key={index} {...taskGroup} onClickEditTask={onClickEditTask} />
      })}
    </div>
  }

  const YourTasksView = ({sort, tasks, overdueTasks, onClickEditTask}) => {
    let data = [];

    if(sort === SORTS.SORT_LOW_TO_HIGH || sort === SORTS.SORT_HIGH_TO_LOW) {
      data = groupTasksWithPriority(tasks);
    } else {
      data = groupTasksWithDate(tasks);
    }

    return <div className="task-view-container">
      <OverdueTaskView tasks={overdueTasks} onClickEditTask={onClickEditTask}/>
      {data && data.map((taskGroup, index) => {
        return <TaskGroup key={index} onClickEditTask={onClickEditTask} {...taskGroup} />
      })}
    </div>
  }

  const TaskGroup = ({groupName, items, onClickEditTask}) => {

    return <div className="task-group-container">
      <p>{groupName}</p>
      {/*<p className="task-group-text-small">{"  (TODAY)"}</p>*/}
      {items && items.map((task, index) => {
        return <Task key={task.id} {...task} onClickEditTask={onClickEditTask} googleCalendarColors={googleCalendarColors} />
      })}
    </div>
  }


  const handleRefreshCalendarTasks = () => {
    if(calendarSynced) return;
    fetchGoogleCalendarTasks(dispatch, "true");
    message.success("Successfully refreshed calendar(s)!");
    setCalendarSynced(true);
  };


  return(
    <div className="tasks-container">
      <div className="tabs-container">
        <div
          className={`tab${activeTab === 0 ? ' active-tab' : ""}`}
          style={{marginRight: 25}}
          onClick={() => setActiveTab(0)}
        >
          Your Tasks
          <div style={{visibility: activeTab === 0 ? 'visible' : 'hidden'}} className="tab-underline-div" />
        </div>
        <div
          className={`tab${activeTab === 1 ? ' active-tab' : ""}`}
          style={{marginRight: 25}}
          onClick={() => setActiveTab(1)}
        >
          Delegated Tasks
          <div style={{visibility: activeTab === 1 ? 'visible' : 'hidden'}} className="tab-underline-div" />
        </div>
        <div
          className={`tab ${!calendarSynced ? "tab--refresh-calendar" : ""}`}
          style={{color: calendarSynced ? "lightgray": undefined}}
          onClick={handleRefreshCalendarTasks}
        >
          <SyncOutlined />
          {" Calendar"}
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 0 ?
          <YourTasksView
            tasks={yourTasks}
            overdueTasks={yourOverdueTasks}
            sort={sort}
            onClickEditTask={props.onClickEditTask}
          /> :
          <DelegatedTasksView
            tasks={delegatedTasks}
            overdueTasks={delegatedOverdueTasks}
            sort={sort}
            onClickEditTask={props.onClickEditTask}
          />
        }
      </div>
    </div>
  );
}



const groupTasksWithDate = (tasks) => {
  const getCustomStringDate = (item) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    let d = new Date(item["start_time"] || `${item.date || ""} ${item.time || ""}`)
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`
  }

  const data = [];

  tasks.map(item => {
    let date = getCustomStringDate(item)
    if (data.length > 0 && data[data.length - 1].groupName === date) {
      data[data.length - 1].items.push(item)
    } else {
      data.push({groupName: date, items: [item,]})
    }
  })
  return data;
}

const groupTasksWithPriority = (tasks) => {
  let priorityGroupText = {
    [PRIORITIES.low]: "Low",
    [PRIORITIES.medium]: "Medium",
    [PRIORITIES.high]: "High",
    [PRIORITIES.none]: "None",
  }

  let data = []
  tasks.map(item => {
    let priority = priorityGroupText[item.priority];
    if(data.length > 0 && data[data.length-1].groupName === priority) {
      data[data.length-1].items.push(item)
    } else {
      data.push({groupName: priority, items: [item, ]})
    }
  })
  return data;
}
