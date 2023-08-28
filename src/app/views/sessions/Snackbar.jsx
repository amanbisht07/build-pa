import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "utils";

const CustomizedSnackbars = () => {
  const snackbar = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  const resetSnackBar = useCallback(
    debounce(() => {
      dispatch(setSnackbar(false, "", ""));
    }),
    []
  );

  useEffect(() => {
    const notify = () => {
      let msg = snackbar.snackbarMessage;
      msg = msg.trim();
      if (snackbar.snackbarType === "success") {
        toast.success(msg, {
          style: { backgroundColor: "#43A047", color: "#fff" },
        });
      } else if (snackbar.snackbarType === "error") {
        toast.error(msg, {
          style: { backgroundColor: "#EF5350", color: "#fff" },
        });
      }
      resetSnackBar(); // Now 500 ms from the occurrence of snackbar we will reset the snakbar state , so it will not appear on login again
    };

    snackbar.snackbarOpen && notify();
  }, [snackbar]);

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      theme="colored"
      pauseOnHover
    />
  );
};

export default CustomizedSnackbars;
