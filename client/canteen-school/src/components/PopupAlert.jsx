import React, { useState } from "react";

// this type example (success, error)
const PopupAlert = ({ message, type, onClose }) => {
    return (
      <div
        className={`z-50 fixed top-20 right-5 w-80 p-3 text-sm font-semibold rounded-lg shadow-lg transition-transform duration-700 ease-in-out transform ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white`}
      >
        <div className="flex justify-between items-center">
          <span>{message}</span>
          <button
            className="ml-4 text-xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
      </div>
    );
  };

export default PopupAlert;
