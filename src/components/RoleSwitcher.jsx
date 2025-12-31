export default function RoleSwitcher({ role, onChange }) {
  return (
    <div className="flex gap-3 justify-center my-6">
      <button
        onClick={() => onChange("user")}
        className={`px-4 py-2 rounded-lg font-semibold ${
          role === "user"
            ? "bg-blue-600 text-white"
            : "border border-blue-600 text-blue-600"
        }`}
      >
        User
      </button>

      <button
        onClick={() => onChange("driver")}
        className={`px-4 py-2 rounded-lg font-semibold ${
          role === "driver"
            ? "bg-green-600 text-white"
            : "border border-green-600 text-green-600"
        }`}
      >
        Driver
      </button>
    </div>
  );
}
