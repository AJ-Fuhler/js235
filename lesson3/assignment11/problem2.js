async function createProduct() {
  let data = {
    name: 'Cool Pen',
    sku: 'cool100',
    price: 100,
  };

  let json = JSON.stringify(data);

  let response = await fetch('https://ls-230-web-store-demo.herokuapp.com/v1/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'token AUTH_TOKEN',
    },
    body: json,
  });

  if (response.status === 201) {
    console.log(`This product was added: ${await response.text()}`);
  }
}

createProduct();