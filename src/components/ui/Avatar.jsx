export default function Avatar({
  name = "",
  size = "md",
}) {
  const sizes = {
    sm: "h-10 w-10 text-sm",
    md: "h-14 w-14 text-xl",
    lg: "h-20 w-20 text-3xl",
  };

  return (
    <div
      className={`
        ${sizes[size]}
        flex
        items-center
        justify-center
        rounded-full
        bg-emerald-500
        font-bold
        text-white
      `}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}