import React, { useState } from "react";

// type UseInputResult = [value: string, handleChange: (value: string) => void, setValue: React.Dispatch<React.SetStateAction<string>>];

type UseInputReturnValue = [value: string, handleValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void, setValue: React.Dispatch<React.SetStateAction<string>>];

export default function useInput(initialValue: string = ""): UseInputReturnValue {
  const [value, setValue] = useState(initialValue);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
  };

  return [value, handleValueChange, setValue];
}
