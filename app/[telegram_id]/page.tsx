import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AddTransactionForm } from "./add-transaction-form";
import { TransactionList } from "./transaction-list";

export default async function UserPage({
	params,
}: {
	params: { telegram_id: string };
}) {
	const user = await prisma.user.findUnique({
		where: { telegram_id: params.telegram_id },
	});

	if (!user) {
		redirect("/");
	}

	return (
		<div className="grid grid-rows-[auto_1fr] min-h-screen p-8 gap-8">
			<header>
				<h1 className="text-2xl font-bold">
					Welcome, {user.telegram_id}
				</h1>
			</header>
			<main className="flex flex-col gap-8">
				<AddTransactionForm telegramId={params.telegram_id} />
				<TransactionList telegramId={params.telegram_id} />
			</main>
		</div>
	);
}
