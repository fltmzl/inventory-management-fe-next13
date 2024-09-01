import { useState } from "react";

export default function useMutateState() {
  const [isMutate, setIsMutate] = useState(false);

  return {
    isMutate,
    setIsMutate,
  };
}
