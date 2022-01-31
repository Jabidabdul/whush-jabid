import React, {useEffect, useState} from 'react';
import {Navbar, TaskView, Fab} from "../../../components/v2components";
import {Dashboard, Search} from './components';
import './home-page.css';
import {FILTERS, SORTS} from "../../../constants";
import {CloseCircleOutlined} from "@ant-design/icons";

const FILTER_TEXT = {
  [FILTERS.FILTER_LOW_PRIORITY]: "Low Priority",
  [FILTERS.FILTER_MEDIUM_PRIORITY]: "Medium Priority",
  [FILTERS.FILTER_HIGH_PRIORITY]: "High Priority",
}

const SORTS_TEXT = {
  [SORTS.SORT_HIGH_TO_LOW]: "High To Low Priority",
  [SORTS.SORT_LOW_TO_HIGH]: "Low To High Priority",
  [SORTS.SORT_OLDEST_TO_NEWEST]: "Oldest First",
  [SORTS.SORT_NEWEST_TO_OLDEST]: "Newest First",
}

function HomePage({
                    futureTasks,
                    currentTasks,
                    overdueTasks,
                    delegatAndNotifiedTasks,
                    draftedTasks,
                    googleCalendarTasks,
                    setOverlay,
                    overlay,
                    setDraftsPageOpen,
                    handleCreateNewTask,
                    googleCalendarColors,
                    ...props
                  }) {

  const [totalTasksCount, setTotalTasksCount] = useState(null);
  const [remainingTasksCount, setRemainingTasksCount] = useState(null);
  const [completedTasksCount, setCompletedTasksCount] = useState(null);

  const [sort, setSort] = useState(null);
  const [filters, setFilters] = useState([]);
  const [search, setSearch] = useState("");
  const [searchRange, setSearchRange] = useState(null);

  useEffect(() => {
    props.setOnHomePage && props.setOnHomePage(true);
    return () => props.setOnHomePage && props.setOnHomePage(false);
  })

  useEffect(() => {
    setTotalTasksCount((currentTasks && currentTasks.length) || 0)
    setRemainingTasksCount((currentTasks && currentTasks.filter(t => t.status === "active").length) || 0)
    setCompletedTasksCount((currentTasks && currentTasks.filter(t => t.status !== "active").length) || 0)
  }, [currentTasks])

  return (
    <div>
      <Fab {...{
        setOverlay, overlay, setDraftsPageOpen, handleCreateNewTask,
      }}/>
      <div className="main-container">
        <Dashboard {...{completedTasksCount, remainingTasksCount, totalTasksCount}}/>
        <Search {...{search, setSearch, sort, setSort, filters, setFilters, searchRange, setSearchRange}}/>
        {filters && filters.length > 0 && <div className="main-container__search-options">
          <div>
            {filters.map(filter => <div>{FILTER_TEXT[filter]}</div>)}
          </div>
          <CloseCircleOutlined className="main-container__search-options__close-button button-animate" onClick={() => setFilters([])} />
        </div>}
        {sort && <div className="main-container__search-options">
          <div>
            {SORTS_TEXT[sort]}
          </div>
          <CloseCircleOutlined className="main-container__search-options__close-button button-animate" onClick={() => setSort(null)} />
        </div>}
        {searchRange && <div className="main-container__search-options">
          <div>{`${new Date(searchRange[0]).toDateString()} - ${new Date(searchRange[1]).toDateString()}`}</div>
          <CloseCircleOutlined className="main-container__search-options__close-button button-animate" onClick={() => setSearchRange(null)} />
        </div>}
        <TaskView {...{
          futureTasks,
          currentTasks,
          overdueTasks,
          delegatAndNotifiedTasks,
          draftedTasks,
          googleCalendarTasks,
          googleCalendarColors,
          sort, search, filters, searchRange, ...props}} />
      </div>
    </div>
  );
}

export default HomePage;
