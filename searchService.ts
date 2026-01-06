import { GUIDELINE_DATA, GuidelineChunk } from '../data/guidelineContent';

export const SearchService = {
  search: (query: string): GuidelineChunk[] => {
    const trimmedQuery = query.trim().toLowerCase();
    
    if (trimmedQuery.length < 2) return [];

    return GUIDELINE_DATA.filter(chunk => {
      // 1. Check tags (High priority match)
      const tagMatch = chunk.tags.some(tag => tag.includes(trimmedQuery));
      
      // 2. Check title
      const titleMatch = chunk.title.toLowerCase().includes(trimmedQuery);
      
      // 3. Check content body
      const contentMatch = chunk.content.toLowerCase().includes(trimmedQuery);

      return tagMatch || titleMatch || contentMatch;
    }).sort((a, b) => {
      // Simple relevance sorting: Title matches first
      const aTitle = a.title.toLowerCase().includes(trimmedQuery);
      const bTitle = b.title.toLowerCase().includes(trimmedQuery);
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      return 0;
    });
  }
};