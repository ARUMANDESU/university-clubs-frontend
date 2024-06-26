'use client'
import { Button } from '@/components/ui/button'
import useUserStore from '@/store/user'
import { Club } from '@/types/club'
import { User } from '@/types/user'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import UserAvatar from '@/components/user/userAvatar'
import { Skeleton } from '@/components/ui/skeleton'
import Nav from '@/components/NavBar'

const UserPage = ({ params }: { params: { userID: number } }) => {
	const { user } = useUserStore()
	const [pageowner, setPageowner] = useState<User>()
	const [isOwner, setIsOwner] = useState(false)
	const [clubs, setClubs] = useState<Club[]>()
	const router = useRouter()

	const fetchUserInfo = useCallback(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${params.userID}`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})
					return
				}

				setPageowner(data.user)
				if (user?.id === data.user.id) {
					setIsOwner(true)
				}
			})
			.catch((error) => console.log(error.message))

		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${params.userID}/clubs`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					throw new Error(data.error || 'Failed to fetch user clubs')
				}
				setClubs(data.clubs)
			})
			.catch((error) => console.log(error.message))
	}, [params.userID, user?.id])

	useEffect(() => {
		fetchUserInfo()
	}, [fetchUserInfo])

	return (
		<>
			<Nav />
			<div className="flex flex-col items-center justify-center px-4 py-8 pt-10 text-white dark:bg-[#020817] md:px-8 md:py-12">
				{pageowner ? (
					<div className="relative w-full max-w-xl rounded-lg border bg-accent p-6 pt-10 shadow-lg dark:bg-[#0c1125] md:p-8">
						<div className="flex items-center space-x-4">
							<div className="flex-shrink-0">
								<div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full">
									<UserAvatar user={pageowner} size={95} />
								</div>
							</div>
							<div className="flex-1">
								<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
									{pageowner.first_name} {pageowner.last_name}
								</h1>
								<p className="text-xs text-gray-700 dark:text-gray-400 sm:text-sm">
									{pageowner.email}
								</p>
								<div className="mt-2 flex flex-wrap items-center space-x-2">
									<div className="rounded-md bg-gray-700 px-2 py-1 text-xs">
										{pageowner.major}-{pageowner.group_name}
									</div>
									<div className="rounded-md bg-gray-700 px-2 py-1 text-xs">
										User ID: {params.userID}
									</div>
									<div className="absolute right-4 top-4 rounded-md bg-gray-700 px-2 py-1 text-xs">
										{pageowner.barcode}
									</div>
								</div>
							</div>
						</div>
						<div className="mt-6 md:mt-8">
							{isOwner && (
								<div>
									<Button
										className="w-full bg-blue-200 text-black hover:bg-blue-200/70 dark:bg-white dark:hover:bg-white/70"
										variant="default"
										onClick={() => router.push('/user/edit')}
									>
										Edit Profile
									</Button>
								</div>
							)}
						</div>
					</div>
				) : (
					<div>
						<div className="flex justify-center">
							<Skeleton className="h-56 w-[580px]" />
						</div>
					</div>
				)}
				<div className="mt-6 w-full max-w-xl md:mt-8">
					<h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">Clubs</h2>
					<div className="rounded-lg border bg-accent p-6 shadow-lg dark:bg-[#0c1125] md:p-8">
						{Number(clubs?.length) > 0 ? (
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								{clubs?.map((club) => (
									<div
										key={club.id}
										className="flex cursor-pointer items-center space-x-4 rounded-lg bg-white p-4 shadow-lg transition-transform duration-300 hover:scale-105 dark:bg-gray-800 md:p-6 "
										onClick={() => router.push(`/clubs/${club.id}`)}
									>
										<div className="flex-shrink-0">
											<div className="h-13 w-13 overflow-hidden rounded-full border">
												<Image
													src={club.logo_url ?? '/main_photo.jpeg'}
													alt={`Logo of ${club.name}`}
													width={48}
													height={48}
													className="object-cover"
													style={{ aspectRatio: '48/48', objectFit: 'cover' }}
												/>
											</div>
										</div>
										<div className="flex-1 overflow-hidden">
											<p className="break-words text-lg font-bold text-gray-900 dark:text-white">
												{club.name}
											</p>
											<p className="text-sm text-gray-400">{club.club_type}</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-400">User is not a member of any clubs.</p>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default UserPage
