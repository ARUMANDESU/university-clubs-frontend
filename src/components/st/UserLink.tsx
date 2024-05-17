import React from 'react'
import Link from 'next/link'
import UserAvatar from '@/components/userAvatar'
import { ClubMember } from '@/types/club' // replace with your actual User type

interface UserLinkProps {
	user: ClubMember
}

const UserLink: React.FC<UserLinkProps> = ({ user }) => {
	return (
		<Link
			href={`/user/${user.user_id}`}
			className="flex w-full flex-row items-center space-x-3.5 px-2"
			key={user.user_id}
		>
			<UserAvatar user={user} />
			<p
				style={{
					color: '#fff',
				}}
			>
				{user.last_name} {user.first_name}
			</p>
		</Link>
	)
}

export default UserLink
