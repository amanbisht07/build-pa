import { Avatar } from "@material-ui/core";
import React from "react";
import "../../Styles/UserCard.css";
import {Info,Person} from '@material-ui/icons';

const UserCard = ({ User, handleDialog, id }) => {

  return (
    <div 
    className="card"
    id={id}
    >
      <div className="imgBx">
        <Avatar style={{ backgroundColor: "rgb(5,100,200)" }}>
          <Info/>
          <Person/>
        </Avatar>
      </div>

      <div className="content">
        <div className="details">
          <h2>{`${User.user.name}(${User.user.userId})`}<br />
          <span style={{
            color:User.user.status?'blue':'red'
          }}>{User.user.status ? "Active" : "In Active"}</span> 
          </h2>
          <div className="data">
            <div className="data-child">
                <h4>Email</h4>
                <span>{User.user.email}</span>
            </div>
            <div className="data-child">
                <h4>Rank</h4>
                <span>{User.user.rank}</span>
            </div>
            <div className="data-child">
                <h4>Phone</h4>
                <span>{User.user.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
