import { FC, useId } from "react";

interface SelectProps {
  name: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}

export const Select: FC<SelectProps> = ({ name, value, values, onChange }) => {
  const id = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {name}
      </label>
      <select
        id={id}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        {values.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};
