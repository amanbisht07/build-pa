import React from "react";

const Loading = () => {
  return (
    <div className="loading-container">
      <svg
        id="dots"
        width="50px"
        height="21px"
        viewBox="0 0 132 58"
        version="1.1"
      >
        <g
          id="Page-1"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g id="dots" fill="#A3A3A3">
            <circle id="dot1" cx="25" cy="30" r="13"></circle>
            <circle id="dot2" cx="65" cy="30" r="13"></circle>
            <circle id="dot3" cx="105" cy="30" r="13"></circle>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Loading;
