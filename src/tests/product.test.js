const app = require('../app');
const request = require('supertest');
const Image = require('../models/Image');
require('../models');

let token;

beforeAll(async () => {
    const body = {
        email:'test@gmail.com',
        password:'test1234'
    }
    const res = await request(app).post('/users/login').send(body);
    token = res.body.token;
})

test('GET /products', async () => { 
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
 })

 test('POST /products', async () => { 
   
    const body = { 
        title: 'Redmi 11',
        description: 'Camera 50mp',
        brand: 'Xiaomi',
        price:'250.99'
    }
    const res = await request(app).post('/products').send(body).set('Authorization', `Bearer ${token}`);
    id= res.body.id
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(body.title);
    expect(res.body.id).toBeDefined();
    
 });

 test('PUT /products/:id', async () => {
    const body ={
        title:'iPhone 12'
    }    
    const res = await request(app).put(`/products/${id}`).send(body).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(body.title);
});

test('POST /products/:id/images', async () => {
    const image = await Image.create({ url: 'http://cualquiercosa.jpg', publicId: 'id'})
    const res = await request(app)
    .post(`/products/${id}/images`)
    .send([image.id])
    .set('Authorization', `Bearer ${token}`);
    await image.destroy();
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
});

test('DELETE /products/:id', async () => { 
    const res= await request(app).delete(`/products/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});

