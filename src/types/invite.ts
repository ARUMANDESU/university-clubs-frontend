export interface User {
	id: number
	first_name: string
	last_name: string
	barcode: string
	avatar_url: string
}

export interface Club {
	id: number
	name: string
}

export interface OrganizerInvite {
	id: string
	event_id: string
	club_id: number
	by_who_id: number
	user: User
}

export interface CollaboratorInvite {
	id: string
	event_id: string
	club: Club
}
