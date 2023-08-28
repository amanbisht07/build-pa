import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ChairamInboxMeeting,
  getAllComments,
  getuserAttendee,
} from "app/redux/actions/GetInboxDataAction";
import Cookies from "js-cookie";

import "../index.css";
import { useTranslation } from "react-i18next";

import ChairmanInbox from "../InboxTableDetails/ChairmanInbox";
import AttendeeInbox from "./AttendeeInbox";

const MeetingId = createContext();
const HandleClosebtn = createContext();

function GetMeetingDetails() {
  const dispatch = useDispatch();

  // const [userRejects, setuserReject] = React.useState(false);
  const meetingID = Cookies.get("MeetingId");

  //=================commentapiData====================

  const getcomments = () => {
    dispatch(getAllComments(meetingID)), [];
  };

  useEffect(() => {
    getcomments();
  }, []);

  useEffect(() => dispatch(ChairamInboxMeeting(meetingID)), []);
  const chairamInboxmeeting = useSelector(
    (state) => state.chairManMeeting.chairmanMeeting
  );
  const loading = useSelector(
    (state) => state.chairManMeeting.loading
  );

  console.log(loading,'sdzgdixk')

  console.log(chairamInboxmeeting);
  const UserAttendees = () => {
    dispatch(getuserAttendee(meetingID)), [];
  };

  useEffect(() => {
    UserAttendees();
  }, []);

  const getAttendeeDetails = useSelector(
    (state) => state.UserAttendee.attendee
  );
  console.log(getAttendeeDetails);


  
  //================= end  userAttendees====================


  return (
    <>
    {loading?<Loading/>:null}
      {chairamInboxmeeting && chairamInboxmeeting.chairmanStatus === null ? (
        <ChairmanInbox meetingID={meetingID} />
      ) : (
        <AttendeeInbox meetingID={meetingID} />
      )}
    </>
  );
}

export { MeetingId, HandleClosebtn };
export default GetMeetingDetails;
