import React from 'react';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import type { BlogPost } from '../types';

interface FeaturedPostProps {
  post: BlogPost;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <article className="relative isolate flex flex-col gap-8 lg:flex-row">
      <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
        <img
          src="https://images.unsplash.com/photo-1496412705862-e0088f16f791?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          alt=""
          className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
      </div>
      <div>
        <div className="flex items-center gap-x-4 text-xs">
          <time dateTime={post.published_at} className="text-gray-500">
            {formatDate(post.published_at)}
          </time>
          <span className="relative z-10 rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600">
            Featured
          </span>
        </div>
        <div className="group relative max-w-xl">
          <h3 className="mt-3 text-2xl font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            {post.title}
          </h3>
          <p className="mt-5 text-sm leading-6 text-gray-600">
            {post.content}
          </p>
          <div className="mt-6">
            <button className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700">
              Read full story
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}