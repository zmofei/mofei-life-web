"use client"
import CommentInput from './CommentInput';

interface ReplyInputProps {
    commentId: string;
    onSubmit: (commentId: string, content: string) => void;
    onCancel: (commentId: string) => void;
    isPosting: boolean;
    lang: string;
}

export default function ReplyInput({ 
    commentId, 
    onSubmit, 
    onCancel, 
    isPosting, 
    lang 
}: ReplyInputProps) {
    return (
        <CommentInput
            onSubmit={({ content }) => {
                onSubmit(commentId, content);
            }}
            onCancel={() => onCancel(commentId)}
            isPosting={isPosting}
            lang={lang}
            replyId={commentId}
            showAvatar={true}
            showUserFields={true}
        />
    );
}