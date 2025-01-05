import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, endIcon, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium mb-1">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </span>
          )}
          <input
            placeholder={props.placeholder}
            ref={ref}
            className={`w-full p-2 border focus:outline-primary bg-transparent ${error ? 'border-red-500' : 'border-gray-300'} rounded-md ${icon ? 'pl-10' : ''} ${endIcon ? 'pr-10' : ''}`}
            {...props}
          />
          {endIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {endIcon}
            </span>
          )}
        </div>
        {error && (
          <div className="text-red-500 text-xs mt-1">{error}</div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

