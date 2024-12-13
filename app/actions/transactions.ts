"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type Transaction = {
	transaction_id: number;
	category: string;
	amount: Prisma.Decimal;
	description?: string | null;
	date: Date;
};

export async function getTransactions(
	telegramId: string
): Promise<Transaction[]> {
	const transactions = await prisma.transaction.findMany({
		where: {
			user: {
				telegram_id: telegramId,
			},
		},
		orderBy: {
			date: "desc",
		},
	});
	return transactions;
}

export async function getCategories(telegramId: string): Promise<Set<string>> {
	const transactions = await prisma.transaction.findMany({
		where: {
			user: {
				telegram_id: telegramId,
			},
		},
		select: {
			category: true,
		},
	});
	return new Set(transactions.map((t) => t.category));
}

export async function getTransactionsByCategory(
	telegramId: string
): Promise<Map<string, Transaction[]>> {
	const transactions = await getTransactions(telegramId);
	const transactionMap = new Map<string, Transaction[]>();

	transactions.forEach((transaction) => {
		const categoryTransactions =
			transactionMap.get(transaction.category) || [];
		categoryTransactions.push(transaction);
		transactionMap.set(transaction.category, categoryTransactions);
	});

	return transactionMap;
}

export async function addTransaction(
	telegramId: string,
	data: {
		category: string;
		amount: number | Prisma.Decimal;
		description?: string;
		date: Date;
	}
) {
	const user = await prisma.user.findUnique({
		where: { telegram_id: telegramId },
	});

	if (!user) throw new Error("User not found");

	const transaction = await prisma.transaction.create({
		data: {
			user_id: user.user_id,
			category: data.category,
			amount: new Prisma.Decimal(data.amount.toString()),
			description: data.description,
			date: data.date,
			created_at: new Date(),
		},
	});

	revalidatePath("/transactions");
	return transaction;
}

export async function editTransaction(
	telegramId: string,
	transactionId: number,
	data: {
		category?: string;
		amount?: number | Prisma.Decimal;
		description?: string | null;
		date?: Date;
	}
) {
	const user = await prisma.user.findUnique({
		where: { telegram_id: telegramId },
	});

	if (!user) throw new Error("User not found");

	const transaction = await prisma.transaction.update({
		where: {
			transaction_id: transactionId,
			user_id: user.user_id,
		},
		data: {
			...data,
			amount: data.amount
				? new Prisma.Decimal(data.amount.toString())
				: undefined,
		},
	});

	revalidatePath("/transactions");
	return transaction;
}

export async function deleteTransaction(
	telegramId: string,
	transactionId: number
) {
	const user = await prisma.user.findUnique({
		where: { telegram_id: telegramId },
	});

	if (!user) throw new Error("User not found");

	await prisma.transaction.delete({
		where: {
			transaction_id: transactionId,
			user_id: user.user_id,
		},
	});

	revalidatePath("/transactions");
}
