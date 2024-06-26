import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Club } from '@/types/club'
import React, { MouseEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAxiosInterceptor } from '@/helpers/fetch_api'

const roleFormSchema = z.object({
	name: z
		.string()
		.min(4, { message: 'Role name must be at least 4 characters.' })
		.max(20, { message: 'Role name can not be more than 20 characters' }),
	color: z.string(),
})

const RoleCreateForm: React.FC<{
	club: Club
	onClose: () => void
	onCreateSuccess: () => void
}> = ({ club, onClose, onCreateSuccess }) => {
	const form = useForm<z.infer<typeof roleFormSchema>>({
		resolver: zodResolver(roleFormSchema),
		defaultValues: {
			name: '',
			color: '#000000',
		},
	})

	const axiosAuth = useAxiosInterceptor()

	const createRole = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const values = form.getValues()
		const hexColor = values.color
		const decimalColor = parseInt(hexColor.slice(1), 16)

		const updatedValues = {
			...values,
			color: decimalColor,
		}

		try {
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club.id}/roles`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					data: JSON.stringify(updatedValues),
				},
			)

			if (response.status !== 200) {
				toast.error('Failed to create role', { description: response.data.error })
				return
			}

			toast.success('Role successfully created!')
			onCreateSuccess()
			onClose()
		} catch (error) {
			toast.error('ERROR', { description: 'An error occurred while trying to create role.' })
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={createRole} onClick={(e) => e.stopPropagation()}>
				<FormField
					name="name"
					render={({ field }) => (
						<FormItem className="mb-4">
							<FormLabel>Role Name</FormLabel>
							<FormControl>
								<Input placeholder="Role Name" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					name="color"
					render={({ field }) => (
						<FormItem className="mb-4">
							<FormLabel>Role Color</FormLabel>
							<FormControl>
								<Input type="color" style={{ height: '80px' }} {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<Button
					className="mt-8 bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#ffffff] dark:hover:bg-[#ffffff]/90"
					type="submit"
				>
					Create Role
				</Button>
			</form>
		</Form>
	)
}

export function DialogCreateClubRole({
	club,
	onCreateSuccess,
}: {
	club: Club
	onCreateSuccess: () => void
}) {
	const [isOpen, setIsOpen] = useState(false)
	const toggleDialog = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		event.stopPropagation()
		setIsOpen(!isOpen)
	}
	const handleCreateSuccess = () => {
		onCreateSuccess()
		console.log('handleCreateSuccess Role created successfully')
	}
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant={'default'}
					className="right-0 w-40 bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#ffffff] dark:hover:bg-[#ffffff]/90"
					onClick={toggleDialog}
				>
					Create Role
				</Button>
			</DialogTrigger>
			{isOpen && (
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create Role</DialogTitle>
					</DialogHeader>
					<RoleCreateForm
						club={club}
						onClose={() => setIsOpen(false)}
						onCreateSuccess={handleCreateSuccess}
					/>
				</DialogContent>
			)}
		</Dialog>
	)
}
