"use client";

import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { STEPS } from "@/lib/form-utils";

interface FormStepsIndicatorProps {
  currentStep: number;
}

export function FormStepsIndicator({ currentStep }: FormStepsIndicatorProps) {
  return (
    <div className="flex justify-between items-start mb-8 relative max-w-2xl mx-auto px-2 sm:px-6">
      {STEPS.map((step, idx) => {
        const isActive = currentStep === idx;
        const isDone = currentStep > idx;
        const isLast = idx === STEPS.length - 1;

        return (
          <div key={step.id} className="flex-1 flex flex-col items-center relative group">
            {!isLast && (
              <div className="absolute top-5 left-1/2 w-full h-[3px] bg-gray-200/70 -z-10">
                <div
                  className="h-full bg-gradient-to-r from-[#1D9E75] to-[#12bd87] transition-all duration-500 ease-in-out"
                  style={{ width: isDone ? "100%" : "0%" }}
                />
              </div>
            )}
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold border-[3px] transition-all duration-500 shadow-sm relative z-10",
                isDone
                  ? "bg-[#1D9E75] border-[#1D9E75] text-white scale-100"
                  : isActive
                    ? "bg-white border-[#1D9E75] text-[#1D9E75] scale-110 shadow-md shadow-[#1D9E75]/20"
                    : "bg-white border-gray-300 text-gray-400 scale-95"
              )}
            >
              {isDone ? <Check size={18} weight="bold" /> : idx + 1}
            </div>
            <span
              className={cn(
                "text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hidden sm:block transition-colors duration-500 mt-3 text-center",
                isDone || isActive ? "text-[#1D9E75]" : "text-gray-400"
              )}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
