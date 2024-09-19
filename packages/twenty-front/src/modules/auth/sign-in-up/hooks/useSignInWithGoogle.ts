import { useParams } from 'react-router-dom';

import { useAuth } from '@/auth/hooks/useAuth';

export const useSignInWithGoogle = () => {
  const workspaceInviteHash = useParams().workspaceInviteHash;
  const { signInWithGoogle } = useAuth();
  return { signInWithGoogle: () => signInWithGoogle(workspaceInviteHash) };
};
