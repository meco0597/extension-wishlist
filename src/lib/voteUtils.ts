import { auth, db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function fetchUserVotes(postId: string) {
    const user = auth.currentUser;
    if (!user) return false;

    const voteRef = collection(db, `posts/${postId}/votes`);
    const userVoteQuery = query(voteRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(userVoteQuery);

    return !querySnapshot.empty;
};