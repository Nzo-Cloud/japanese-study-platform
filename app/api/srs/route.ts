import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/* ── In-memory rate limiter ── */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests = 30, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) return false;

  record.count++;
  return true;
}

/**
 * GET /api/srs — Fetch SRS items for the authenticated user.
 *   Query params: ?due=true to filter for due items only.
 * POST /api/srs — Update SRS item state after review.
 */
export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ??
             request.headers.get('x-real-ip') ??
             'anonymous';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429 }
    );
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dueOnly = request.nextUrl.searchParams.get('due') === 'true';

  let query = supabase
    .from('srs_items')
    .select('*')
    .eq('user_id', user.id);

  if (dueOnly) {
    query = query.lte('next_review', new Date().toISOString());
  }

  const { data, error } = await query.order('next_review', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ??
             request.headers.get('x-real-ip') ??
             'anonymous';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429 }
    );
  }

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

  if (!body.item_id || !body.item_type || body.is_correct === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Check if SRS item exists
  const { data: existing } = await supabase
    .from('srs_items')
    .select('*')
    .eq('user_id', user.id)
    .eq('item_id', body.item_id)
    .eq('item_type', body.item_type)
    .single();

  // Calculate SRS update dynamically
  const currentState = existing || {
    interval_days: 1,
    ease_factor: 2.5,
    correct_streak: 0,
  };

  let { interval_days, ease_factor, correct_streak } = currentState;

  if (body.is_correct) {
    interval_days = Math.round(interval_days * ease_factor);
    ease_factor = Math.min(5.0, ease_factor + 0.1);
    correct_streak += 1;
  } else {
    interval_days = 1;
    ease_factor = Math.max(1.3, ease_factor - 0.2);
    correct_streak = 0;
  }

  const now = new Date();
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + interval_days);

  const updateData = {
    interval_days,
    ease_factor: Math.round(ease_factor * 100) / 100,
    correct_streak,
    last_reviewed: now.toISOString(),
    next_review: nextReview.toISOString(),
  };

  if (existing) {
    const { data, error } = await supabase
      .from('srs_items')
      .update(updateData)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } else {
    const { data, error } = await supabase
      .from('srs_items')
      .insert({
        user_id: user.id,
        item_type: body.item_type,
        item_id: body.item_id,
        ...updateData,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  }
}
