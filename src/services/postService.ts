import { supabase } from '../lib/supabase';
import { Post } from '../types';

export async function createPost(userId: string, content: string | null, imageUrl: string | null) {
  try {
    console.log('📤 createPost called with:', { userId, content, imageUrl });

    // check current supabase session/user before insert
    const sessionResp = await supabase.auth.getSession();
    const userResp = await supabase.auth.getUser();
    console.log('🔐 supabase.auth.getSession():', sessionResp);
    console.log('👤 supabase.auth.getUser():', userResp);

    // test a simple query to prove auth token works
    const ping = await supabase.from('profiles').select('id').limit(1);
    console.log('🧪 test select profiles result:', ping);

    const { data, error } = await supabase
      .from('posts')
      .insert([{ user_id: userId, content, image_url: imageUrl }])
      .select();

    if (error) {
      console.error('❌ Supabase insert error object:', error);
      return { data: null, error };
    }

    console.log('✅ Post created data:', data);
    return { data, error: null };
  } catch (e: any) {
    console.error('🔥 createPost thrown error:', e);
    throw e;
  }
}


export async function fetchFeed(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`id, user_id, content, image_url, created_at, author:profiles(full_name, username, avatar_url)`)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data as unknown as Post[];
}

export async function fetchMyPosts(userId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`id, user_id, content, image_url, created_at`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as unknown as Post[];
}

export async function deletePost(postId: string, userId: string) {
  console.log("🗑️ Deleting post:", postId, "for user:", userId);

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", userId);

  if (error) throw error;
}
