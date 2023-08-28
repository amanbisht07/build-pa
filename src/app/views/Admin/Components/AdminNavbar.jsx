import { makeStyles, Tab, Tabs } from '@material-ui/core'
import React from 'react'
import { useTranslation } from "react-i18next";
import "../Styles/AdminNav.css"

const useStyles = makeStyles({
  root: {
    padding: "0px 0px",
    minHeight: "39.1px",
    lineHeight: 0,
  },
  wrapped: {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
  }
})

const AdminNavbar = ({ changeNavigation, SelectedTab }) => {

  const { t } = useTranslation();
  const cls = useStyles()

  return (
    <>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={SelectedTab}
        onChange={changeNavigation}
        aria-label="Vertical tabs example"
      >
        {
          AdminRoutes.map((tab) => {
            return <Tab key={tab.id} label={t(tab.name)} {...TabProps(tab.id)} classes={{
              wrapper: cls.wrapped,
              root: cls.root
            }} />
          })
        }
      </Tabs>
    </>
  )
}

function TabProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const AdminRoutes = [
  { id: 0, name: 'dashboard' },
  { id: 1, name: 'Split Department' },
  { id: 2, name: 'roles' },
  { id: 3, name: 'departments' },
  { id: 4, name: 'merge Department ' },
  { id: 5, name: 'server config' },
  // { id: 6, name: 'branding' },
  { id: 7, name: 'mail' },
  { id: 8, name: 'sms gateway' },
  { id: 9, name: 'ssl' },
  { id: 10, name: 'ldap' },
  { id: 11, name: 'integration' },
  { id: 12, name: 'users' },
]

export default AdminNavbar