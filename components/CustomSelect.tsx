"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, LucideIcon } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  dropUp?: boolean;
}

export function CustomSelect({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  className = "",
  dropUp = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isOpen ? "z-50" : "z-10"} ${className}`}
    >
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs text-left rtl:text-right transition-all duration-200 cursor-pointer ${
          isOpen
            ? "border-indigo-500 bg-[#1a1a28] ring-2 ring-indigo-500/30 shadow-2xl text-white"
            : "border-white/[0.12] bg-[#121218] hover:bg-[#16161f] hover:border-white/20 text-slate-200"
        }`}
      >
        <div className="flex items-center gap-2.5 truncate min-w-0">
          {selectedOption?.icon && (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-cyan-300">
              {React.createElement(selectedOption.icon, { className: "w-3.5 h-3.5" })}
            </div>
          )}
          <div className="truncate">
            <span className="font-semibold text-white block truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedOption?.description && (
              <span className="text-[10px] text-slate-400 block truncate">
                {selectedOption.description}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-1 rtl:mr-1 rtl:ml-0">
          {selectedOption?.badge && (
            <span className="hidden sm:inline-flex rounded-md bg-indigo-500/15 border border-indigo-500/30 px-1.5 py-0.5 text-[9px] font-medium text-indigo-300">
              {selectedOption.badge}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-cyan-400" : ""
            }`}
          />
        </div>
      </button>

      {/* Solid Opaque Floating Dropdown Popover with backdrop shadow */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-[100] rounded-xl border border-white/20 bg-[#161622] shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 max-h-64 overflow-y-auto ${
            dropUp ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            const Icon = option.icon;

            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all duration-150 group ${
                  isSelected
                    ? "bg-indigo-600/40 border border-indigo-500/60 text-white shadow-sm"
                    : "hover:bg-white/[0.08] text-slate-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2 rtl:pl-2 rtl:pr-0">
                  {Icon && (
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        isSelected
                          ? "bg-indigo-500/30 border-indigo-400/50 text-cyan-300"
                          : "bg-white/[0.04] border-white/10 text-slate-400 group-hover:text-cyan-300 group-hover:border-white/20"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold block truncate">
                        {option.label}
                      </span>
                      {option.badge && (
                        <span className="rounded bg-white/[0.08] border border-white/15 px-1.5 py-0.5 text-[9px] text-slate-300">
                          {option.badge}
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <p className="text-[10px] text-slate-400 group-hover:text-slate-200 truncate mt-0.5">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 ml-2 rtl:mr-2 rtl:ml-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
