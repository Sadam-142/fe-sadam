/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { api } from "@/lib/api";
import {
  getValidationErrors,
  getStepWithError,
  buildFormData,
  defaultValues,
  STEPS,
  STEP_FIELDS,
  type FormValues,
  type FieldErrors,
} from "@/lib/form-utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { SuccessScreen } from "./pendaftaran/success-screen";
import { FormStepsIndicator } from "./pendaftaran/form-steps-indicator";
import { StepDataDiri } from "./pendaftaran/step-data-diri";
import { StepAkademik } from "./pendaftaran/step-akademik";
import { StepPembayaran } from "./pendaftaran/step-pembayaran";
import { StepReview } from "./pendaftaran/step-review";
import { FormButtons } from "./pendaftaran/form-buttons";

export function PendaftaranForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("BRI");
  const [errors, setErrors] = useState<FieldErrors>({});

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const validationErrors = getValidationErrors(value);
      const effectiveErrors =
        paymentMethod === "COD"
          ? (Object.fromEntries(
              Object.entries(validationErrors).filter(([key]) => key !== "bukti_pembayaran")
            ) as FieldErrors)
          : validationErrors;

      if (Object.keys(effectiveErrors).length > 0) {
        setErrors(effectiveErrors);
        const stepWithError = getStepWithError(effectiveErrors);
        if (stepWithError !== -1) setCurrentStep(stepWithError);
        toast.error("Ada isian yang belum lengkap/valid. Silakan periksa kolom yang ditandai merah.");
        return;
      }

      try {
        setIsLoading(true);
        const res = await api.post("/pendaftaran", buildFormData(value));

        if (res.success) {
          setIsSuccess(true);
          toast.success("Pendaftaran berhasil dikirim");
        }
      } catch (error: any) {
        toast.error(error.message || "Gagal mengirim pendaftaran");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const validateStep = () => {
    const validationErrors = getValidationErrors(form.state.values);
    const stepFields =
      currentStep === 2 && paymentMethod === "COD" ? [] : (STEP_FIELDS[currentStep as 0 | 1 | 2] || []);
    const stepErrors = stepFields.reduce<FieldErrors>((acc, field) => {
      if (validationErrors[field]) acc[field] = validationErrors[field];
      return acc;
    }, {});

    setErrors((prev) => ({ ...prev, ...stepErrors }));

    if (Object.keys(stepErrors).length > 0) {
      toast.error("Ada isian yang belum lengkap/valid. Silakan periksa kolom yang ditandai merah.");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const clearError = (field: keyof FormValues) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  if (isSuccess) {
    return <SuccessScreen />;
  }

  return (
    <div
      className="relative min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/bg-login.jpeg"
            alt="Background"
            className="w-full h-full object-cover opacity-80 mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 bg-[#f4f9f7]/90 backdrop-blur-[12px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#1D9E75]/10 blur-[120px]" />
        <div className="absolute bottom-[5%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-amber-200/20 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a1f16] tracking-tight">
            Formulir <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D9E75] to-[#12bd87]">Pendaftaran</span>
          </h2>
          <p className="text-[13px] sm:text-[15px] text-[#4a5e51] font-medium">
            Gerbang Orientasi Dasar Ilmu Tilawah Al-Quran Saintek (ORDITAS)
          </p>
        </div>

        <FormStepsIndicator currentStep={currentStep} />

        <Card className="border border-white/60 shadow-[0_30px_60px_rgba(29,158,117,0.08)] rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl">
          <div className="h-2 w-full bg-gradient-to-r from-[#0a1f16] via-[#1D9E75] to-amber-300" />
          <CardHeader className="border-b border-gray-100/50 bg-gradient-to-b from-[#1D9E75]/5 to-transparent pb-6 pt-8 px-8">
            <CardTitle className="text-2xl sm:text-3xl font-black text-[#0a1f16] tracking-tight">
              {STEPS[currentStep].title}
            </CardTitle>
            <CardDescription className="text-[14px] text-gray-500 font-medium">
              Lengkapi data pendaftaran UKM Risalah dengan saksama di bawah ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-10">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              {currentStep === 0 && <StepDataDiri form={form} errors={errors} onClearError={clearError} />}

              {currentStep === 1 && <StepAkademik form={form} errors={errors} onClearError={clearError} />}

              {currentStep === 2 && (
                <StepPembayaran
                  form={form}
                  errors={errors}
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                  onClearError={clearError}
                />
              )}

              {currentStep === 3 && <StepReview form={form} paymentMethod={paymentMethod} />}

              <FormButtons
                currentStep={currentStep}
                isLoading={isLoading}
                onPrevClick={prevStep}
                onNextClick={nextStep}
                onSubmit={() => form.handleSubmit()}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
