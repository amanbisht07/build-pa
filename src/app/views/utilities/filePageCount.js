import axios from "axios";

export const countPages = (files, errorCallback) => {
  axios
    .post("/file/count/upload", files)
    .then((resp) => {
      if (resp.data) {
        let formData = new FormData();
        formData.append("count", resp.data.pages);
        axios
          .post("/create_personal_app/api/pagesCount", formData, {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
              sessionId: sessionStorage.getItem("sessionId"),
            },
          })
          .then((res) => {
            try {
              if (res.error) {
                console.log(res.error);
              }
            } catch (error) {
              console.log(error);
              errorCallback(error.message);
            }
          })
          .catch((error) => {
            console.log(error);
            errorCallback(error.message);
          });
      }
    })
    .catch((error) => {
      console.log(error);
      errorCallback(
        "Unable to count pages internal server error".toUpperCase()
      );
    });
};
