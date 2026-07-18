import Input from "./Input";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}