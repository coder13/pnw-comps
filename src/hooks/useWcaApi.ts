'use client'

// curl https://www.worldcubeassociation.org/oauth/token -X POST -F grant_type=password -F client_id=$CLIENT_ID -F client_secret=$CLIENT_SECRET -F username=$EMAIL -F password=$PASSWORD

import { useCallback, useEffect, useState } from "react";

type User = {
  name: string;
  id: number;
}

export default function useWcaApi() {
  const [accessToken, setAccessToken] = useState('');
  const [me, setMe] = useState<User | null>(null);

  // useEffect(() => {
  //   if (accessToken) {
  //     localStorage.setItem('access_token', accessToken);
  //   } else {
  //     localStorage.removeItem('access_token');
  //   }
  // }, [accessToken]);

  const fetchAccessToken = useCallback(async () => {
    const res = await fetch('/api/login');
    const { me, access_token } = await res.json();

    setAccessToken(access_token);
    setMe(me);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      fetchAccessToken();
    }

  }, [accessToken, fetchAccessToken]);

  const apiFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const res = await fetch(`https://www.worldcubeassociation.org/api/v0${url}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      },
    });

    return await res.json();
  }, [accessToken]);

  return {
    user: me,
    accessToken,
    apiFetch,
  }
}
