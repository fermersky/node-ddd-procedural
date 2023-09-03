(async () => {
  const promises = [];
  for (let i = 0; i < 10; i++) {
    const p = fetch(`http://localhost:8000/driver/login`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: 'andrew@mail.com',
        password: '123',
      }),
    });

    promises.push(p);
  }
  const test = await Promise.allSettled(promises);
  console.log(test.map((r) => console.log(r.value.status)));
})();
