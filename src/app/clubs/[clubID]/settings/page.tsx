'use client'
import Nav from '@/components/NavBar'

import MemberRolesRow from '@/components/clubs/members/memberRolesRow'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useClub from '@/hooks/useClub'
import useUserStore from '@/store/user'
import useUserClubStatus from '@/hooks/useUserClubStatus'
import useUserRolesStore from '@/store/useUserRoles'
import useMemberRoles from '@/hooks/useMemberRoles'
import BackgroundClubImage from '@/components/clubs/BackgroundClubImage'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import RolesTab from './_components/RolesTab'
import Settings from '@/app/clubs/[clubID]/settings/_components/Settings'
import { useDragDrop } from '@/hooks/useDragDrop'
import Link from 'next/link'
import Members from '@/app/clubs/[clubID]/settings/_components/Members'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { Permissions } from '@/types/permissions'
import { hasPermission } from '@/helpers/permissions'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import EventsContent from '@/app/clubs/[clubID]/settings/_components/Events'
import ClubImage from '@/components/clubs/ClubImage'
import SceletonMain from '@/components/Sceletons/SkeletonMain'

// TODO MAKE CLUB INFO PATCH ( WRITE PATCH FOR UPDATING CLUB INFO )

function Page({ params }: { params: { clubID: number } }) {
	const { user } = useUserStore()
	const { club, clubMembers, fetchClubInfo, isOwner } = useClub({
		clubID: params.clubID,
		user: user,
	})
	const { memberStatus } = useUserClubStatus({
		clubID: params.clubID,
	})
	useMemberRoles({
		club: club || null,
		user: user,
		userStatus: memberStatus,
		shouldFetch: memberStatus === 'MEMBER',
	})
	const { permissions, highestRole } = useUserRolesStore()
	const axiosAuth = useAxiosInterceptor()
	const { handleDragStart, handleDragOver, handleDrop } = useDragDrop({ club, fetchClubInfo })
	const handleDeleteRole = useCallback(
		async (roleID: number) => {
			const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${params.clubID}/roles/${roleID}`
			try {
				const response = await axiosAuth(apiUrl, {
					method: 'DELETE',
				})

				if (!response.status.toString().startsWith('2')) {
					toast.error('Failed to delete role', {
						description: response.data.error,
					})
					return
				}

				fetchClubInfo()
				console.log('Role deleted successfully')

				toast.success('Role deleted!', {
					action: {
						label: 'X',
						onClick: () => {},
					},
				})
			} catch (e) {
				toast.error('ERROR', {
					description: 'An error occurred while trying to make request to delete role.',
				})
				console.log(e)
			}
		},
		[params.clubID, fetchClubInfo],
	)
	const onUpdate = () => {
		fetchClubInfo()
	}

	if (!club) {
		return <div>Club not found</div>
	}

	return (
		<main className="scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
			<Nav />

			<div className="mx-auto max-w-6xl py-12 ">
				<BackgroundClubImage club={club} />
				<div className=" rounded-lg bg-[#0c1125]">
					<div className="flex items-center justify-between gap-4 p-6">
						<div className="flex items-center">
							<div className="flex shrink-0">
								<ClubImage club={club} width={84} height={84} />
							</div>
							<div className="pl-4">
								<CardTitle>{club?.name}</CardTitle>
								<CardDescription>{club?.description}</CardDescription>
							</div>
						</div>
					</div>
				</div>
				<Tabs className="grid flex-1 items-start" defaultValue="members">
					<TabsList className="grid w-full grid-cols-5">
						<Link
							className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3  text-sm font-medium ring-offset-background"
							href={`/clubs/${club?.id}`}
						>
							Return
						</Link>
						<TabsTrigger value="members">Members</TabsTrigger>
						{hasPermission(permissions, Permissions.manage_roles) ? (
							<TabsTrigger value="roles">Roles</TabsTrigger>
						) : (
							<TabsTrigger value="roles" disabled>
								Roles
							</TabsTrigger>
						)}
						{hasPermission(permissions, Permissions.manage_events) ? (
							<TabsTrigger value="events">Events</TabsTrigger>
						) : (
							<TabsTrigger value="events" disabled>
								Events
							</TabsTrigger>
						)}
						{hasPermission(permissions, Permissions.ALL) ? (
							<TabsTrigger value="settings">Settings</TabsTrigger>
						) : (
							<TabsTrigger value="settings" disabled>
								Settings
							</TabsTrigger>
						)}
					</TabsList>

					<TabsContent value="members">
						<Members
							memberPerms={permissions}
							club={club}
							clubMembers={clubMembers}
							callbackfn={(member) => (
								<MemberRolesRow
									onUpdate={() => fetchClubInfo()}
									member={member}
									roles={club?.roles ?? []}
									clubId={club?.id ?? 0}
									key={member.id}
									addRoleMember={async () => {}}
								/>
							)}
						/>
					</TabsContent>

					<TabsContent value="roles">
						<RolesTab
							club={club}
							handleDragStart={handleDragStart}
							handleDragOver={handleDragOver}
							handleDrop={handleDrop}
							highestRole={highestRole}
							isOwner={isOwner}
							handleDeleteRole={handleDeleteRole}
							fetchClubInfo={fetchClubInfo}
						/>
					</TabsContent>

					<TabsContent value="settings">
						<Settings />
					</TabsContent>

					<TabsContent value="events">
						<div>
							<Card>
								<CardContent style={{ backgroundColor: '#0D1525' }}>
									<EventsContent />
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</main>
	)
}

export default Page
