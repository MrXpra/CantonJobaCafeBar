import React from 'react';
import { formatDate } from '../lib/utils';
import type { BlogPost } from '../types';
import { BlogCard } from './BlogCard';
import { FeaturedPost } from './FeaturedPost';

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12">Latest Stories</h2>
        
        {featuredPost && <FeaturedPost post={featuredPost} />}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}