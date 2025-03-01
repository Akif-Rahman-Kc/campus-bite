import React, { useState } from "react";

const FilterDropdown = ({ key_name, items, selectedValue, setSelectedValue }) => {
    // selected value setting
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedValue((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // return
    return (
        <div>
            <label className="text-sm text-white block mb-1" htmlFor="dropdown">Select {key_name}:</label>
            <select className="w-full text-xs text-white bg-gray-900 capitalize p-2 rounded-md border border-gray-500" name={key_name} id={key_name} value={selectedValue} onChange={handleChange}>
                <option value="">all</option>
                {items.map((item) => (
                    <option key={item} value={item}>{item}</option>
                ))}
            </select>
        </div>
    );
};

export default FilterDropdown;
