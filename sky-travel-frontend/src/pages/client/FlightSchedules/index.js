import React, { useEffect, useState } from "react";
import useGeneral from "../../../hooks/useGeneral";
import ScheduleCard from "./components/ScheduleCard";
import SearchBar from "./components/SearchBar";
import moment from "moment";
import { calcTimeDiff } from "../../../helpers/funcs";

const FlightSchedules = () => {
  const { getFilteredSchedules, getAllAirLines } = useGeneral();
  const [schedules, setSchedules] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [filteredAirlines, setFilteredAirlines] = useState([]);
  const [filters, setFilters] = useState({
    stops: [],
    airlines: [],
  });

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    let filtSchds = schedules.filter(sd => {
      let stopsFilter = false;
      let airlinesFilter = false;
      if (filters.stops.length < 1) stopsFilter = true;
      else {
        let direct =
          filters.stops.includes("direct") && sd?._route?.stops?.length < 1;
        let multiple =
          filters.stops.includes("multiple") && sd?._route?.stops?.length > 0;
        stopsFilter = direct || multiple;
      }
      if (filters.airlines.length < 1) airlinesFilter = true;
      else {
        airlinesFilter = filters.airlines.some(al => {
          return al === sd._airline._id;
        });
      }

      return stopsFilter && airlinesFilter;
    });

    setFilteredAirlines([...filtSchds]);
  }, [filters]);

  const getInitialData = async () => {
    const [schedulesRes, airlinesRes] = await Promise.all([
      getFilteredSchedules(),
      getAllAirLines(),
    ]);
    if (schedulesRes) setSchedules([...schedulesRes.schedules]);
    if (airlinesRes) setAirlines([...airlinesRes.airlines]);
  };

  const filterChangeHandler = (event, val) => {
    const { name } = event.target;

    if (name === "stops") {
      if (val === "All") filters.stops = [];
      else if (filters.stops.includes(val)) {
        let index = filters.stops.findIndex(st => st === val);
        filters.stops.splice(index, 1);
      } else {
        filters.stops.push(val);
        filters.stops = [...new Set(filters.stops)];
      }
    } else if (name === "airlines") {
      if (val === "All") filters.airlines = [];
      else if (filters.airlines.includes(val)) {
        let index = filters.airlines.findIndex(al => al === val);
        filters.airlines.splice(index, 1);
      } else {
        filters.airlines.push(val);
        filters.airlines = [...new Set(filters.airlines)];
      }
    }
    setFilters(pS => ({
      ...pS,
    }));
  };

  let data =
    filters.stops.length > 0 || filters.airlines.length > 0
      ? filteredAirlines
      : schedules;
console.log("data", data)
  return (
    <div className='flightSchedules'>
      <SearchBar setSchedules={setSchedules} />
      <div className='flightSchedules__content'>
        <div className='flightSchedules__content__left'>
          <h3>Filters</h3>
          <span>{data.length} results found!</span>

          <div className='flightSchedules__content__left__filter'>
            <h4>Stops</h4>
            <div className='flightSchedules__content__left__filter__item'>
              <input
                type='checkbox'
                name='stops'
                id='stops_all'
                onChange={e => filterChangeHandler(e, "All")}
                checked={filters.stops.length < 1}
              />
              <label htmlFor='direct'>All</label>
            </div>
            <div className='flightSchedules__content__left__filter__item'>
              <input
                type='checkbox'
                name='stops'
                id='stops_direct'
                onChange={e => filterChangeHandler(e, "direct")}
                checked={filters.stops.includes("direct")}
              />
              <label htmlFor='direct'>Direct</label>
            </div>
            <div className='flightSchedules__content__left__filter__item'>
              <input
                type='checkbox'
                name='stops'
                id='stops_multiple'
                onChange={e => filterChangeHandler(e, "multiple")}
                checked={filters.stops.includes("multiple")}
              />
              <label htmlFor='MultipleStops'>Multiple Stops</label>
            </div>
          </div>
          <div className='flightSchedules__content__left__filter'>
            <h4>Airlines</h4>
            <div className='flightSchedules__content__left__filter__item'>
              <input
                type='checkbox'
                name='airlines'
                id='airlines_all'
                onChange={e => filterChangeHandler(e, "All")}
                checked={filters.airlines.length < 1}
              />
              <label htmlFor='airlines_all'>All Airlines</label>
            </div>
            {airlines.map(al => (
              <div
                className='flightSchedules__content__left__filter__item'
                key={al._id}
              >
                <input
                  type='checkbox'
                  name='airlines'
                  id={al._id}
                  onChange={e => filterChangeHandler(e, al._id)}
                  checked={filters.airlines.includes(al._id)}
                />
                <label htmlFor={al._id}>{al.name}</label>
              </div>
            ))}
          </div>
        </div>
        <div className='flightSchedules__content__right'>
          <h2>Flights</h2>
          {data.map(sd => (
            <ScheduleCard
              key={sd._id}
              _keyid = {sd?._id}
              airlineImage={sd?._airline?.image}
              departure={`${sd?._route?.departure?.city}, ${sd?._route?.departure?.country}`}
              destination={`${sd?._route?.destination?.city}, ${sd?._route?.destination?.country}`}
              date={moment(sd?.departureTime).format("MM-DD-YYYY")}
              departureTime={moment(sd?.departureTime).format("h:mm a")}
              arrivalTime={moment(sd?.arrivalTime).format("h:mm a")}
              timeDifference={calcTimeDiff(sd?.arrivalTime, sd?.departureTime)}
              economyPrice = {sd?._route?.economyPricing}
              businessPrice = {sd?._route?.businessPricing}
              firstClassPrice = {sd?._route?.firstClassPricing}
              economyAvailable = {sd?._flight?.economyAvailable}
              businessAvailable = {sd?._flight?.businessAvailable}
              firstClassAvailable = {sd?._flight?.firstClassAvailable}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightSchedules;
