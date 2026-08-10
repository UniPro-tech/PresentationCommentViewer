import type { Comment as CommentType } from "../types/comment";

type Props = {
  comment: CommentType;
};

export function Comment({ comment }: Props) {
  return (
    <div
      className="comment"
      style={{
        top: `${comment.lane * 60 * window.devicePixelRatio}px`,
      }}
    >
      {comment.text}
    </div>
  );
}
