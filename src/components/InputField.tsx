interface InputFieldProps {
    label: string;
    type?: string;
    value?: string | number;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    min?: string | number;
    max?: string | number;
}

export function InputField({
    label,
    type = "text",
    value = "",
    onChange,
    error,
    placeholder,
    required = false,
    min,
    max,
}: InputFieldProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                min={min}
                max={max}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${error ? "border-red-500" : "border-gray-300"}`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

