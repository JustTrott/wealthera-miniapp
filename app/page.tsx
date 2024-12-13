"use client";

import {
	backButton,
	init,
	retrieveLaunchParams,
	User,
} from "@telegram-apps/sdk-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
	const [userData, setUserData] = useState<User | null>(null);

	useEffect(() => {
		try {
			init();
			backButton.mount();
			const { initData } = retrieveLaunchParams();
			setUserData(initData?.user ?? null);
		} catch (error) {
			console.error(error);
		}
	}, []);

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<h1>Welcome, {userData?.firstName}</h1>
				<p>Your Telegram ID: {userData?.id}</p>
				<p>Your Telegram Username: {userData?.username}</p>
				<p>Your Telegram Language: {userData?.languageCode}</p>
				<p>
					Your Telegram Premium: {userData?.isPremium ? "Yes" : "No"}
				</p>
				<Image
					className="dark:invert"
					src="https://nextjs.org/icons/next.svg"
					alt="Next.js logo"
					width={180}
					height={38}
					priority
				/>
			</main>
		</div>
	);
}
