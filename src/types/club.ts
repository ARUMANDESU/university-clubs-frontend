import { Permissions } from './permissions'

export type Club = {
	id: number
	name: string
	description?: string
	club_type?: string
	logo_url?: string
	banner_url?: string
	num_of_members?: number
	roles?: ClubRole[]
	social_links?: string[]
}

export type ClubMember = {
	id: number
	first_name: string
	last_name: string
	avatar_url: string
	email: string
	barcode: string
	roles: number[]
}

export type ClubRole = {
	id: number
	name: string
	permissions: Permissions
	position: number
	color: number
}

export type UserClubStatus = 'NOT_MEMBER' | 'PENDING' | 'MEMBER' | 'BANNED'
