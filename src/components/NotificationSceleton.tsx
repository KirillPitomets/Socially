import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton"

const NotificationSceleton = () => {

	const skeletonItems = Array.from({ length: 5 }, (_, i) => i);

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Notifications</CardTitle>
						<Skeleton className="h-4 w-20" />
					</div>
				</CardHeader>

				<CardContent className="p-0">
					<ScrollArea>
						{skeletonItems.map(indx => (
							<div key={indx} className="flex items-start gap-4 p-4 border-b">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="flex-1 items-center gap=2">
									<Skeleton className="h-4 w-4" />
									<Skeleton className="h-4 w-4" />
								</div>
								<div className="pl-6 space-y-2">
									<Skeleton className="h-20 w-full" />
									<Skeleton className="h-20 w-24" />
								</div>
							</div>
						))}
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	)
}

export default NotificationSceleton
