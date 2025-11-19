"use client"

import { useEffect, useState, type ReactNode } from "react"
import { PersonOrBusiness } from "./person-or-business"
import { BusinessFormGeneralInfo } from "./business/business-form-general-info"
import { PersonFormGeneralInfo } from "./person/person-form-general-info"

interface FormData {
	isBusiness: boolean
}

type ActiveStep = "choosing" | "businessGeneralInfo" | "personGeneralInfo"
const STORAGE_KEY = "creating-profile-form"

export const HandleCreatingProfileForm: React.FC = () => {
	const getStepFromURL = (): ActiveStep => {
		if (typeof window === "undefined") return "choosing"
		const params = new URLSearchParams(window.location.search)
		return (params.get("step") as ActiveStep) || "choosing"
	}

	const getStoredFormData = (): FormData => {
		if (typeof window === "undefined") return { isBusiness: false }
		const stored = sessionStorage.getItem(STORAGE_KEY)
		return stored ? JSON.parse(stored) : { isBusiness: false }
	}

	const [formData, setFormData] = useState<FormData>(getStoredFormData)
	const [activeStep, setActiveStep] = useState<ActiveStep>(getStepFromURL)

	useEffect(() => {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
	}, [formData])

	useEffect(() => {
		const handlePopState = () => {
			setActiveStep(getStepFromURL())
		}
		window.addEventListener("popstate", handlePopState)
		return () => window.removeEventListener("popstate", handlePopState)
	}, [])

	const navigateToStep = (step: ActiveStep) => {
		setActiveStep(step)
		const url = new URL(window.location.href)
		url.searchParams.set("step", step)
		window.history.pushState({}, "", url)
	}

	const handleIsBusiness = (value: boolean) => {
		setFormData((prev) => ({
			...prev,
			isBusiness: value,
		}))

		if (value === true) {
			navigateToStep("businessGeneralInfo")
		} else {
			navigateToStep("personGeneralInfo")
		}
	}

	return (
		<>
			{activeStep !== "choosing" && (
				<button onClick={() => window.history.back()}>Volver</button>
			)}
			{activeStep === "choosing" && (
				<PersonOrBusiness handleIsBusiness={handleIsBusiness} />
			)}
			{activeStep == "businessGeneralInfo" && <BusinessFormGeneralInfo />}
			{activeStep == "personGeneralInfo" && <PersonFormGeneralInfo />}
		</>
	)
}
