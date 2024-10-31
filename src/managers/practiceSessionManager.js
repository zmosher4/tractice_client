const url = 'https://tractice-api-9kq3u.ondigitalocean.app';

export const getPracticeSessions = async () => {
  const res = await fetch(`${url}/practicesessions`, {
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
    },
  });
  const practiceSessions = await res.json();
  return practiceSessions;
};

export const getSessionById = async (id) => {
  const res = await fetch(`${url}/practicesessions/${id}`, {
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
    },
  });
  const practiceSession = await res.json();
  return practiceSession;
};

export const createSession = async (session) => {
  return await fetch(`${url}/practicesessions`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(session),
  });
};

export const editSession = async (session) => {
  return await fetch(`${url}/practicesessions/${session.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(session),
  });
};

export const deleteSession = async (sessionId) => {
  await fetch(`${url}/practicesessions/${sessionId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
    },
  });
};
