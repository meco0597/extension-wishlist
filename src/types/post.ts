export interface Post {
    id: string;
    title: string;
    description: string;
    votes: number;
    userId: string;
    source: string;
    hasVoted?: boolean;
    createdAt: string;
}