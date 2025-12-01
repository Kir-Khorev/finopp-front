import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question = (body?.question || '').toString().trim();

    if (!question) {
      return NextResponse.json(
        { error: 'Пожалуйста, введите вопрос.' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'API ключ Groq не настроен на сервере.' },
        { status: 500 }
      );
    }

    const completion = await client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: question,
        },
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const answer =
      completion.choices[0]?.message?.content?.trim() ||
      'Модель не вернула текст ответа.';

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error('Groq chat error:', error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          'Произошла ошибка при запросе к Groq. Подробности в логах сервера.',
      },
      { status: 500 }
    );
  }
}


