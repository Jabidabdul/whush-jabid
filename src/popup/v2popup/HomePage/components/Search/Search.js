import React, {useEffect, useState} from 'react';
import { Input, DatePicker } from "antd";
import locate from 'antd/lib/locale/hi_IN';
import {SORTS, FILTERS} from "../../../../../constants";
import SearchIcon from '../../../../../assets/v2assets/search-icon.svg';
import FilterIcon from '../../../../../assets/v2assets/filter-icon.svg';
import SortIcon from '../../../../../assets/v2assets/sort-icon.svg';
import CalendarIcon from '../../../../../assets/v2assets/calendar-icon.svg';
import RadioUnselected from '../../../../../assets/v2assets/radio-unselected.svg';
import RadioSelected from '../../../../../assets/v2assets/radio-selected.svg';
import SelectChecked from '../../../../../assets/v2assets/tick-square-purple.svg';
import SelectUnchecked from '../../../../../assets/v2assets/untick-square.svg';
import './search.css';

const { RangePicker } = DatePicker;

export default function Search({search, setSearch, sort, setSort, filters, setFilters, dateRange, setSearchRange}) {
  const [openCalendar, setOpenCalendar] = useState(false);
  useEffect(() => {
    if(openCalendar) {
      setOpenSort(false);
      setOpenFilter(false);
    }
  }, [openCalendar])

  const [openSort, setOpenSort] = useState(false);
  useEffect(() => {
    if(openSort) {
      setOpenCalendar(false);
      setOpenFilter(false);
    }
  }, [openSort])

  const [openFilter, setOpenFilter] = useState(false);
  useEffect(() => {
    if(openFilter) {
      setOpenCalendar(false);
      setOpenSort(false);
    }
  }, [openFilter])


  useEffect(() => setOpenSort(false), [sort]);

  return (
    <>
      <div className="search-container">
        <div className="user-input">
          <Input
            className="search-input-field"
            type="email"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            defaultValue={search}
            required
          />
          <img className="search-icon button-animate" src={SearchIcon} />
        </div>
        <div className="search-option-relative">
          <img className="search-options button-animate" src={FilterIcon} onClick={() => setOpenFilter(!openFilter)} />
          <div className="expand-search-calendar" style={{display: openFilter ? undefined: 'none'}}>
            <Filter {...{filters, setFilters}}/>
          </div>
        </div>
        <div className="search-option-relative">
          <img className="search-options button-animate" src={SortIcon} onClick={() => setOpenSort(!openSort)}  />
          <div className="expand-search-calendar" style={{display: openSort ? undefined: 'none'}}>
            <Sort {...{sort, setSort}}/>
          </div>
        </div>
        <div className="search-option-relative">
          <img className="search-options button-animate" src={CalendarIcon} onClick={() => setOpenCalendar(!openCalendar)} />
          <div className="expand-search-calendar">
            <RangePicker
              className="expand-search-calendar__ant-calendar"
              open={openCalendar}
              onChange={(e) => {
                setSearchRange([new Date(e[0]._d), new Date(e[1]._d)])
                setOpenCalendar(false);
              }}
              locate={locate}
              // This below doesn't work
              initialRange={dateRange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

const Filter = ({filters, setFilters}) => {
  const [checked, setChecked] = useState(new Set(filters || []));
  const options = [
    'Low Priority',
    'Medium Priority',
    'High Priority',
  ]

  const keys = [
    FILTERS.FILTER_LOW_PRIORITY,
    FILTERS.FILTER_MEDIUM_PRIORITY,
    FILTERS.FILTER_HIGH_PRIORITY,
  ]

  const onToggleSelection = (val) => {
    const newChecked = new Set(checked);
    newChecked.has(val) ? newChecked.delete(val) : newChecked.add(val);
    setChecked(newChecked);
    setFilters && setFilters([...newChecked]);
  }

  return <div className="expand-search-filter">
    <div className="expand-search-filter-triangle" />
    {options.map((option, index) => {
      return <div key={index} className="expand-search-filter-option" onClick={() => onToggleSelection(keys[index])}>
        <div style={{display: 'flex'}}>
          <img
            src={checked.has(keys[index]) ? SelectChecked : SelectUnchecked }
            style={{height: 21, width: 21, marginRight: 7}}
          />
          <div style={{verticalAlign: 'middle'}}>{option}</div>
        </div>
        <div style={{height: 1, backgroundColor: '#D9DBE9', marginTop: 2}} />
      </div>
    })}
  </div>
}

const Sort = ({sort, setSort}) => {
  const [selected, setSelected] = useState(sort || null);
  const options = [
    'Low to High Priority',
    'High to Low Priority',
    'Newest First',
    'Oldest First'
  ]

  const Keys = [
    SORTS.SORT_LOW_TO_HIGH,
    SORTS.SORT_HIGH_TO_LOW,
    SORTS.SORT_NEWEST_TO_OLDEST,
    SORTS.SORT_OLDEST_TO_NEWEST,
  ]

  const onChangeChoice = (index) => {
    setSelected(index);
    setSort && setSort(Keys[index]);
  }

  const onClear = () => {
    setSelected(null);
    setSort && setSort(null);
  }

  return <div className="expand-search-sort">
    <div className="expand-search-sort-triangle" />
    {options.map((option, index) => {
      return <div key={index} className="expand-search-sort-option" onClick={() => onChangeChoice(index)}>
        <div style={{display: 'flex'}}>
          <img
            src={selected === index ? RadioSelected : RadioUnselected}
            style={{height: 21, width: 21, marginRight: 7}}
          />
          <div style={{verticalAlign: 'middle'}}>{option}</div>
        </div>
        <div style={{height: 1, backgroundColor: '#D9DBE9', marginTop: 2}} />
      </div>
    })}

    <div className="expand-search-sort-option" onClick={onClear}>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{verticalAlign: 'middle'}}>{"X Clear"}</div>
      </div>
      <div style={{height: 1, backgroundColor: '#D9DBE9', marginTop: 2}} />
    </div>
  </div>
}
