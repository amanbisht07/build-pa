import axios from "axios";
import localStorageService from "./localStorageService";

class JwtAuthService {


    loginWithEmailAndPassword = (data1, token) => {
        // let token = sessionStorage.getItem("jwt_token");
        // let data1 = sessionStorage.getItem("userInfo");
        // window.location.reload();


        return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(data1);
        }, 1000);
      }).then(data => {
            let val = JSON.parse(data);
            let user = {
                userId: val.sub,
                userName: val.username,
                role: val.role[0],
                group: val.grp[0],
                displayName: val.name,
                email: val.email,
                photoURL: `${process.env.PUBLIC_URL+"/assets/images/face-6.jpg"}`,
                age: 25,
                token: token
            };
            sessionStorage.setItem("userData",user);
            let dept = val.grp[0];6
           

        return data;
      });
    };



    // You need to send http requst with existing token to your server to check token is valid
    // This method is being used when user logged in & app is reloaded
    loginWithToken = () => {
        // let token = sessionStorage.getItem("jwt_token");
        // let data1 = sessionStorage.getItem("userInfo");
        // console.log("Subscribe Token : ", data1);
        // let val = JSON.parse(data1);
        // console.log("After JSON parse : ", val);
        // let user = {
        //     userId: val.sub,
        //     userName: val.username,
        //     role: val.role[0],
        //     group: val.grp[0],
        //     displayName: val.name,
        //     email: val.email,
        //     photoURL: `${process.env.PUBLIC_URL+"/assets/images/face-6.jpg"}`,
        //     age: 25,
        //     token: token
        // };
        let user = sessionStorage.getItem("userData");
        // let dept = val.grp[0];
        // sessionStorage.setItem("department", dept);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(JSON.stringify(user));
            }, 100);
        }).then(data => {

            return data;
        });
    };

    logout = () => {
        this.setSession(null);

        sessionStorage.setItem("jwt_token",null);

        this.removeUser();
    };

    // Set token to all http request header, so you don't need to attach everytime
    setSession = token => {
        if (token) {
            sessionStorage.getItem("jwt_token");
            // fetch.defaults.headers.common["Authorization"] = "Bearer " + token;
        }
    };

    // Save user to localstorage
    setUser = (user) => {
        localStorageService.setItem("auth_user", user);
    };
    // Remove user from localstorage
    removeUser = () => {
        sessionStorage.removeItem("auth_user");
    }
}

export default new JwtAuthService();
