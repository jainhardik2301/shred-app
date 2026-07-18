import { useState } from "react";

export default function Tooltip({
  children,
  text,
}) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950 px-3 py-2 text-sm text-white shadow-xl">
          {text}
        </div>
      )}
    </div>
  );
}