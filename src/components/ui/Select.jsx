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
  allOptionLabel = "Все", // первая опция
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const fullOptions = [{ value: "", label: allOptionLabel }, ...options];
  const selectedLabel = fullOptions.find((opt) => opt.value === value)?.label;

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
    <div className="inline-block " ref={dropdownRef}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative inline-block w-max">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={`flex justify-between items-center h-10 px-4 py-2 border rounded-md bg-white text-left w-full ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <span className="text-gray-800">{selectedLabel}</span>
          <FiChevronDown className="text-gray-500" />
        </button>

        {isOpen && (
          <div className="absolute top-12 z-30 bg-white border rounded shadow max-h-60 overflow-y-auto scrollbar-blue w-max min-w-full">
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
                  className={`px-4 py-2  text-sm cursor-pointer ${
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
