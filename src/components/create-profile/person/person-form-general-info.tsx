"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CITIES } from "@/lib/constants"

interface Props {
	userData: {
		id: string
		email: string
		fullName: string
	}
}

const formSchema = z.object({
	email: z.string().email({ message: "Ingresa un email válido." }),
	name: z
		.string()
		.min(4, { message: "El nombre debe tener al menos 4 caracteres." }),
	city: z.string().min(1, { message: "Debes seleccionar una ciudad." }),
	address: z.string().optional(),
})

export const PersonFormGeneralInfo: React.FC<Props> = ({ userData }) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: userData.email,
			name: userData.fullName,
			city: "",
			address: "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await fetch(
				"http://localhost:3000/api/user/create",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						name: values.name,
						email: values.email,
						city: values.city,
						address: values.address ? values.address : null,
					}),
				},
			)
			console.log("Response: ", response)

			if (!response.ok) {
				throw new Error("Error when trying to create user profile.")
			}

			const data = await response.json()
			console.log("Created profile: ", data)
		} catch (error) {
			// TODO: improve user feedback when error occurs
			console.error("Error: ", error)
		}
	}

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader>
				<CardTitle>Completa tu perfil</CardTitle>
				<CardDescription>
					Ayúdanos a brindarte una mejor experiencia
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
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Correo electrónico</FormLabel>
									<FormControl>
										<Input
											type="email"
											disabled
											{...field}
										/>
									</FormControl>
									<FormDescription className="w-full text-left">
										Este es tu correo de Google y no se
										puede modificar.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre completo *</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Ej: Juan Pérez"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="city"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ciudad *</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Selecciona tu ciudad" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{CITIES.map((city) => (
												<SelectItem
													key={city}
													value={city}
												>
													{city}
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
								<FormItem>
									<FormLabel>Dirección (opcional)</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Ej: Av. 18 de Julio 1234"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full">
							Completar perfil
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
