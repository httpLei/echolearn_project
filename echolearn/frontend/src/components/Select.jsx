import React, { useState, useRef, useEffect } from 'react';
import './Select.css';

export function Select({ value, onValueChange, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trigger = React.Children.toArray(children).find(
    child => child.type === SelectTrigger
  );
  const content = React.Children.toArray(children).find(
    child => child.type === SelectContent
  );

  return (
    <div className="custom-select" ref={selectRef}>
      {trigger && React.cloneElement(trigger, { 
        isOpen, 
        onClick: () => setIsOpen(!isOpen) 
      })}
      {isOpen && content && React.cloneElement(content, { 
        value, 
        onValueChange: (newValue) => {
          onValueChange(newValue);
          setIsOpen(false);
        }
      })}
    </div>
  );
}

export function SelectTrigger({ children, className, isOpen, onClick }) {
  return (
    <button 
      type="button"
      className={`select-trigger ${className || ''} ${isOpen ? 'open' : ''}`}
      onClick={onClick}
    >
      {children}
      <svg className="select-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder, children }) {
  return <span className="select-value">{children || placeholder}</span>;
}

export function SelectContent({ children, className, value, onValueChange }) {
  return (
    <div className={`select-content ${className || ''}`}>
      {React.Children.map(children, child => 
        child && React.cloneElement(child, { 
          isSelected: child.props.value === value,
          onClick: () => {
            console.log('SelectContent onClick for value:', child.props.value);
            onValueChange(child.props.value);
          }
        })
      )}
    </div>
  );
}

export function SelectItem({ value, children, className, isSelected, onClick, disabled }) {
  return (
    <div 
      className={`select-item ${className || ''} ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={(e) => {
        console.log('SelectItem clicked:', value, 'onClick exists?', !!onClick);
        if (!disabled && onClick) {
          console.log('Calling onClick for', value);
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
}
