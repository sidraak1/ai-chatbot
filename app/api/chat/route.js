import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = 'You are an AI-powered customer support assistant for Headstarter AI, a platform specializing in AI-powered interviews for software engineering jobs. Your role is to assist users with inquiries about the platform, including account setup, interview processes, technical difficulties, and general questions about the services offered. Always respond in a professional, friendly, and informative manner, and aim to provide clear and concise answers to help users have the best experience on the platform.'

export async function POST(req) {
	const openai = new OpenAI()
	const data = await req.json()

	const completion = await openai.chat.completions.create({
		messages: [
			{
			role: 'system',
			content: systemPrompt,
			},
		...data,
		],
		model: 'gpt-4o-mini',
		stream: true,
	})

	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder()
			try{
				for await (const chunk of completion){
					const content = chunk.choices[0].delta.content
					if (content) {
						const text = encoder.encode(content)
						controller.enqueue(text)
					}
				}
			}
			catch(err) {
				controller.error(err)
			}
			finally {
				controller.close()
			}
		},	
	})

	return new NextResponse(stream)
}