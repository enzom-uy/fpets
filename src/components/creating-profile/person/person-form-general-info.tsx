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
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
	email: z.email(),
	name: z
		.string({ error: "Este campo es obligatorio." })
		.min(4, { error: "El nombre debe tener al menos 4 letras." }),
	city: z.string({ error: "Este campo es obligatorio." }),
	address: z.string().optional(),
})

export const PersonFormGeneralInfo: React.FC = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			name: "",
			city: "",
			address: "",
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values)
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
											placeholder="email@example.com"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
