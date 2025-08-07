import { useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

export default function Select({
  label,
  placeholder = "Выберите...",
  options = [],
  value,
  onChange,
  searchable = false,
  disabled = false,
  name,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (option) => {
    onChange && onChange({ target: { name, value: option.value } });
    setIsOpen(false);
    setSearchTerm("");
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={`w-full flex justify-between items-center px-4 py-2 border rounded-md bg-white text-left ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <span className={selectedLabel ? "text-gray-800" : "text-gray-400"}>
            {selectedLabel || placeholder}
          </span>
          <FiChevronDown className="text-gray-500" />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
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
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
              >
                {option.label}
              </div>
            ))}
            {filteredOptions.length === 0 && (
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
