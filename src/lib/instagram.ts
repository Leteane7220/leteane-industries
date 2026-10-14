export interface EnsembleDataPostItem {
  id?: string;
  code?: string;
  caption?: {
    text?: string;
  };
  taken_at?: number;
  like_count?: number;
  comment_count?: number;
  media_type?: number;
  image_versions2?: {
    candidates?: Array<{ url: string; width: number; height: number }>;
  };
}

export interface EnsembleDataPostsResponse {
  data?: {
    posts?: EnsembleDataPostItem[];
  };
  detail?: string;
}

export const ENSEMBLE_CONFIG = {
  root: "https://ensembledata.com/apis",
  endpoint: "/instagram/user/posts",
  defaultUserId: "6934209395",
  defaultToken: "5f6K4GBvvLwvSViO",
};

/**
 * Fetches Instagram posts for a given user ID using EnsembleData.
 */
export async function fetchInstagramPosts(options?: {
  userId?: string;
  token?: string;
  depth?: number;
}): Promise<EnsembleDataPostsResponse> {
  const userId = options?.userId ?? ENSEMBLE_CONFIG.defaultUserId;
  const token = options?.token ?? ENSEMBLE_CONFIG.defaultToken;
  const depth = options?.depth ?? 1;

  const url = new URL(`${ENSEMBLE_CONFIG.root}${ENSEMBLE_CONFIG.endpoint}`);
  url.searchParams.set("user_id", userId);
  url.searchParams.set("token", token);
  url.searchParams.set("depth", String(depth));

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  const json = (await response.json()) as EnsembleDataPostsResponse;

  if (!response.ok) {
    throw new Error(
      json.detail || `EnsembleData API failed with status ${response.status}`,
    );
  }

  return json;
}

export interface EnsembleDataTikTokItem {
  aweme_id?: string;
  desc?: string;
  create_time?: number;
  author?: {
    unique_id?: string;
    nickname?: string;
  };
  statistics?: {
    digg_count?: number;
    comment_count?: number;
    play_count?: number;
    share_count?: number;
  };
}

export interface EnsembleDataTikTokResponse {
  data?: EnsembleDataTikTokItem[] | { aweme_list?: EnsembleDataTikTokItem[] };
  detail?: string;
}

export const TIKTOK_CONFIG = {
  root: "https://ensembledata.com/apis",
  endpoint: "/tt/user/posts",
  defaultUsername: "uj_university",
  defaultToken: "5f6K4GBvvLwvSViO",
};

/**
 * Fetches TikTok posts for a given username using EnsembleData.
 */
export async function fetchTikTokPosts(options?: {
  username?: string;
  token?: string;
  depth?: number;
}): Promise<EnsembleDataTikTokResponse> {
  const username = (options?.username ?? TIKTOK_CONFIG.defaultUsername).replace(/^@/, "");
  const token = options?.token ?? TIKTOK_CONFIG.defaultToken;
  const depth = options?.depth ?? 1;

  const url = new URL(`${TIKTOK_CONFIG.root}${TIKTOK_CONFIG.endpoint}`);
  url.searchParams.set("username", username);
  url.searchParams.set("token", token);
  url.searchParams.set("depth", String(depth));

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  const json = (await response.json()) as EnsembleDataTikTokResponse;

  if (!response.ok) {
    throw new Error(
      json.detail || `EnsembleData TikTok API failed with status ${response.status}`,
    );
  }

  return json;
}

