export const selectTasks = (state) => {
  return state.tasks;
};

export const selectNewTask = (state) => {
  return state.newTask;
};

export const selectIsLoggedIn = (state) => {
  return state.isLoggedIn;
};

export const selectHasAccount = (state) => {
  return state.hasAccount;
};

export const selectTaskInEditing = (state) => {
  return state.taskInEditing;
};

export const selectGoogleCalendarTasks = (state) => {
  return state.googleCalendarTasks;
};

export const selectOpenTask = (state) => {
  return state.openTask;
};

export const selectIsShareExtensionModalOpen = (state) => {
  return state.isShareExtensionModalOpen;
};

export const selectIsRevokeGoogleCalendarModalOpen = (state) => {
  return state.isRevokeGoogleCalendarModalOpen;
};

export const selectRevokeCalendarId = (state) => {
  return state.revokeCalendarId;
};

export const selectIsUserProfileSettingOpen = (state) => {
  return state.isUserProfileSettingOpen;
};

export const selectActiveUserProfileMenu = (state) => {
  return state.activeUserProfileMenu;
};

export const selectDraftedTasks = (state) => {
  return state.draftedTasks;
};

export const selectIsTaskDrafted = (state) => {
  return state.isTaskDrafted;
};

export const selectIsDraftedTaskOpen = (state) => {
  return state.isDraftedTaskOpen;
};
