import './FormInput.css'

interface FormInputProps {
  label: string
  name: string
  type?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
}

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  options,
  placeholder,
}: FormInputProps) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      {options ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}

export default FormInput
