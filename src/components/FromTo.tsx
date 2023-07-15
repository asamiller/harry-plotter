import { ArrowRight } from "@phosphor-icons/react";
import { FC, useId } from "react";

interface FromToProps {
  name: string;
  value: [number, number];
  min: number;
  max: number;
  steps?: number;
  onChange: (value: [number, number]) => void;
}

export const FromTo: FC<FromToProps> = ({
  name,
  value = [],
  min,
  max,
  steps,
  onChange,
}) => {
  const startId = useId();
  const endId = useId();

  const [from = 0, to = 0] = value;

  return (
    <div>
      <label
        htmlFor={startId}
        className="block text-sm font-medium leading-6 text-gray-900 flex"
      >
        {name}: {from} <ArrowRight size={20} /> {to}
      </label>
      <div className="flex justify-between gap-2 pt-2">
        <input
          id={startId}
          type="range"
          min={min}
          max={max}
          value={from ?? 0}
          step={steps}
          onChange={(e) => onChange([parseFloat(e.target.value), to])}
          className="w-full h-1 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
        />
        <input
          id={endId}
          type="range"
          min={min}
          max={max}
          value={to ?? 0}
          step={steps}
          onChange={(e) => onChange([from, parseFloat(e.target.value)])}
          className="w-full h-1 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
        />
      </div>
    </div>
  );
};
