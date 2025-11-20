import { createClient } from '@/lib/supabaseClient';

export async function mergeEntriesAfterLogin(anonId: string) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user || !anonId) return;

  const { error } = await supabase.rpc('merge_entries', { p_anon_id: anonId });
  if (error) console.error('merge_entries error', error);
}