"use client";

import useWcaApi from "../hooks/useWcaApi";

export const Header = () => {
  const { user } = useWcaApi();

  return <div>Logged in as {user?.name}</div>;
};
