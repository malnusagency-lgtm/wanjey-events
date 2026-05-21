import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { error } = await supabase.from('leads').insert([{
      name: data.name,
      email: data.email,
      phone: data.phone,
      event_type: data.service,
      event_date: data.date ? new Date(data.date).toISOString() : null,
      message: `Company: ${data.company || 'N/A'}\nBudget: ${data.budget || 'N/A'}\n\n${data.message}`,
      status: 'New'
    }]);

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
