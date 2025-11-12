export type Profile = {
  id: string;           // uuid = auth.user.id
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
  author?: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
};
