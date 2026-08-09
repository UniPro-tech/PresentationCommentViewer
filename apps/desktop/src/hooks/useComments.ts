import { useCallback, useState } from "react";
import type { Comment } from "../types/comment";

export function useComments() {
  const [comments, setComments] = useState<Comment[]>([]);

  const addComment = useCallback((text: string) => {
    const comment: Comment = {
      id: crypto.randomUUID(),
      text,
      lane: Math.floor(Math.random() * 5),
    };

    setComments((prev) => [...prev, comment]);
  }, []);

  return {
    comments,
    addComment,
  };
}
