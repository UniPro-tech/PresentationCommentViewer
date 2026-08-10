import { useCallback, useEffect, useState } from "react";

import type { Comment } from "../types/comment";

export function useComments() {
  const [comments, setComments] = useState<Comment[]>([]);

  const addComment = useCallback((text: string) => {
    const comment: Comment = {
      id: crypto.randomUUID(),
      text,
      lane: Math.floor(Math.random() * getLaneCount()),
    };

    setComments((prev) => [...prev, comment]);
  }, []);

  useEffect(() => {
    if (!window.commentAPI) {
      return;
    }

    const unsubscribe = window.commentAPI.onComment((text) => {
      addComment(text);
    });

    return unsubscribe;
  }, [addComment]);

  return {
    comments,
    addComment,
  };
}

export function getLaneCount() {
  const laneHeight = 60;

  return Math.max(1, Math.floor(window.innerHeight / laneHeight));
}
