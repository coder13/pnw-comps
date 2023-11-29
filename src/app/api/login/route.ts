const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

const fetchAccessToken = async () => {
  const res = await fetch('https://www.worldcubeassociation.org/oauth/token', {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      username: EMAIL!,
      password: PASSWORD!,
      scope: 'public manage_competitions email'
    }),
  });

  return await res.json() as {
    access_token: string,
    refresh_token: string,
    token_type: 'Bearer',
    expires_in: number,
    scope: string,
    created_at: number
  };
};

const getMe = async (access_token: string) => {
  const res = await fetch('https://www.worldcubeassociation.org/api/v0/me', {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${access_token}`
    },
  });

  return await res.json();
};

export async function GET() {
  const { access_token, refresh_token, } = await fetchAccessToken();

  const { me } = await getMe(access_token);

  return Response.json({ me, access_token, refresh_token })
}

