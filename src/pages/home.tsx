import React from 'react';
import {Header} from '../components/home/Header';
import { Hero } from '../components/home/Hero';
import { Menu } from '../components/home/Menu';
import { Testimonials } from '../components/home/Testimonials';
import { ReservationForm } from '../components/home/ReservationForm';
import { EventsSection } from '../components/home/EventsSection';
import { BlogSection } from '../components/home/BlogSection';
import { supabase } from '../lib/supabase';

function Home() {
  const [featuredDishes, setFeaturedDishes] = React.useState<MenuItem[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = React.useState<BlogPost[]>([]);
  const [events, setEvents] = React.useState<Event[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      // Fetch featured dishes
      const { data: featuredData } = await supabase
        .from('menu_items')
        .select('*')
        .limit(3);

      if (featuredData) {
        setFeaturedDishes(featuredData);
      }

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*');

      if (categoriesData) {
        setCategories(categoriesData);
      }

      // Fetch menu items
      const { data: menuData } = await supabase
        .from('menu_items')
        .select('*');

      if (menuData) {
        setMenuItems(menuData);
      }

      // Fetch testimonials
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true);

      if (testimonialsData) {
        setTestimonials(testimonialsData);
      }

      // Fetch blog posts
      const { data: blogData } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(7);

      if (blogData) {
        setBlogPosts(blogData);
      }

      // Fetch upcoming events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .gte('event_datetime', new Date().toISOString())
        .order('event_datetime', { ascending: true })
        .limit(7);

      if (eventsData) {
        setEvents(eventsData);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero featuredDishes={featuredDishes} />
      <Menu categories={categories} menuItems={menuItems} />
      <Testimonials testimonials={testimonials} />
      <ReservationForm />
      <EventsSection events={events} />
      <BlogSection posts={blogPosts} />
    </div>
  );
}

export default Home;