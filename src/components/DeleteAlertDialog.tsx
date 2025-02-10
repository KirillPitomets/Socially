"use client"

import { AlertDialog, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogContent, AlertDialogTrigger, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { Loader2Icon, Trash2Icon } from "lucide-react"



interface IDeleteAlertDialog {
	isDeleting: boolean,
	onDelete: () => Promise<void>
	title?: string
	description?: string
}

function DeleteAlertDialog({ isDeleting, onDelete, title = "Delete post", description = "This action cannot be undone" }: IDeleteAlertDialog) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="text-muted-foreground hover:text-red-500 -mr-2"
				>
					{isDeleting ? (
						<Loader2Icon className="size-4 animate-spin" />
					) : (
						<Trash2Icon className="size-4" />
					)}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={onDelete}
						className="bg-red-500 hover:bg-red-600"
						disabled={isDeleting}
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default DeleteAlertDialog
