"use client";

import { useRef } from "react";
import { addTransaction } from "../actions/transactions";

export function AddTransactionForm({ telegramId }: { telegramId: string }) {
	const formRef = useRef<HTMLFormElement>(null);

	async function handleSubmit(formData: FormData) {
		const amount = formData.get("amount");
		const type = formData.get("type");

		await addTransaction(telegramId, {
			category: formData.get("category") as string,
			amount: type === "expense" ? -Number(amount) : Number(amount),
			description: formData.get("description") as string,
			date: new Date(),
		});

		formRef.current?.reset();
	}

	return (
		<form
			ref={formRef}
			action={handleSubmit}
			className="flex flex-col gap-4 p-4 rounded-lg border border-foreground/10"
		>
			<div className="grid sm:grid-cols-2 gap-4">
				<div className="flex flex-col gap-2">
					<label htmlFor="category">Category</label>
					<input
						type="text"
						id="category"
						name="category"
						required
						className="p-2 rounded border border-foreground/10 bg-background"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="amount">Amount</label>
					<input
						type="number"
						id="amount"
						name="amount"
						step="0.01"
						required
						min="0"
						className="p-2 rounded border border-foreground/10 bg-background"
					/>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="description">Description (Optional)</label>
				<input
					type="text"
					id="description"
					name="description"
					className="p-2 rounded border border-foreground/10 bg-background"
				/>
			</div>
			<div className="flex gap-4">
				<label className="flex items-center gap-2">
					<input type="radio" name="type" value="income" required />
					Income
				</label>
				<label className="flex items-center gap-2">
					<input type="radio" name="type" value="expense" required />
					Expense
				</label>
			</div>
			<button
				type="submit"
				className="px-4 py-2 rounded bg-foreground text-background hover:opacity-90 transition-opacity"
			>
				Add Transaction
			</button>
		</form>
	);
}
