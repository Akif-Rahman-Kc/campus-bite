import React, { useState } from "react";

const Dropdown = ({ key_name, items, selectedValue, setSelectedValue }) => {
    // selected value setting
    const handleChange = (e) => {
        setSelectedValue(e.target.value)
    };

    // return
    return (
        <div>
            <label className="text-sm text-white" htmlFor="dropdown">Select {key_name}: </label>
            <select className="text-xs text-white bg-gray-900 capitalize py-1 px-2 rounded-md border border-gray-500" name={key_name} id={key_name} value={selectedValue} onChange={handleChange}>
                <option value="">all</option>
                {items.map((item) => (
                    <option key={item} value={item}>{item}</option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;
