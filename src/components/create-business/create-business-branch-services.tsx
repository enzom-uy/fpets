"use client"

import { z } from "zod"
import type {
	CreateBusinessFormData,
	CreateBusinessSteps,
} from "./create-business-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Checkbox } from "../ui/checkbox"
import { Button } from "../ui/button"

const formSchema = z.object({
	services: z
		.array(z.string())
		.min(1, { error: "Debes agregar al menos un servicio." }),
})

interface Props {
	navigateToStep: (step: CreateBusinessSteps) => void
	updateFormData: (data: Partial<CreateBusinessFormData>) => void

	formData: CreateBusinessFormData
}

const BRANCH_SERVICES = [
	{ id: "consulta-general", label: "Consulta general" },
	{ id: "vacunacion", label: "Vacunación" },
	{ id: "desparasitacion", label: "Desparasitación" },
	{
		id: "diagnostico-imagen",
		label: "Diagnóstico por imagen (rayos X, ecografía, etc.)",
	},
	{
		id: "laboratorio-clinico",
		label: "Laboratorio clínico (análisis de sangre, orina, etc.)",
	},
	{ id: "cirugia-general", label: "Cirugía general" },
	{ id: "esterilizacion", label: "Esterilización / Castración" },
	{ id: "odontologia", label: "Odontología veterinaria" },
	{ id: "emergencias-24hs", label: "Emergencias 24 hs" },
	{ id: "hospitalizacion", label: "Hospitalización / Internación" },
	{ id: "peluqueria", label: "Peluquería y estética" },
	{ id: "banio-higienico", label: "Baño higiénico" },
	{ id: "nutricion", label: "Nutrición y control de peso" },
	{
		id: "certificados",
		label: "Certificados y trámites (viajes, sanidad, etc.)",
	},
	{
		id: "venta-productos",
		label: "Venta de productos (alimentos, accesorios, medicamentos)",
	},
	{ id: "microchip", label: "Implante de microchip" },
	{ id: "geriatricos", label: "Cuidados geriátricos" },
	{ id: "domicilio", label: "Atención a domicilio" },
	{ id: "rehabilitacion", label: "Rehabilitación / fisioterapia" },
	{ id: "cremacion", label: "Cremación / servicio funerario" },
]

export const CreateBusinessBranchServices: React.FC<Props> = ({
	formData,
	updateFormData,
	navigateToStep,
}) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			services: formData.services || [],
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		updateFormData(values)
		console.log("FormData: ", formData)
	}

	const toggleAll = () => {
		const currentServices = form.getValues("services")
		if (currentServices.length === BRANCH_SERVICES.length) {
			form.setValue("services", [])
		} else {
			form.setValue(
				"services",
				BRANCH_SERVICES.map((s) => s.id),
			)
		}
	}

	return (
		<>
			<CardHeader>
				<CardTitle>Servicios del local</CardTitle>
				<CardDescription>
					Agrega los servicios que ofrece el local
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="services"
							render={() => (
								<FormItem>
									<div className="flex justify-between items-center mb-3">
										<FormLabel>
											Servicios disponibles *
										</FormLabel>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={toggleAll}
										>
											{form.watch("services").length ===
											BRANCH_SERVICES.length
												? "Desmarcar todos"
												: "Marcar todos"}
										</Button>
									</div>
									<div className="space-y-2">
										{BRANCH_SERVICES.map((service) => (
											<FormField
												key={service.id}
												control={form.control}
												name="services"
												render={({ field }) => {
													return (
														<FormItem
															key={service.id}
															className="flex flex-row items-start space-x-3 space-y-0"
														>
															<FormControl>
																<Checkbox
																	id={
																		service.id
																	}
																	checked={field.value?.includes(
																		service.id,
																	)}
																	onCheckedChange={(
																		checked,
																	) => {
																		return checked
																			? field.onChange(
																					[
																						...field.value,
																						service.id,
																					],
																				)
																			: field.onChange(
																					field.value?.filter(
																						(
																							value,
																						) =>
																							value !==
																							service.id,
																					),
																				)
																	}}
																/>
															</FormControl>
															<label
																htmlFor={
																	service.id
																}
																className="text-sm font-normal leading-none cursor-pointer select-none"
															>
																{service.label}
															</label>
														</FormItem>
													)
												}}
											/>
										))}
									</div>
								</FormItem>
							)}
						/>
						<Button type="submit">Enviar</Button>
					</form>
				</Form>
			</CardContent>
		</>
	)
}
