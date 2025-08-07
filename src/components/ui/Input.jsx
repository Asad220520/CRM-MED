import React, { useState, useEffect } from "react";

export default function Input({
  label,
  type = "text", // text, select, search
  icon: Icon, // React icon component
  options = [], // для select/search — список опций { value, label }
  value,
  onChange,
  placeholder,
  name,
  className = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    if (type === "search") {
      setFilteredOptions(
        options.filter((opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, options, type]);

  const baseInputStyle = `w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`;

  const inputWithIcon = Icon ? `pl-10` : "";

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {type === "select" && (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`${baseInputStyle} ${inputWithIcon} appearance-none`}
          >
            <option value="" disabled>
              {placeholder || "Выберите..."}
            </option>
            {options.map(({ value: val, label }) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        )}

        {type === "search" && (
          <div className="relative">
            <input
              id={name}
              name={name}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onChange && onChange(e);
              }}
              placeholder={placeholder}
              autoComplete="off"
              className={`${baseInputStyle} ${inputWithIcon}`}
            />
            {filteredOptions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto text-sm">
                {filteredOptions.map(({ value: val, label }) => (
                  <li
                    key={val}
                    onClick={() => {
                      onChange({ target: { name, value: val } });
                      setSearchTerm(label);
                      setFilteredOptions([]);
                    }}
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {type === "text" && (
          <input
            id={name}
            name={name}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${baseInputStyle} ${inputWithIcon}`}
          />
        )}
      </div>
    </div>
  );
}
