import React from "react";
import axios from "axios";
import type { NextPage } from "next";
import * as XLSX from "xlsx";

import sources from "../sources";
import Image from "next/image";

const Home: NextPage = ({ allProducts }: any) => {
	const inputRef = React.useRef<HTMLInputElement>(null);

	const downloadExcel = (data: any, name?: string) => {
		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		const checkName = name ? name + ".xlsx" : "AllProducts.xlsx";
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
		//let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
		//XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
		XLSX.writeFile(workbook, checkName);
	};
	return (
		<div className=" h-screen flex flex-col items-center justify-center gap-5">
			<Image src="/placeholder.jpg" alt="Sola Store" width={150} height={150} />
			<h1>Sola Store excel data for all products</h1>
			<input
				ref={inputRef}
				className="shadow appearance-none border rounded w-72 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="username"
				type="text"
				placeholder="Enter your file name here(optional)"
			/>
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded transition-colors duration-300 ease-in-out"
				onClick={() => downloadExcel(allProducts, inputRef.current?.value)}>
				Download File
			</button>
		</div>
	);
};

export default Home;

type CatType = {
	categoryID: number;
	selectedCategoryName: string;
	squareCategoryPictureID: number;
	squareCategoryPictureGuidName: string;
};

export async function getServerSideProps() {
	const { get } = axios;
	const { SOURCE_PROOF, API_URL } = process.env;
	const { data: categories } = await get(
		`${API_URL}/api/Category/GetAll?lang=tr&sourceProof=${SOURCE_PROOF}`
	);
	let allProducts: any = [];
	await Promise.all(
		categories.map(async (category: CatType) => {
			const { data: products } = await get(
				`${API_URL}/api/Product/GetAllByCategoryID?id=${category.categoryID}&lang=tr&sourceProof=${SOURCE_PROOF}`
			);
			allProducts.push(
				...products.map(
					({
						masterProductID,
						lastUpdateDate,
						brandID,
						productShortName,
						productStockCode,
						price,
						oldPrice,
						singlePrice,
						picture_1,
						picture_2,
						picture_3,
						video_1,
						sizes,
					}: any) => ({
						masterProductID,
						lastUpdateDate,
						brandID,
						productShortName,
						productStockCode,
						price,
						oldPrice,
						singlePrice,
						picture_1: `${sources.imageMaxSrc}${picture_1}`,
						picture_2: `${sources.imageMaxSrc}${picture_2}`,
						picture_3: `${sources.imageMaxSrc}${picture_3}`,
						video_1: `${sources.videos}${video_1}`,
						sizes,
					})
				)
			);
		})
	);

	return {
		props: {
			allProducts,
		},
	};
}
