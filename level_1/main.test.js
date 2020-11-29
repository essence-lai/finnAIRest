import app from './index.js';
import supertest from 'supertest';
const request =  supertest(app);
import "babel-polyfill" 

describe('Home Page', function () {
    it("should display main page response", async done => {
        const response = await request.get('/');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Hi FinnAI');
        done()
    });
});

describe('Id Route', function () {
    it("return a random generated id", async done => {
        const response = await request.get('/id');

        expect(response.status).toBe(200);
        expect(response.text).toBeDefined();
        done()
    });

    it("should generate unique ids", async done => {
        const response1 = await request.get('/id'),
            response2 = await request.get('/id');

        expect(response1.status).toBe(200);
        expect(response2.status).toBe(200);

        expect(response1.text).toBeDefined();
        expect(response2.text).toBeDefined();

        expect(response1.text).not.toEqual(response2.text);
        done()
    });
});

describe('Users Route', function () {
    it("return initial list of users", async done => {
        const response = await request.get('/users');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.length).toEqual(10);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({id: "0ba65450-33e1-4b57-afcd-0fea4bbcf613"}),
            ])
        )
        done()
    });

    it("should find existing user", async done => {
        const response = await request.get('/users/0ba65450-33e1-4b57-afcd-0fea4bbcf613');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body).toEqual({ id:"0ba65450-33e1-4b57-afcd-0fea4bbcf613", fName:"Dorella", lName:"Beckley", age:14 });
        done()
    });

    it("should not find an invalid id user", async done => {
        const response = await request.get('/users/invalidId');

        expect(response.status).toBe(404);
        expect(response.text).toEqual(`[GET][users][invalidId] User invalidId Not Found`);
        done()
    });

    it("should be able to create a user", async done => {
        const response = await request.post('/users').send({ "fName": "Bob", "lName": "Ross", "age": 23 });

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.text).toEqual('Successfully added user Bob Ross');

        const responseUsers = await request.get('/users');  
        expect(responseUsers.status).toBe(200);
        expect(responseUsers.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({fName: "Bob", lName: "Ross", age: 23}),
            ])
        )
        done()
    });

    it("should not be able to create an invalid user missing all required fields", async done => {
        const response = await request.post('/users').send({ "someotherPeropret": 1 });

        expect(response.status).toBe(400);
        expect(response.text).toEqual("Bad Request Bad Inputfname:String, lname:String, age:Integer");
        done()
    });

    it("should not be able to create an invalid user missing valid age", async done => {
        const response = await request.post('/users').send({ "fName": "Not a number", "lName": "Ross", "age": "Not a number" });

        expect(response.status).toBe(400);
        expect(response.text).toEqual("Bad Request Bad Inputfname:String, lname:String, age:Integer");
        done()
    });

    it("should not be able to create an invalid user valid fname", async done => {
        const response = await request.post('/users').send({ "fName": 123, "lName": "Ross", "age": 1 });

        expect(response.status).toBe(400);
        expect(response.text).toEqual("Bad Request Bad Inputfname:String, lname:String, age:Integer");
        done()
    });

    it("should not be able to delete an invalid user", async done => {
        const response = await request.delete('/users/abc');

        expect(response.status).toBe(404);
        expect(response.text).toEqual("[GET][users][abc] User abc Not Found");
        done()
    });

    it("should be able to delete an existing user", async done => {
        const response = await request.delete('/users/0ba65450-33e1-4b57-afcd-0fea4bbcf613');

        expect(response.status).toBe(200);
        expect(response.text).toEqual(`[DELETE][users][0ba65450-33e1-4b57-afcd-0fea4bbcf613] Dorella Beckley removed`);

        const responseUsers = await request.get('/users');  
        expect(responseUsers.status).toBe(200);
        expect(responseUsers.body).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({fName: "Dorella", lName: "Beckley", age: 14}),
            ])
        )
        done()
        done()
    });
});