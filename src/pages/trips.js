import React, { useState, useEffect } from "react"
import { Link } from 'gatsby'
import Layout from '../components/layout'
import Image from '../components/Image'
import pageStyles from "./pageStyles.module.css"
import tripStyles from "./tripStyles.module.css"


function ordinal_suffix_of(i) {
 var j = i % 10,
     k = i % 100;
 if (j == 1 && k != 11) {
     return i + "st";
 }
 if (j == 2 && k != 12) {
     return i + "nd";
 }
 if (j == 3 && k != 13) {
     return i + "rd";
 }
 return i + "th";
}

function makeDate(e) {
  const monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
   let dateParts
   dateParts = e.split("-");
   let jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
   jsDate =  `${ordinal_suffix_of(jsDate.getDate())} ${monthNames[jsDate.getMonth()]} ${jsDate.getFullYear()}`
   return jsDate
 }

export default function Trips() {

  const [items, setItems] = useState([])
  //const [events, setEvents] = useState([])

  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null);

  useEffect(() => {
  fetch(`https://fathomless-reaches-05046.herokuapp.com/Trips`)
    .then(res => res.json())
    .then(
      (result) => {
        setItems(result.results);
        setIsLoaded(true);

      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    )
  }, [])

/*
  const trips = items.sort((a, b) => a.Date.localeCompare(b.Date)).reverse()
  .filter((v,i,a)=>a.findIndex(t=>(t.TripID === v.TripID))===i)
  .map((trip, key) => (
   <div>
       <div><Link to={`/trips/${trip.TripID}`}>{trip.Name}</Link> {items.sort((a, b) => a.Date.localeCompare(b.Date)).reverse().filter(item => item.TripID === trip.TripID)[0].Date}</div>
       {items.sort((a, b) => a.Date.localeCompare(b.Date)).filter(a => a.Name === trip.Name).map((x)=>(
         <li key={x.EventName}>{x.EventName}</li>
       ))}
   </div>
  ))

  const eventList = events.sort((a, b) => a.Date.localeCompare(b.Date)).reverse().map(item => <div><Link to={`/events/${item.EventID}`}>{item.Name}</Link> - {item.Date}</div>)


  return (
    <Layout>
      <div className={pageStyles.content}>
        <h1>Trips</h1>
        {trips}
        <h1>Events</h1>
        {eventList}
      </div>
    </Layout>
  )
}
*/

const trips = items.sort((a, b) => a.Date.localeCompare(b.Date)).reverse()
.filter((v,i,a)=>a.findIndex(t=>(t.TripID === v.TripID))===i)
.map((trip, key) => (
 <div>
     <div><Link to={`/trips/${trip.TripID}`}>{trip.Name}</Link> {makeDate(items.sort((a, b) => a.Date.localeCompare(b.Date)).reverse().filter(item => item.TripID === trip.TripID)[0].Date)}</div>
</div>))

return (
  <Layout>
    <div className={pageStyles.content}>
      <h1>Trips</h1>
      {trips}
    </div>
  </Layout>
)
}
