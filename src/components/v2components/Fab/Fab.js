import {WhooshIcons} from '../../../assets';
import './fab.css';
import {useEffect, useState} from "react";

const {FabIcon, FabOptionNewTask, FabOptionDraftTask} = WhooshIcons;

export default function Fab({overlay, setOverlay, setDraftsPageOpen, handleCreateNewTask}) {
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    overlay || setShowOptions(false);
  }, [overlay])

  useEffect(() => {
    setOverlay(showOptions)
  }, [setOverlay, showOptions])

  const handleDraftsButton = () => {
    setOverlay(false);
    setDraftsPageOpen(true);
  }

  const handleNewTaskButton = () => {
    setOverlay(false);
    handleCreateNewTask();
  }

  return <div className="fab-container">
    <div className="fab-option-container" style={{display: showOptions ? undefined : 'none'}}>
      <div className="fab-option" onClick={handleDraftsButton}>
        <div className="fab-text">Drafts</div>
        <div className="fab-icon-img-container">
          <img src={FabOptionNewTask} className="fab-icon-img" />
        </div>
      </div>
      <div className="fab-option" onClick={handleNewTaskButton}>
        <div className="fab-text">New Task</div>
        <div className="fab-icon-img-container">
          <img src={FabOptionDraftTask} className="fab-icon-img" />
        </div>
      </div>
    </div>
    <img
      onClick={() => setShowOptions(!showOptions)}
      src={FabIcon}
      className="fab-icon"
      style={{transform: showOptions ? 'rotateZ(45deg) scale(1.1)' : undefined}}
    />
  </div>
}
