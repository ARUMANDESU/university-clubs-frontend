import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ClubMember } from '@/types/club'
import { User } from '@/types/user'

const UserAvatar = ({ user, size }: { user: User | ClubMember; size: number }) => {
	return (
		<Avatar style={{ width: size, height: size }}>
			<AvatarImage src={user?.avatar_url} alt={`${user?.first_name}'s profile picture`} />
			<AvatarFallback className="bg-gray-400 dark:bg-[#1E293B]" style={{ fontSize: size / 4 }}>
				{user?.first_name.slice(0, 1)}
			</AvatarFallback>
		</Avatar>
	)
}

export default UserAvatar
