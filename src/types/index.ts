export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  dietary_tags: string[];
  is_available: boolean;
}

export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

export interface Testimonial {
  id: number;
  user_id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  event_datetime: string;
  location: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author_id: string;
  published_at: string;
}