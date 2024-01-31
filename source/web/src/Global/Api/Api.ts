export default class Api {
  public get() {
    return 123;
  }

  public post(url: string, options: object, body: any): Promise<Response> {
    const realOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
      body: body,
    };
    return fetch(url, realOptions);
  }

  public put() {

  }
}