import React from "react";
export default function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
      setLoading(false);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="flex items-center gap-2">
      <input
        {...props}
        value={value}
        onChange={(e) => {
          setLoading(true);
          setValue(e.target.value);
        }}
        className=" bg-[#040D12] p-2 border-[1px] outline-none rounded-md"
        style={{
          border: "1px solid #183D3D ",
          outline: "2px solid transparent",
          outlineOffset: "2px",
          color: "#93B1A6",
        }}
      />
      <div
        style={{
          width: "40px",
          height: "40px",
        }}
      >
        {loading && (
          <svg
            width="40px"
            height="40px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <circle
              cx="50"
              cy="50"
              r="32"
              stroke-width="8"
              stroke="#e15b64"
              stroke-dasharray="50.26548245743669 50.26548245743669"
              fill="none"
              stroke-linecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="1s"
                repeatCount="indefinite"
                keyTimes="0;1"
                values="0 50 50;360 50 50"
              ></animateTransform>
            </circle>
            <circle
              cx="50"
              cy="50"
              r="23"
              stroke-width="8"
              stroke="#f8b26a"
              stroke-dasharray="36.12831551628262 36.12831551628262"
              stroke-dashoffset="36.12831551628262"
              fill="none"
              stroke-linecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="1s"
                repeatCount="indefinite"
                keyTimes="0;1"
                values="0 50 50;-360 50 50"
              ></animateTransform>
            </circle>
          </svg>
        )}
      </div>
    </div>
  );
}
