import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import React from 'react'
import usePendingClubInvites from '@/hooks/usePendingClubInvites'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { toast } from 'sonner'

type DialogViewClubInvites = {
	clubId: number | undefined
}

function DialogViewClubInvites({ clubId }: DialogViewClubInvites) {
	const clubIdNumber = clubId ?? 0
	const {
		pendingClubInvites,
		eventInvites,
		fetchPendingInvites,
		setPendingRequests,
		setEventInvites,
	} = usePendingClubInvites(clubIdNumber)
	const axiosAuth = useAxiosInterceptor()

	const handleAccept = async (inviteId: string) => {
		try {
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubIdNumber}/invites/${inviteId}/handle`,
				{ method: 'POST', data: JSON.stringify({ action: 'accept' }) },
			)
			if (response.status.toString().startsWith('2')) {
				setPendingRequests(pendingClubInvites - 1)
				toast.success('Invite accepted')
				if (eventInvites) {
					setEventInvites(eventInvites.filter((invite) => invite.id !== inviteId))
				}
			}
		} catch (error) {
			console.error('Network error:', error)
			toast.error('Failed to accept invite, maybe user is already organizer.')
		}
	}

	const handleReject = async (inviteId: string) => {
		try {
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubIdNumber}/invites/${inviteId}/handle`,
				{ method: 'POST', data: JSON.stringify({ action: 'reject' }) },
			)
			if (response.status.toString().startsWith('2')) {
				setPendingRequests(pendingClubInvites - 1)
				toast.success('Invite rejected')
				if (eventInvites) {
					setEventInvites(eventInvites.filter((invite) => invite.id !== inviteId))
				}
			}
		} catch (error) {
			console.error(error)
		}
	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="secondary"
					className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#ffffff] dark:hover:bg-[#ffffff]/90"
				>
					Invites{' '}
					{pendingClubInvites > 0 && (
						<span className={pendingClubInvites > 0 ? 'text-red-500' : ''}>
							{`(+${pendingClubInvites})`}
						</span>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Event Invites</DialogTitle>
					<DialogDescription>Review and respond to your upcoming event invites.</DialogDescription>
				</DialogHeader>
				{eventInvites && (
					<div className="space-y-3">
						{eventInvites.map((invite) => (
							<div className="grid gap-2 bg-gray-900" key={invite.id}>
								<div className="grid grid-cols-[50px_1fr_auto] items-center rounded-lg border p-2">
									<div className="rounded-full">
										{invite.event.cover_images?.[0]?.url ? (
											<img
												src={invite.event.cover_images[0].url}
												alt={invite.event.title}
												className="h-10 w-10 rounded-full"
											/>
										) : (
											<div className="h-10 w-10 rounded-full bg-gray-700" />
										)}
									</div>
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium">{invite.event.title}</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">{invite.club.name}</p>
									</div>

									<div className="flex gap-2">
										<Button
											size="sm"
											className="bg-gray-900 text-green-500"
											variant="outline"
											onClick={() => handleAccept(invite.id)}
										>
											Accept
										</Button>
										<Button
											size="sm"
											variant="ghost"
											className="text-red-500"
											onClick={() => handleReject(invite.id)}
										>
											Reject
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default DialogViewClubInvites
