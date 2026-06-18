export function SelectFilter({ icon, value, onChange, options }) {
  return (
    <label className="select-filter">
      {icon}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
