import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

export default function Select({
  label,
  options = [],
  value,
  onChange,
  searchable = false,
  disabled = false,
  name,
  placeholder = "Выберите...",
  allOptionLabel = "",
  containerWidth = "", 
  buttonHeight = "", 
  dropdownMaxHeight = "max-h-50", 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const fullOptions = allOptionLabel
    ? [{ value: "", label: allOptionLabel }, ...options]
    : options;

  const selectedLabel =
    fullOptions.find((opt) => opt.value === value)?.label || placeholder;

  const filteredOptions = searchable
    ? fullOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : fullOptions;

  const handleSelect = (option) => {
    onChange && onChange({ target: { name, value: option.value } });
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`inline-block ${containerWidth}`} ref={dropdownRef}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative inline-block w-full">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={`flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-left w-full ${buttonHeight} ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <span className={`${value ? "text-gray-800" : "text-gray-400"}`}>
            {selectedLabel}
          </span>
          <FiChevronDown className="text-gray-500" />
        </button>

        {isOpen && (
          <div
            className={`absolute top-full z-30 bg-white border border-gray-300  rounded shadow overflow-y-auto min-w-full ${dropdownMaxHeight} 
     scrollbar-blue `}
          >
            {searchable && (
              <div className="flex items-center px-3 py-2 border-b">
                <FiSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full focus:outline-none text-sm"
                />
              </div>
            )}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-2 text-sm cursor-pointer ${
                    option.value === value
                      ? "bg-blue-50 font-semibold text-blue-700"
                      : "hover:bg-blue-50"
                  } ${option.color ? option.color : ""}`}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-400 text-sm">
                Ничего не найдено
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
