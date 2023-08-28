// import React, { useRef, useEffect, useState } from "react";
// import Tick from "@pqina/flip";
// import "@pqina/flip/dist/flip.min.css";
// import "./loading.css";

// export const SaveTreeCounter = ({ value }) => {
//   const divRef = useRef();
//   const tickRef = useRef();

//   // Function to pad the input value with leading zeros
//   const padWithZeros = (input, minLength) => {
//     const numDigits = Math.max(minLength, input.length);
//     return input.padStart(numDigits, "0");
//   };

//   useEffect(() => {
//     const didInit = (tick) => {
//       tickRef.current = tick;
//     };

//     const currDiv = divRef.current;
//     const tickValue = tickRef.current;
//     const paddedValue = padWithZeros(String(value), 3); // Ensure 3-digit minimum
//     Tick.DOM.create(currDiv, {
//       value: paddedValue,
//       didInit,
//     });

//     return () => Tick.DOM.destroy(tickValue);
//   }, [value]);

//   useEffect(() => {
//     if (tickRef.current) {
//       const paddedValue = padWithZeros(String(value), 3); // Ensure 3-digit minimum
//       tickRef.current.value = paddedValue;
//     }
//   }, [value]);

//   return (
//     <>
//       <div className="counter_div">
//         <div className="counter_div_span">
//           <span>Saved Trees</span>
//         </div>
//         <div ref={divRef} className="tick">
//           <div data-repeat="true">
//             <span data-view="flip" />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };




import React, { useRef, useEffect, useState } from "react";
import Tick from "@pqina/flip";
import "@pqina/flip/dist/flip.min.css";
import "./loading.css";

export const SaveTreeCounter = ({ value }) => {
  const divRef = useRef();
  const tickRef = useRef();

  // Function to pad the input value with leading zeros
  const padWithZeros = (input, minLength) => {
    const numDigits = Math.max(minLength, input.length);
    return input.padStart(numDigits, "0");
  };

  useEffect(() => {
    const didInit = (tick) => {
      tickRef.current = tick;
    };

    const currDiv = divRef.current;
    const tickValue = tickRef.current;

    // Get the stored counter value from localStorage, or start from 0 if not present
    const storedValue = localStorage.getItem("counterValue") || 0;

    // Initialize the counter with the stored value
    Tick.DOM.create(currDiv, {
      value: padWithZeros(String(storedValue), 3),
      didInit,
    });

    return () => Tick.DOM.destroy(tickValue);
  }, []);

  useEffect(() => {
    if (tickRef.current) {
      // Update the counter value in localStorage whenever the value prop changes
      localStorage.setItem("counterValue", value);

      // Calculate the step count to reach the target value
      const steps = 100; // Adjust the number of steps based on your preference
      const stepValue = Math.floor(value / steps);

      // Update the counter value gradually in small increments
      let currentValue = value - (value % 100);
      console.log(currentValue);
      const updateInterval = setInterval(() => {
        if (currentValue >= value) {
          clearInterval(updateInterval);
        } else if (currentValue < 0) {
          currentValue = 0;
        } else {
          currentValue += stepValue;
          const paddedValue = padWithZeros(String(currentValue), 3);
          tickRef.current.value = paddedValue;
        }
      }, 50); // Adjust the interval for smoother animation
    }
  }, [value]);

  console.log("Save Tree Counter")

  return (
    <>
      <div className="counter_div">
        <div className="counter_div_span">
          <span>Saved Trees</span>
        </div>
        <div ref={divRef} className="tick">
          <div data-repeat="true">
            <span data-view="flip" />
          </div>
        </div>
      </div>
    </>
  );
};

