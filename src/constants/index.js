const SORTS = {
  SORT_HIGH_TO_LOW: "SORT_HIGH_TO_LOW",
  SORT_LOW_TO_HIGH: "SORT_LOW_TO_HIGH",
  SORT_NEWEST_TO_OLDEST: "SORT_NEWEST_TO_OLDEST",
  SORT_OLDEST_TO_NEWEST: "SORT_OLDEST_TO_NEWEST",
}

const FILTERS = {
  FILTER_LOW_PRIORITY: 4,
  FILTER_MEDIUM_PRIORITY: 3,
  FILTER_HIGH_PRIORITY: 2,
}

const PRIORITIES = {
  high: 2,
  medium: 3,
  low: 4,
  none: 10,
}

const TASK_TYPE = {
  REMINDER: "reminder",
  DELEGATE: "delegate",
  NOTIFY: "notify",
}

export {
  SORTS,
  FILTERS,
  PRIORITIES,
  TASK_TYPE,
};
