/**
 * Markdown Content Parser
 * 
 * Parses markdown files for blog posts and educational content.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

// Types
export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
  featured?: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

// Directories
const updatesDirectory = path.join(process.cwd(), "src/content/updates");
const learnDirectory = path.join(process.cwd(), "src/content/learn");

/**
 * Ensure directory exists
 */
function ensureDirectoryExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Get all posts from a directory
 */
function getPostsFromDirectory(directory: string): PostMeta[] {
  ensureDirectoryExists(directory);
  
  const fileNames = fs.readdirSync(directory).filter((name) => name.endsWith(".md"));
  
  const allPosts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(directory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    
    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      author: data.author || "SilverInfo Team",
      category: data.category || "General",
      tags: data.tags || [],
      image: data.image,
      featured: data.featured || false,
    } as PostMeta;
  });
  
  // Sort by date (newest first)
  return allPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Get a single post by slug
 */
async function getPostBySlug(directory: string, slug: string): Promise<Post | null> {
  ensureDirectoryExists(directory);
  
  const fullPath = path.join(directory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  
  // Convert markdown to HTML (with GFM support for tables, strikethrough, etc.)
  const processedContent = await remark()
    .use(gfm) // GitHub Flavored Markdown (tables, strikethrough, task lists)
    .use(html, { sanitize: false }) // Allow all HTML
    .process(content);
  const contentHtml = processedContent.toString();
  
  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: data.date || new Date().toISOString(),
    author: data.author || "SilverInfo Team",
    category: data.category || "General",
    tags: data.tags || [],
    image: data.image,
    featured: data.featured || false,
    content: contentHtml,
  };
}

// ============================================================================
// UPDATES / BLOG POSTS
// ============================================================================

/**
 * Get all blog posts (updates)
 */
export function getAllUpdates(): PostMeta[] {
  return getPostsFromDirectory(updatesDirectory);
}

/**
 * Get a single blog post by slug
 */
export async function getUpdateBySlug(slug: string): Promise<Post | null> {
  return getPostBySlug(updatesDirectory, slug);
}

/**
 * Get all update slugs for static generation
 */
export function getAllUpdateSlugs(): string[] {
  ensureDirectoryExists(updatesDirectory);
  
  return fs
    .readdirSync(updatesDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

/**
 * Get featured updates
 */
export function getFeaturedUpdates(limit: number = 3): PostMeta[] {
  const updates = getAllUpdates();
  return updates.filter((post) => post.featured).slice(0, limit);
}

/**
 * Get recent updates
 */
export function getRecentUpdates(limit: number = 5): PostMeta[] {
  return getAllUpdates().slice(0, limit);
}

// ============================================================================
// LEARN / EDUCATIONAL CONTENT
// ============================================================================

/**
 * Get all learn articles
 */
export function getAllLearnArticles(): PostMeta[] {
  return getPostsFromDirectory(learnDirectory);
}

/**
 * Get a single learn article by slug
 */
export async function getLearnArticleBySlug(slug: string): Promise<Post | null> {
  return getPostBySlug(learnDirectory, slug);
}

/**
 * Get all learn article slugs for static generation
 */
export function getAllLearnSlugs(): string[] {
  ensureDirectoryExists(learnDirectory);
  
  return fs
    .readdirSync(learnDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Get reading time estimate
 */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, "");
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + "...";
}
