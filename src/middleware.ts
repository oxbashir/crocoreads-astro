import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase/server';
import { isSupabaseConfigured } from './lib/supabase/config';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return next();
  }

  if (!isSupabaseConfigured(context.locals)) {
    return context.redirect('/admin/login?setup=1');
  }

  try {
    const supabase = createSupabaseServerClient(context.cookies, context.locals);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return context.redirect('/admin/login');
    }

    context.locals.user = user;
  } catch {
    return context.redirect('/admin/login');
  }

  return next();
});
