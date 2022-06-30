// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { pipeline } from "stream";

type Data = {
	error?: string;
	message?: string;
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { body } = req;
	fs.writeFile("data.xml", body.xmlContent, (err) => {
		if (err) {
			res.status(500).json({ error: err.message });
		}
	});
	res.setHeader("Content-Type", "text/xml");
	const imageStream = fs.createReadStream(`data.xml`);
	pipeline(imageStream, res, (error) => {
		if (error) console.error(error);
	});
}

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "3mb", // Set desired value here
		},
	},
};
