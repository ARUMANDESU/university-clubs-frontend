import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'
import { Club } from '@/types/club'
import { hasPermission } from '@/helpers/permissions'
import { Permissions } from '@/types/permissions'
import useUserRolesStore from '@/store/useUserRoles'

export default function ClubPageButtons(props: {
	memberPerms: Permissions
	club: Club
	loggedIn: boolean
	loading: boolean
	memberStatus: 'NOT_MEMBER' | 'PENDING' | 'MEMBER' | 'BANNED'
	onClick: () => Promise<void>
	owner: boolean
	onClick1: () => Promise<void>
}) {
	return (
		<div className="flex flex-col gap-3 md:flex-row">
			{props.loggedIn && !props.loading && (
				<>
					{hasPermission(props.memberPerms, Permissions.ALL) && (
						<div className=" flex flex-col gap-3 md:flex-row">
							<Link href={`/clubs/${props.club?.id}/settings`}>
								<Button
									variant="default"
									className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#ffffff] dark:hover:bg-[#ffffff]/90"
								>
									Settings
								</Button>
							</Link>
						</div>
					)}
					{hasPermission(props.memberPerms, Permissions.manage_posts) && (
						<Link href={`/clubs/${props.club?.id}/posts`}>
							<Button className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#ffffff] dark:hover:bg-[#ffffff]/90">
								Posts
							</Button>
						</Link>
					)}
					<div>
						{props.memberStatus === 'NOT_MEMBER' && (
							<Button
								className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#ffffff] dark:hover:bg-[#ffffff]/90"
								onClick={props.onClick}
							>
								Join Club
							</Button>
						)}
						{props.memberStatus === 'PENDING' && <Button disabled>Pending</Button>}
						{props.memberStatus === 'BANNED' && (
							<Button disabled variant="destructive">
								You are banned
							</Button>
						)}
						{!props.owner && props.memberStatus === 'MEMBER' && (
							<Button variant="destructive" onClick={props.onClick1}>
								Leave Club
							</Button>
						)}
					</div>
				</>
			)}
		</div>
	)
}
