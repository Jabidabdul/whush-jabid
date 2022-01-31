import BackButtonIcon from "../../../assets/v2assets/back-icon.svg";
import React, {useEffect, useState} from "react";
import {fetchDraftTasks, removeDraftedTask} from "./services";
import {WhooshIcons} from "../../../assets";
import './DraftTasksPage.css';

export default function DraftTasksPage({onClickDraftTask, onClosePage, ...props}) {
  const [drafts, setDrafts] = useState();

  useEffect(() => {
    fetchDraftTasks({setDraftTasks: setDrafts})
  }, [])

  const handleRemoveDraftedTask = (id) => {
    removeDraftedTask(id).then(r => fetchDraftTasks({setDraftTasks: setDrafts}))
  }

  return <div className="page-content-padding create-task-page">
    <div className="top-bar">
      <div className="top-bar__back-button" onClick={onClosePage}>
        <img className="top-bar__back-button__img" src={BackButtonIcon} />
      </div>
      <div className="top-bar__title">Draft Tasks</div>
    </div>

    {drafts && drafts.map((draft, index) => {
      return <div key={index} className="draft">
        <div className="draft__flex">
          <div onClick={() => onClickDraftTask(draft)}>
            <div className="draft__title">{draft.taskDetails || "No Title"}</div>
            <div className="draft__label-name">{draft.labelName || "No Label"}</div>
          </div>
          <img
            src={WhooshIcons.DeleteIcon}
            className="button-animate" style={{marginRight: 10}}
            onClick={() => handleRemoveDraftedTask(draft.id)}
          />
        </div>
        <div style={{height: 1, width: '100%', backgroundColor: '#D9DBE9', marginTop: 8}}/>
      </div>
    })}
  </div>
}
