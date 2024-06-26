'use client'
import Nav from '@/components/NavBar'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

function debounce<T extends (...args: any[]) => any>(
	func: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timerId: ReturnType<typeof setTimeout> | null = null
	return (...args: Parameters<T>) => {
		if (timerId) {
			clearTimeout(timerId)
		}
		timerId = setTimeout(() => {
			func(...args)
		}, delay)
	}
}

const Page = () => {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')
	const [successful, setSuccessful] = useState(false)
	const [loading, setLoading] = useState(true)

	const activateAccount = async (token: string) => {
		try {
			let response = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/activate?token=${token}`,
				{
					method: 'POST',
				},
			)

			if (response.ok) {
				toast('Account activated successfully!')
				setSuccessful(true)
				setLoading(false)
			}

			let errorData = await response.json()

			toast.error('Account activation error', {
				description: errorData.error,
			})
			setLoading(false)

			throw new Error(errorData.error || 'Account activation failed')
		} catch (e) {}
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedActivateAccount = useCallback(debounce(activateAccount, 500), [])

	useEffect(() => {
		if (token) {
			debouncedActivateAccount(token)
		} else {
			toast.error('You need to provide an activation token')
		}
	}, [token, debouncedActivateAccount])

	return (
		<div>
			<Nav />
			{loading ? (
				<div>loading</div>
			) : successful ? (
				<div>Your Account Activated</div>
			) : (
				<div>Failed to Activate Your Account</div>
			)}
		</div>
	)
}

export default Page
