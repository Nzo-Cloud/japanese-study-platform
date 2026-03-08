import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/quiz-results — Fetch quiz history for the authenticated user.
 * POST /api/quiz-results — Save a new quiz result.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Validate required fields
  if (!body.quiz_type || !body.jlpt_level || body.score === undefined || !body.total_questions) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('quiz_results')
    .insert({
      user_id: user.id,
      quiz_type: body.quiz_type,
      jlpt_level: body.jlpt_level,
      score: body.score,
      total_questions: body.total_questions,
      accuracy: body.accuracy || (body.score / body.total_questions) * 100,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Increment user quiz count (best-effort)
  try {
    const { data: profile } = await supabase
      .from('users')
      .select('total_quizzes_taken')
      .eq('id', user.id)
      .single();
    if (profile) {
      await supabase
        .from('users')
        .update({ total_quizzes_taken: (profile.total_quizzes_taken || 0) + 1 })
        .eq('id', user.id);
    }
  } catch {
    // Silently fail — quiz result is already saved
  }

  return NextResponse.json(data, { status: 201 });
}
