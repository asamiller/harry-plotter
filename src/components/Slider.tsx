import { FC, useId } from "react";

interface SliderProps {
  name: string;
  value: number;
  min: number;
  max: number;
  steps?: number;
  onChange: (value: number) => void;
}

export const Slider: FC<SliderProps> = ({
  name,
  value,
  min,
  max,
  steps,
  onChange,
}) => {
  const id = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {name}: {value}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value ?? 0}
        step={steps}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
      />
    </div>
  );
};
