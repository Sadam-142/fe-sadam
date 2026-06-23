"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { STEPS } from "@/lib/form-utils";

interface FormButtonsProps {
  currentStep: number;
  isLoading: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
  onSubmit: () => void;
}

export function FormButtons({ currentStep, isLoading, onPrevClick, onNextClick, onSubmit }: FormButtonsProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
      <Button
        type="button"
        variant="outline"
        onClick={currentStep === 0 ? () => router.push("/") : onPrevClick}
        disabled={isLoading}
        className="h-12 px-6 rounded-2xl text-gray-600 font-bold border-gray-200 hover:bg-gray-50 transition-all hover:-translate-x-1"
      >
        {currentStep === 0 ? "Batal" : <><ArrowLeft size={16} className="mr-2" /> Sebelumnya</>}
      </Button>

      {currentStep < STEPS.length - 1 ? (
        <Button
          type="button"
          onClick={onNextClick}
          className="h-12 px-8 rounded-2xl bg-[#1D9E75] hover:bg-[#15805e] text-white font-bold shadow-lg shadow-[#1D9E75]/20 transition-all hover:translate-x-1"
        >
          Lanjut <ArrowRight size={16} className="ml-2" />
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={isLoading}
          onClick={onSubmit}
          className="h-12 px-8 rounded-2xl bg-gradient-to-r from-[#1D9E75] to-[#12bd87] hover:from-[#15805e] hover:to-[#0f966b] text-white font-bold shadow-xl shadow-[#1D9E75]/30 transition-all hover:scale-[1.02]"
        >
          {isLoading ? "Memproses Data..." : "Kirim Pendaftaran"}
        </Button>
      )}
    </div>
  );
}
