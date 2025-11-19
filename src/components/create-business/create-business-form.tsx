"use client"

import { useEffect, useState } from "react"
import { CreateBusinessGeneralInfo } from "./create-business-general-info"
import { CreateBusinessBranchInfo } from "./create-business-branch-info"
import { Card } from "../ui/card"
import { CreateBusinessBranchServices } from "./create-business-branch-services"

export type CreateBusinessSteps =
	| "general-info"
	| "branch-info"
	| "branch-services"
const STORAGE_KEY = "create-business-form"
const NAVIGATION_FLAG_KEY = "create-business-navigation-active"

export interface CreateBusinessFormData {
	name: string
	description: string
	branchName: string
	branchDescription: string
	city: string
	address: string
	services: string[]
}

const emptyFormData: CreateBusinessFormData = {
	name: "",
	description: "",
	branchName: "",
	branchDescription: "",
	city: "",
	address: "",
	services: [],
}

export const CreateBusinessForm = () => {
	// TODO: think if i can refactor this to be more reusable (already have something similar in "handle-creating-profile-form")
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
		if (typeof window === "undefined") return emptyFormData

		const isNavigationActive = sessionStorage.getItem(NAVIGATION_FLAG_KEY)

		if (!isNavigationActive) {
			sessionStorage.removeItem(STORAGE_KEY)
			return emptyFormData
		}

		const stored = sessionStorage.getItem(STORAGE_KEY)
		return stored ? JSON.parse(stored) : emptyFormData
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
			<Card className="w-full max-w-2xl">
				{activeStep === "general-info" && (
					<CreateBusinessGeneralInfo
						navigateToStep={navigateToStep}
						updateFormData={updateFormData}
						formData={formData}
					/>
				)}
				{activeStep === "branch-info" && (
					<CreateBusinessBranchInfo
						navigateToStep={navigateToStep}
						updateFormData={updateFormData}
						formData={formData}
					/>
				)}
				{activeStep === "branch-services" && (
					<CreateBusinessBranchServices
						navigateToStep={navigateToStep}
						updateFormData={updateFormData}
						formData={formData}
					/>
				)}
			</Card>
		</>
	)
}
