interface Participant {
  id: number
  username: string
  name: string
  avatar_template: string
  post_count: number
  primary_group_name: null
  flair_name: null
  flair_url: null
  flair_color: null
  flair_bg_color: null
  moderator: boolean
  trust_level: number
}

interface Post {
  id: number
  name: string
  username: string
  avatar_template: string
  created_at: string
  cooked: string
  post_number: number
  post_type: number
  updated_at: string
  reply_count: number
  reply_to_post_number: null
  quote_count: number
  incoming_link_count: number
  reads: number
  readers_count: number
  score: number
  yours: boolean
  topic_id: number
  topic_slug: string
  display_username: string
  primary_group_name: null
  flair_name: null
  flair_url: null
  flair_bg_color: null
  flair_color: null
  version: number
  can_edit: boolean
  can_delete: boolean
  can_recover: boolean
  can_wiki: boolean
  link_counts: {
    url: string
    internal: boolean
    reflection: boolean
    title: string
    clicks: number
  }[]
  read: boolean
  user_title: null
  bookmarked: boolean
  actions_summary: {
    id: number
    count: number
    can_act: boolean
  }[]
  moderator: boolean
  admin: boolean
  staff: boolean
  user_id: number
  hidden: boolean
  trust_level: number
  deleted_at: null
  user_deleted: boolean
  edit_reason: null
  can_view_edit_history: boolean
  wiki: boolean
  can_vote: boolean
}

export interface Topic {
  post_stream: {
    posts: Post[]
    stream: number[]
  }
  timeline_lookup: [number, number][]
  tags: string[]
  id: number
  title: string
  fancy_title: string
  posts_count: number
  created_at: string
  views: number
  reply_count: number
  like_count: number
  last_posted_at: string
  visible: boolean
  closed: boolean
  archived: boolean
  has_summary: boolean
  archetype: string
  slug: string
  category_id: number
  word_count: number
  deleted_at: null
  user_id: number
  featured_link: null
  pinned_globally: boolean
  pinned_at: null
  pinned_until: null
  image_url: null
  slow_mode_seconds: number
  draft: null
  draft_key: string
  draft_sequence: number
  posted: boolean
  unpinned: null
  pinned: boolean
  current_post_number: number
  highest_post_number: number
  last_read_post_number: number
  last_read_post_id: number
  deleted_by: null
  actions_summary: {
    id: number
    count: number
    hidden: boolean
    can_act: boolean
  }[]
  chunk_size: number
  bookmarked: boolean
  bookmarked_posts: null
  topic_timer: null
  message_bus_last_id: number
  participant_count: number
  show_read_indicator: boolean
  thumbnails: null
  slow_mode_enabled_until: null
  can_vote: boolean
  vote_count: number
  user_voted: boolean
  details: {
    can_edit: boolean
    notification_level: number
    notifications_reason_id: null
    can_create_post: boolean
    participants: Participant[]
    created_by: {
      id: number
      username: string
      name: string
      avatar_template: string
    }
    last_poster: {
      id: number
      username: string
      name: string
      avatar_template: string
    }
    links: {
      url: string
      title: string
      internal: boolean
      attachment: boolean
      reflection: boolean
      clicks: number
      user_id: number
      domain: string
      root_domain: string
    }[]
  }
  pending_posts: []
}
