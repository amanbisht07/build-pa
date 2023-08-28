import { Box, makeStyles } from "@material-ui/core";
import {
  People,
  Category,
  Apartment,
  Mail,
  Send,
  NoteAdd,
} from "@material-ui/icons";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import UploadLoading from "app/views/utilities/UploadLoading";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { getADasboardCount } from "../../../../camunda_redux/redux/action";
import Counter from "./Counter";
import DakAndFile from "./DakAndFile";
import LicensePlan from "./LicensePlan";

const iconStyle = {
  fontSize: "3.8rem",
  fill: "blue",
  backgroundColor: "#0000002b",
  borderRadius: "50%",
  padding: "8px",
};

const iconStyle2 = {
  fontSize: "3rem",
  fill: "white",
};

const useStyles = makeStyles({
  countContainer: {
    display: "flex",
    justifyContent:'space-between'
  },
  datePick: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "91%",
  },
  licensePlan: {
    display: "flex",
    justifyContent: "space-between",
    width: "91%",
    alignItems: "center",
    padding: "13px",
  },
});

const Dashboard = (props) => {
  const dispatch = useDispatch();

  const [Dashboard, setDashboard] = useState({
    loading: false,
    error: "",
    Count: [],
  });

  const handleLoad = () => {
    setDashboard({
      ...Dashboard,
      loading: true,
    });
  };

  const cls = useStyles();

  useEffect(() => {
    FilterCount();
  }, []);

  const FilterCount = (date,message) => {
    props
      .getADasboardCount(date)
      .then((res) => {
        if (res.error) {
          setDashboard({
            loading: false,
            error: res.error,
            Count: [],
          });
          dispatch(setSnackbar(true, "error", res.error));
        } else if (res.response) {
          const tempArr1 = Object.entries(res.response[0]).map(
            ([key, value], i) => {
              if (key == "Users")
                return {
                  name: "USERS",
                  count: value,
                  icon: <People style={iconStyle} />,
                };
              else if (key == "Departments")
                return {
                  name: "DEPARTMENTS",
                  count: value,
                  icon: <Apartment style={iconStyle} />,
                };
              else if (key == "Roles")
                return {
                  name: "ROLES",
                  count: value,
                  icon: <Category style={iconStyle} />,
                };
            }
          );

          const tempArr2 = Object.entries(res.response[1]).map(
            ([key, value], i) => {
              if (key == "DAKSCreated")
                return {
                  name: "DAK CREATED",
                  count: value,
                  icon: <Mail style={iconStyle2} />,
                };
              else if (key == "FilesCreated")
                return {
                  name: "FILES CREATED",
                  count: value,
                  icon: <NoteAdd style={iconStyle2} />,
                };
              else if (key == "DAKSMoved")
                return {
                  name: "DAK MOVED",
                  count: value,
                  icon: <Send style={iconStyle2} />,
                };
              else if (key == "FilesMoved")
                return {
                  name: "FILES MOVED",
                  count: value,
                  icon: <Send style={iconStyle2} />,
                };
            }
          );
          setDashboard({
            loading: false,
            error: "",
            Count: [tempArr1, tempArr2],
          });
          dispatch(
            setSnackbar(
              true,
              "success",
              message ? message : "Filtered By Today"
            )
          );
        }
      })
      .catch((err) => {
        setDashboard({
          loading: false,
          error: err,
          Count: [],
        });
      });
  };

  return (
    <>
      {Dashboard.loading ? (
        <UploadLoading />
      ) : Dashboard.error ? (
        <h1>{Dashboard.error}</h1>
      ) : Dashboard.Count.length!=0 ? (
        <div style={{
          display:'flex',
          flexDirection: "column",
          gap:'1rem',
          width:"84%"
        }}>
          <Box className={cls.countContainer}>
            {Dashboard.Count[0].map((item, i) => {
              return (
                <Counter
                  key={i}
                  info={item}
                  changeNavigation={props.changeNavigation}
                />
              );
            })}
          </Box>
          <Box className={cls.datePick}>
            <DakAndFile countArr={Dashboard.Count[1]} Load={handleLoad} FilterCount={FilterCount} />
          </Box>
          <Box className={cls.licensePlan}>
            <LicensePlan />
          </Box>
        </div>
      ) : ""}
    </>
  );
};

function mapStateToProps(state) {
  return {
    // props: state.props,
    subscribeApi: state.subscribeApi,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, { getADasboardCount })(Dashboard);
