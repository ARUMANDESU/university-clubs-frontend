'use client'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { Event } from '@/types/event'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import useClubStore from '@/store/club'
import Link from 'next/link'
import EventCreationComponent from '@/components/clubs/settings/EventCreationComponent'
import useUserStore from '@/store/user'
import DialogViewClubInvites from '@/components/clubs/events/DialogViewClubInvites'
import { getEventStatus } from '@/lib/eventStatusUtils'

export default function EventsContent() {
	const user = useUserStore()
	const [events, setEvents] = useState<Event[]>()
	const isEventOrganizer = (event: Event) => {
		return event.organizers.some((organizer) => organizer.id === user.user?.id)
	}

	const { club } = useClubStore()
	const axiosAuth = useAxiosInterceptor()

	// COLOR

	const fetchClubEvents = useCallback(async () => {
		try {
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club?.id}/events/manage?page=1&page_size=30`,
				{
					method: 'GET',
				},
			)

			if (response.status.toString().startsWith('2')) {
				setEvents(response.data.events)
			} else {
				console.log('Failed to fetch events')
			}
		} catch (err) {
			console.log('Network Error: Unable to fetch events')
		}
	}, [club?.id])

	useEffect(() => {
		fetchClubEvents()
	}, [])

	return (
		<main className="flex flex-1 flex-col gap-4 bg-accent p-4 dark:bg-[#0D1525] md:gap-8 md:p-6">
			<div className="flex flex-col items-center gap-4 sm:flex-row">
				<h1 className="text-lg font-semibold md:text-2xl">Events</h1>
				<div className="flex flex-col items-center gap-4 sm:ml-auto sm:flex-row">
					{/*<div className="relative w-full max-w-md">*/}
					{/*	<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />*/}
					{/*	<Input*/}
					{/*		className="h-9 w-full rounded-md border border-gray-200 bg-white pl-8 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"*/}
					{/*		placeholder="Search events..."*/}
					{/*		type="search"*/}
					{/*	/>*/}
					{/*</div>*/}
					<div className="flex gap-3">
						<DialogViewClubInvites clubId={club?.id} />
					</div>
					<div className="flex flex-col gap-4 sm:flex-row">
						{/*<DropdownMenuEvent />*/}
						<EventCreationComponent clubID={club?.id} onEventCreated={fetchClubEvents} />
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{events?.map((event) => {
					const eventStatusMapping = getEventStatus(event?.status || 'DRAFT')

					return (
						<div
							key={event.id}
							className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#0D1525]"
						>
							<h3 className="text-lg font-medium">{event.title || 'No Title'}</h3>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{new Date(event.created_at).toLocaleString()}
							</p>
							<div className="flex flex-row justify-between">
								{event.status === 'DRAFT' ? (
									<div className="my-2 flex items-center space-x-2 text-xs">
										<AlertTriangle className="h-5 w-5 text-yellow-500" />
										<div className="rounded-md bg-yellow-500 px-2 py-2 text-xs text-white">
											{eventStatusMapping.label}
										</div>
									</div>
								) : (
									<div className="my-2 flex items-center space-x-2 text-xs">
										<div
											className={`rounded-md px-2 py-2 text-xs text-white ${eventStatusMapping.color}`}
										>
											{eventStatusMapping.label}
										</div>
									</div>
								)}
								<div className="flex items-center justify-between">
									{isEventOrganizer(event) && (
										<Link href={`/events/${event.id}`}>
											<Button className="w-18 h-8 bg-blue-200 p-4 text-gray-900 hover:bg-blue-200/70 dark:bg-[#ffffff] dark:hover:bg-[#ffffff]/90">
												View Event
											</Button>
										</Link>
									)}
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</main>
	)
}
