import { FormControl, Select as SelectUI } from "@rewind-ui/core";
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
    <>
      <FormControl.Label className="font-medium">{name}</FormControl.Label>
      <SelectUI
        id={id}
        color="purple"
        tone="solid"
        size="sm"
        value={value}
        shadow="sm"
        onChange={(event: any) => onChange(event.target.value)}
      >
        {values?.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </SelectUI>
    </>
  );
};
