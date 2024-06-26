'use client'
import Nav from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import UserAvatar from '@/components/user/userAvatar'
import useClub from '@/hooks/useClub'
import { Club, ClubMember } from '@/types/club'
import {
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import useUserStore from '@/store/user'
import BackgroundClubImage from '@/components/clubs/BackgroundClubImage'
import HandleJoinDialog from '@/components/clubs/members/HandleJoinDialog'
import useUserRolesStore from '@/store/useUserRoles'
import { hasPermission } from '@/helpers/permissions'
import { Permissions } from '@/types/permissions'
import Error from 'next/error'
import useMemberRoles from '@/hooks/useMemberRoles'
import useUserClubStatus from '@/hooks/useUserClubStatus'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
function Page({ params }: { params: { clubID: number } }) {
	const [data, setData] = useState([] as ClubMember[])
	const { user } = useUserStore()
	const { club, loading } = useClub({ clubID: params.clubID, user: user })

	const { memberStatus } = useUserClubStatus({
		clubID: params.clubID,
	})
	useMemberRoles({
		club: club || null,
		user: user,
		userStatus: memberStatus,
		shouldFetch: memberStatus === 'MEMBER',
	})

	const [page] = useState(1)
	const [pageSize] = useState(25)
	const [, setFirstPage] = useState(1)
	const [, setLastPage] = useState(1)
	const [, setTotalRecords] = useState(25)
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<ClubMember>()
	const axiosAuth = useAxiosInterceptor()
	const fetchPendingClubs = useCallback(() => {
		console.log(params.clubID)
		axiosAuth(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${params.clubID}/join?page=${page}&page_size=${pageSize}`,
		)
			.then(async (res) => {
				if (!res.status.toString().startsWith('2')) {
					toast.error('not found', {
						description: res.data.error,
					})
				}

				setData(res.data.users)
				setFirstPage(res.data.metadata.first_page)
				setLastPage(res.data.metadata.last_page)
				setTotalRecords(res.data.metadata.total_records)
			})
			.catch((error) => console.log(error.message))
	}, [params.clubID, page, pageSize])

	const onHandle = (userID: number, status: 'approved' | 'rejected') => {
		axiosAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club?.id}/members`, {
			method: 'POST',
			data: JSON.stringify({ user_id: userID, status: status }),
		})
			.then(async (res) => {
				if (!res.status.toString().startsWith('2')) {
					toast.error(`failed to ${status}`, {
						description: res.data.error,
					})
					return
				}

				toast.success(`${status}!`)
			})
			.catch((error) => console.log(error.message))
			.finally(() => {
				setIsDialogOpen(false)
				fetchPendingClubs()
			})
	}

	useEffect(() => {
		fetchPendingClubs()
	}, [page, pageSize, fetchPendingClubs])

	const handleRowClick = (user: ClubMember) => {
		setSelectedUser(user)
		setIsDialogOpen(true)
	}

	const table = useReactTable({
		data,
		columns: [],
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	const { permissions } = useUserRolesStore()
	//if do not have any permissions or not owner return nonauth
	if (!hasPermission(permissions, Permissions.manage_membership) && !loading) {
		return <Error statusCode={401} />
	}
	return (
		<div>
			<Nav />
			<BackgroundClubImage club={club} />

			<Tabs
				className="grid flex-1 items-start gap-4 p-4 sm:px-64 sm:py-8 md:gap-8"
				defaultValue="all"
			>
				<Link href={`/clubs/${club?.id}/settings`}>
					<Button variant={'outline'}>Return to settings</Button>
				</Link>
				<TabsContent value="all">
					<Card x-chunk="dashboard-06-chunk-0">
						<CardHeader>
							<CardTitle>Requested to join members</CardTitle>
							<CardDescription>
								Manage your members requests. You can either accept / reject.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									{table.getHeaderGroups().map((headerGroup) => (
										<TableRow key={headerGroup.id}>
											{headerGroup.headers.map((header) => (
												<TableHead key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(header.column.columnDef.header, header.getContext())}
												</TableHead>
											))}
										</TableRow>
									))}
								</TableHeader>
								<TableBody>
									{data?.map((c) => (
										<TableRow
											key={c.id}
											onClick={() => {
												handleRowClick(c)
											}}
										>
											<TableCell>{c.barcode}</TableCell>
											<TableCell>
												<Link
													href={`/user/${c.id}`}
													className="flex flex-row items-center space-x-2.5"
												>
													<UserAvatar user={c} size={44} />
													<p>
														{c.last_name} {c.first_name}
													</p>
												</Link>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{selectedUser && (
				<HandleJoinDialog
					onHandle={onHandle}
					isOpen={isDialogOpen}
					selectedUser={selectedUser}
					club={club ?? ({} as Club)}
					onClose={() => {
						setIsDialogOpen(false)
					}}
				/>
			)}
		</div>
	)
}

export default Page
