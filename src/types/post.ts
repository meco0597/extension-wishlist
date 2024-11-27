export interface Post {
    id: string;
    title: string;
    description: string;
    votes: number;
    userId: string;
    platform: string;
    categories: string[];
    hasVoted?: boolean;
    createdAt: string;
}