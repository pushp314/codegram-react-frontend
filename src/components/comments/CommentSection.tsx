// =============== src/components/comments/CommentSection.tsx ===============
import React, { useEffect } from 'react';
import { useCommentStore } from '../../store/commentStore';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { Spinner } from '../ui/Spinner';

interface CommentSectionProps {
  contentId: {
    snippetId?: string;
    docId?: string;
    bugId?: string;
  };
}

export const CommentSection: React.FC<CommentSectionProps> = ({ contentId }) => {
  const { comments, isLoading, fetchComments, addComment } = useCommentStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    fetchComments(contentId);
  }, [fetchComments, contentId]);

  const handleAddComment = async (content: string) => {
    setIsSubmitting(true);
    await addComment({ content, ...contentId });
    setIsSubmitting(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>
      <div className="mb-6">
        <CommentForm onSubmit={handleAddComment} isSubmitting={isSubmitting} />
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};
