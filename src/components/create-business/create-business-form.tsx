"use client"

import { useEffect, useState } from "react"
import { Form } from "../ui/form"
import { CreateBusinessGeneralInfo } from "./create-business-general-info"

export type CreateBusinessSteps = "general-info" | "branch-info"
const STORAGE_KEY = "create-business-form"
const NAVIGATION_FLAG_KEY = "create-business-navigation-active"

export interface CreateBusinessFormData {
	name: string
	description: string
}

export const CreateBusinessForm = () => {
	const getStepFromURL = (): CreateBusinessSteps => {
		if (typeof window === "undefined") return "general-info"

		const isNavigationActive = sessionStorage.getItem(NAVIGATION_FLAG_KEY)
		if (!isNavigationActive) {
			const url = new URL(window.location.href)
			url.searchParams.delete("step")
			window.history.replaceState({}, "", url)
			return "general-info"
		}

		const params = new URLSearchParams(window.location.search)
		return (params.get("step") as CreateBusinessSteps) || "general-info"
	}
	const getStoredFormData = (): CreateBusinessFormData => {
		if (typeof window === "undefined") return { name: "", description: "" }

		const isNavigationActive = sessionStorage.getItem(NAVIGATION_FLAG_KEY)

		if (!isNavigationActive) {
			sessionStorage.removeItem(STORAGE_KEY)
			return { name: "", description: "" }
		}

		const stored = sessionStorage.getItem(STORAGE_KEY)
		return stored ? JSON.parse(stored) : { name: "", description: "" }
	}
	const [formData, setFormData] =
		useState<CreateBusinessFormData>(getStoredFormData)
	const [activeStep, setActiveStep] =
		useState<CreateBusinessSteps>(getStepFromURL)

	useEffect(() => {
		sessionStorage.setItem(NAVIGATION_FLAG_KEY, "true")

		const handleBeforeUnload = () => {
			sessionStorage.removeItem(NAVIGATION_FLAG_KEY)
		}

		window.addEventListener("beforeunload", handleBeforeUnload)

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload)
		}
	}, [])

	useEffect(() => {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
		console.log(formData)
	}, [formData])
	useEffect(() => {
		const handlePopState = () => {
			setActiveStep(getStepFromURL())
		}
		window.addEventListener("popstate", handlePopState)
		return () => window.removeEventListener("popstate", handlePopState)
	}, [])

	const navigateToStep = (step: CreateBusinessSteps) => {
		setActiveStep(step)
		const url = new URL(window.location.href)
		url.searchParams.set("step", step)
		window.history.pushState({}, "", url)
	}

	const updateFormData = (data: Partial<CreateBusinessFormData>) => {
		setFormData((prev) => ({
			...prev,
			...data,
		}))
	}
	return (
		<>
			{activeStep !== "general-info" && (
				<button onClick={() => window.history.back()}>Volver</button>
			)}
			{activeStep === "general-info" && (
				<CreateBusinessGeneralInfo
					navigateToStep={navigateToStep}
					updateFormData={updateFormData}
					formData={formData}
				/>
			)}
		</>
	)
}
