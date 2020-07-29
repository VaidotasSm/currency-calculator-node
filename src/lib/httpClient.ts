import fetch from 'node-fetch';

export interface Response<T> {
  status: number;
  body: T;
}

export async function get<T>(fullUrl: string): Promise<Response<T>> {
  /* return {
    status: 200,
    // @ts-ignore
    body: {
      rates: {
        USD: 1.1717,
        GBP: 0.90968,
        ILS: 4.0021,
      },
      base: 'EUR',
      date: '2020-07-28',
    }
  }; */

  // eslint-disable-next-line no-unreachable
  const res = await fetch(fullUrl, {
    method: 'get',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
  if (!res || !res.body) {
    throw new Error('Something wen wrong with request');
  }
  const body = await res.json();

  if (!res.ok) {
    throw res;
  }
  return { status: res.status, body: body as T };
}
