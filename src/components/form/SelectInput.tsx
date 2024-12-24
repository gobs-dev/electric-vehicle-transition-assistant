import { useCallback } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectInput = ({
  placeholder,
  data,
  value,
  onChange,
  onOpenChange,
}: {
  placeholder: string;
  value?: string;
  data: string[];
  onChange: (val: string) => void;
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (onOpenChange) {
        setTimeout(() => onOpenChange(open), 300);
      }
    },
    [onOpenChange]
  );

  return (
    <Select
      onValueChange={onChange}
      value={value}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className="">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent position="popper">
        <SelectGroup>
          {data.map((val) => (
            <SelectItem key={val} value={val}>
              {val}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectInput;
