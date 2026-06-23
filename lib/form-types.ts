import type { FormAsyncValidateOrFn, FormValidateOrFn } from "@tanstack/form-core";
import type { ReactFormExtendedApi } from "@tanstack/react-form";
import type { FormValues } from "./form-utils";

type UndefinedValidate = undefined | FormValidateOrFn<FormValues>;
type UndefinedAsyncValidate = undefined | FormAsyncValidateOrFn<FormValues>;

export type PendaftaranFormApi = ReactFormExtendedApi<
  FormValues,
  UndefinedValidate,
  UndefinedValidate,
  UndefinedAsyncValidate,
  UndefinedValidate,
  UndefinedAsyncValidate,
  UndefinedValidate,
  UndefinedAsyncValidate,
  UndefinedValidate,
  UndefinedAsyncValidate,
  UndefinedAsyncValidate,
  unknown
>;
