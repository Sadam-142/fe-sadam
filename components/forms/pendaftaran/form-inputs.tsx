"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarBlank } from "@phosphor-icons/react";

interface FormInputProps {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export function FormInput({ label, value, error, onChange, placeholder, type = "text" }: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-bold text-gray-700 uppercase">{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        className="h-12 rounded-xl"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface FormDatePickerProps {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function FormDatePicker({ label, value, error, onChange }: FormDatePickerProps) {
  return (
    <div className="space-y-2 flex flex-col">
      <Label className="text-xs font-bold text-gray-700 uppercase">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn("h-12 rounded-xl justify-start text-left font-normal", !value && "text-muted-foreground")}
          >
            <CalendarBlank className="mr-2 h-4 w-4" />
            {value ? format(new Date(value), "PPP", { locale: localeId }) : <span>Pilih Tanggal</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => {
              if (!date) return;
              onChange(format(date, "yyyy-MM-dd"));
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface FormFileInputProps {
  label: string;
  error?: string;
  onChange: (file: File | null) => void;
}

export function FormFileInput({ label, error, onChange }: FormFileInputProps) {
  return (
    <div className="space-y-4 p-5 bg-amber-50/80 rounded-2xl border border-amber-200/60 shadow-inner">
      <div className="flex gap-3">
        <div className="w-1.5 rounded-full bg-amber-400 shrink-0" />
        <p className="text-[13px] text-amber-900 leading-relaxed font-medium">
          <strong>Penting:</strong> Untuk transfer via BRI & ShopeePay, harap tambahkan{" "}
          <strong className="text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">Rp 1.000</strong> sebagai biaya
          admin.
        </p>
      </div>
      <div className="space-y-2 pt-2 border-t border-amber-200/50">
        <Label className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">{label}</Label>
        <Input
          type="file"
          accept="image/png, image/jpeg"
          className="h-11 text-xs bg-white rounded-xl border-amber-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
        {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
      </div>
    </div>
  );
}
