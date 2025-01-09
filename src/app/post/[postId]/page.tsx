"use client";

import SignlePost from "@/imgs/components/singlePost/SignlePost";
import { useDespatchCostum, useSelectorCustom } from "../../../Hooks/EditReactReduxHooks";
import { GetSinglePost } from "../../../StateManagement/slices/postsSlice";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "../../loading";

export default function PostDetails() {
  const { postId } = useParams<any>();
  const dispatch = useDespatchCostum();
  const { post } = useSelectorCustom((store) => store.PostsReducer);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
    if (postId) {
      setLoading(true);
      dispatch(GetSinglePost(postId))
        .finally(() => setLoading(false));
    }
  }, [dispatch, postId]);


  if (!isClient) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  if (!post) {
    return <Loading />;
  }

  return <SignlePost postInfo={post} />;
}
