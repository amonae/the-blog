import React, { useContext } from 'react';

import { Layout } from '../../Pages';
import { Post } from '../../Posts';
import { PostContext } from '../../../PostContext';

export function Saved() {
  return (
    <Layout>
      <SavedPosts />
    </Layout>
  );
}

function SavedPosts() {
  let { savedPosts } = useContext(PostContext);

  return savedPosts.map((post) => (
    <Post key={post.id} id={post.id} title={post.title} body={post.body} />
  ));
}
