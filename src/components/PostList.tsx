import PostItem from './PostItem';

interface PostListProps {
    posts: any[];
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPosts: number;
    postsPerPage: number;
}

export default function PostList({
    posts,
    currentPage,
    setCurrentPage,
    totalPosts,
    postsPerPage,
}: PostListProps) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostItem key={post.id} post={post} />
                ))}
            </div>
            <div className="mt-6 flex justify-center">
                <div className="btn-group">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentPage(idx + 1)}
                            className={`btn ${currentPage === idx + 1 ? 'btn-active' : ''}`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
