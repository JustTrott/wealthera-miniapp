import { getTransactions } from "../actions/transactions";

export async function TransactionList({ telegramId }: { telegramId: string }) {
	const transactions = await getTransactions(telegramId);

	if (!transactions.length) {
		return <p>No transactions yet.</p>;
	}

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">Your Transactions</h2>
			<div className="grid gap-4">
				{transactions.map((transaction) => (
					<div
						key={transaction.transaction_id}
						className="p-4 rounded-lg border border-foreground/10"
					>
						<div className="flex justify-between items-start">
							<div>
								<p className="font-medium">
									{transaction.category}
								</p>
								<p className="text-sm text-foreground/60">
									{transaction.description}
								</p>
							</div>
							<p
								className={`font-mono ${
									Number(transaction.amount) < 0
										? "text-red-500"
										: "text-green-500"
								}`}
							>
								{Number(transaction.amount).toLocaleString(
									"en-US",
									{
										style: "currency",
										currency: "USD",
									}
								)}
							</p>
						</div>
						<p className="text-sm text-foreground/60 mt-2">
							{transaction.date.toLocaleDateString()}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
