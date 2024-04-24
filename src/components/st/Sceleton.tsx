import { Skeleton } from '@/components/ui/skeleton'

export default function Sceleton() {
	return (
		<div className="flex flex-col space-y-3">
			<div className="flex flex-col space-y-3">
				<Skeleton className="h-[200px] w-[400px] rounded-xl" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-[250px]" />
					<Skeleton className="h-4 w-[200px]" />
				</div>
			</div>
			<div className="flex flex-col space-y-3">
				<Skeleton className="h-[200px] w-[400px] rounded-xl" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-[250px]" />
					<Skeleton className="h-4 w-[200px]" />
				</div>
			</div>
			<div className="flex flex-col space-y-3">
				<Skeleton className="h-[200px] w-[400px] rounded-xl" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-[250px]" />
					<Skeleton className="h-4 w-[200px]" />
				</div>
			</div>
			<div className="flex flex-col space-y-3">
				<Skeleton className="h-[200px] w-[400px] rounded-xl" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-[250px]" />
					<Skeleton className="h-4 w-[200px]" />
				</div>
			</div>
		</div>
	)
}