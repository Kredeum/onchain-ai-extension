"use client";

import { useEffect, useState } from "react";
import { InputBase } from "~~/components/scaffold-eth";

type PromptInputProps = {
  inputPrompt: string;
  value: string;
  onChange: (newValue: string) => void;
  disabled: boolean;
  resetPrompt: () => void;
};

export const PromptInput = ({ inputPrompt, value, onChange, disabled, resetPrompt }: PromptInputProps) => {
  const [inputError, setInputError] = useState(false);

  const name = "prompt";
  const placeholder = "Your prompt";

  useEffect(() => {
    if (true) {
      setInputError(false);
    } else {
      setInputError(true);
    }
  }, [value]);

  return (
    <>
      <div className="flex flex-col gap-1.5 w-full">
        <InputBase
          name={name}
          value={value}
          placeholder={placeholder}
          error={inputError}
          onChange={onChange}
          disabled={disabled}
          suffix={
            !inputError &&
            inputPrompt && (
              <div
                className="space-x-4 flex tooltip tooltip-top tooltip-secondary before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
                data-tip="Reset prompt"
              >
                <button
                  className={`${disabled ? "cursor-not-allowed" : "cursor-pointer"} font-semibold px-4 text-accent`}
                  onClick={resetPrompt}
                  disabled={disabled}
                >
                  X
                </button>
              </div>
            )
          }
        />
      </div>
    </>
  );
};
