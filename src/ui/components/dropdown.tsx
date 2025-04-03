interface DropdownProps {
   options: string[];
   placeholder?: string;
   onSelect: (index: number) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
   options,
   placeholder,
   onSelect,
}) => {
   const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onSelect(event.currentTarget.selectedIndex - 1);
   };

   return (
      <select
         className="bg-gray-800 text-gray-100 border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
         onChange={handleChange}
      >
         <option>{placeholder}</option>
         {options.map((option) => (
            <option key={option}>{option}</option>
         ))}
      </select>
   );
};
