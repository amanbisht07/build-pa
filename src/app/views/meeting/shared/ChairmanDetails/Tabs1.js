import Tabs from "./ChairmanMeetingDetailsTab";

import AttendingTable from "./AttendingTable";
import AgendaTable from "./AgendaTable";
import ChairmanComment from "./ChairmanComment";
import UserMeetingDetailsTable from "../userAttendee/UserMeetingDetailsTable";


function GetMeetingDetails() {
  const tabs = [
    {
      label: "Attending",
      Component: (
        <div>
          <AttendingTable />
        </div>
      ),
    },

    {
      label: "Agenda",
      Component: <AgendaTable />,
    },
    {
      label: "Comments",
      Component: <ChairmanComment />,
    },
  ];

  const tabs1 = [
    {
      label: "Attending",
      Component: (
        <div>
          <UserMeetingDetailsTable />
        </div>
      ),
    },

    {
      label: "Agenda",
      Component: <AgendaTable />,
    },
  ];

  return (
    <div>
      <Tabs tabs={tabs} tabs1={tabs1} />
    </div>
  );
}

export default GetMeetingDetails;
