import React from 'react';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '../lib/utils';
import type { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <time className="text-sm text-gray-500" dateTime={post.published_at}>
          {formatDate(post.published_at)}
        </time>
        <h3 className="mt-2 text-xl font-semibold text-gray-900 group-hover:text-gray-600">
          {post.title}
        </h3>
        <p className="mt-3 text-gray-500 line-clamp-3">
          {post.content}
        </p>
        <div className="mt-4">
          <button className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700">
            Read more
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}