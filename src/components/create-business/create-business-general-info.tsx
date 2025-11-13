"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import type {
	CreateBusinessFormData,
	CreateBusinessSteps,
} from "./create-business-form"
import { Button } from "../ui/button"

const formSchema = z.object({
	name: z
		.string()
		.min(2, { error: "El nombre debe tener al menos 2 caracteres." }),
	description: z.string().optional(),
})

interface Props {
	navigateToStep: (step: CreateBusinessSteps) => void
	updateFormData: (data: Partial<CreateBusinessFormData>) => void

	formData: CreateBusinessFormData
}

export const CreateBusinessGeneralInfo: React.FC<Props> = ({
	navigateToStep,
	updateFormData,
	formData,
}) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: formData.name || "",
			description: formData.description || "",
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		updateFormData(values)
		navigateToStep("branch-info")
	}
	return (
		<Card className="w-full max-w-2xl">
			<CardHeader>
				<CardTitle>Información básica</CardTitle>
				<CardDescription>Cuéntanos sobre tu negocio</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre del Negocio</FormLabel>
									<FormControl>
										<Input
											type="text"
											{...field}
											placeholder="Ej: Veterinaria San Francisco"
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descripción breve</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder="Describe tu negocio en pocas palabras. ¿Qué servicios ofreces? ¿Qué te hace especial?"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button type="submit">Continuar</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
