import { useForm } from "react-hook-form"
import type {
	CreateBusinessSteps,
	CreateBusinessFormData,
} from "./create-business-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import {
	FormField,
	FormItem,
	FormLabel,
	Form,
	FormControl,
	FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select"
import { Button } from "../ui/button"

const CITIES = [
	"Artigas",
	"Canelones",
	"Colonia",
	"Durazno",
	"Florida",
	"Fray Bentos",
	"Maldonado",
	"Melo",
	"Mercedes",
	"Minas",
	"Montevideo",
	"Paysandú",
	"Rivera",
	"Rocha",
	"Salto",
	"San José",
	"Tacuarembó",
	"Treinta y Tres",
	"Trinidad",
]

interface Props {
	navigateToStep: (step: CreateBusinessSteps) => void
	updateFormData: (data: Partial<CreateBusinessFormData>) => void

	formData: CreateBusinessFormData
}

const formSchema = z.object({
	name: z
		.string()
		.min(2, { error: "El nombre debe tener al menos 2 caracteres." }),
	description: z.string().optional(),
	city: z.string(),
	address: z.string(),
})

// TODO: this
export const CreateBusinessBranchInfo: React.FC<Props> = ({
	navigateToStep,
	updateFormData,
	formData,
}) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: formData.branchName || formData.name || "",
			description: formData.branchDescription || "",
			city: formData.city || "",
			address: formData.address || "",
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		updateFormData({
			branchName: values.name,
			branchDescription: values.description,
			city: values.city,
			address: values.address,
		})
		navigateToStep("branch-services")
	}
	return (
		<>
			<CardHeader>
				<CardTitle>Información del local</CardTitle>
				<CardDescription>
					Información del local donde se ubica tu negocio
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
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre del local *</FormLabel>
									<FormControl>
										<Input
											type="text"
											{...field}
											required
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descripción</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder="Describe el local brevemente en caso de ser diferente al resto de locales."
											maxLength={200}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex gap-4 flex-wrap">
							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem className="shrink-0">
										<FormLabel>Departamento *</FormLabel>
										<Select
											onValueChange={field.onChange}
											{...field}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Departamento" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{CITIES.map((c) => (
													<SelectItem
														key={c}
														value={c}
													>
														{c}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem className="flex-1 min-w-[200px]">
										<FormLabel>Dirección *</FormLabel>
										<FormControl>
											<Input
												type="text"
												{...field}
												placeholder="Nombre de la calle, 123, esq. Nombre y Nombre"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit">Continuar</Button>
					</form>
				</Form>
			</CardContent>
		</>
	)
}
