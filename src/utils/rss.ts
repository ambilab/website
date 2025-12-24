export function getBlogPostLink(postId: string): string {
  return `/blog/${postId.replace(/\.(mdx|md)$/, '').replace(/^[^/]+\//, '')}`;
}
