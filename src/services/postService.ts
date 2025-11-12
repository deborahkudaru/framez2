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

export async function toggleLike(postId: string, userId: string, isLiked: boolean) {
  if (!userId) throw new Error("No user");

  if (isLiked) {
    // Unlike
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
    if (error) throw error;
  } else {
    // Like
    const { error } = await supabase
      .from("likes")
      .insert([{ post_id: postId, user_id: userId }]);
    if (error) throw error;
  }
}

// Fetch all posts the user liked
export async function fetchLikesForPosts(userId: string) {
  const { data, error } = await supabase
    .from("likes")
    .select("post_id, user_id")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function fetchLikeCount(postId: string) {
  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);
  if (error) throw error;
  return count || 0;
}
