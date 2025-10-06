import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, company } = await req.json();

    if (!title || !company) {
      return NextResponse.json(
        { error: 'Missing title or company' },
        { status: 400 }
      );
    }

    const prompt = `Write a professional and engaging job description for a ${title} position at ${company}. Include key responsibilities, skills required, and company culture in around 120–150 words.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const description = response.choices[0]?.message?.content?.trim() || '';

    return NextResponse.json({ description });
  } catch (error: any) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      { error: 'Failed to generate job description' },
      { status: 500 }
    );
  }
}
