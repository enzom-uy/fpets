"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PersonOrBusiness } from "./person-or-business";
import { BusinessFormGeneralInfo } from "./business/business-form-general-info";

interface FormData {
  isBusiness: boolean;
}

type ActiveStep = "choosing" | "businessGeneralInfo" | "personGeneralInfo";

export const HandleCreatingProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    isBusiness: false,
  });

  const getStepFromURL = (): ActiveStep => {
    if (typeof window === "undefined") return "choosing";
    const params = new URLSearchParams(window.location.search);
    return (params.get("step") as ActiveStep) || "choosing";
  };

  const [activeStep, setActiveStep] = useState<ActiveStep>(getStepFromURL);

  useEffect(() => {
    const handlePopState = () => {
      setActiveStep(getStepFromURL());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  });

  const handleIsBusiness = (value: boolean) => {
    console.log("is business?: ", formData);
    setFormData((prev) => ({
      ...prev,
      isBusiness: value,
    }));

    if (value === true) {
      setFormSteps((prev) => ({
        ...prev,
        currentForm: "business",
        activeStep: "businessGeneralInfo",
      }));
    }
  };
  return (
    <>
      {formSteps.activeStep === "choosing" && (
        <PersonOrBusiness handleIsBusiness={handleIsBusiness} />
      )}
      {formSteps.activeStep === "businessGeneralInfo" && (
        <BusinessFormGeneralInfo />
      )}
    </>
  );
};
