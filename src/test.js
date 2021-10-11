async function testRoute(typeOfRoute, path, method, data){
    const init = {
        method: method,
        mode: 'cors',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
    };

    if(data){
        init.body = data instanceof Object ? JSON.stringify(data) : data;
    }
    const res = await fetch(`http://localhost:3001/${path}`, init);
    if(res.ok){
        console.log(`The test of: ${typeOfRoute}, passed successfully`);
    }else{
        console.log(`The test of: ${typeOfRoute} failed`);
    }
}

async function test(){
    await testRoute('login', 'login','POST', {email: "adminTest@ppp.com", password: "Admin1test!", rememberMe: true});
    await testRoute("get all packages", 'packages', 'GET');
    await testRoute("get all items", 'items', 'GET');
    await testRoute("get all boxes", 'boxes', 'GET');
    await testRoute("get cart", 'getCart', 'GET');
    await testRoute("get personal details", 'getPersonalDetails', 'GET');
    await testRoute("get all packages with category: birthday", 'search/birthday', 'GET');
    await testRoute("get all packages with category: birthday, price range:80-350 and gender: unisex", 'filter/birthday/80/350/unisex', 'GET');
    await testRoute("get users activity", 'getUsersActivity', 'GET');
    await testRoute("get filtered users activity", 'getFilteredUsersActivity/ad', 'GET');

    const packageToAdd = {
        id: "package2",
        amount: 1,
        card: [{
            wishes: "happy birthday, love you",
            price: 0,
            type: 0,
            size: 0,
            display: 0
        }]
    }

    const userToUpdate = {
        firstName: "test_updatedFirstName",
        lastName: "test_updatedLastName",
        address: "sesame 10",
        city: "Tel-Aviv",
        region: "Israel",
        telephone: "050-1111111",
    };

    const paymentDetails = {
        creditCardNumber: "1234567890123456",
        expirationMonth: "12",
        expirationYear: 2021,
        cvv: "123"
    }

    const builtPackageDetails = {
        chosenBox: 'box0',
        chosenItems: [ 'item0', 'item1' ]
    }

    await testRoute('update cart', 'updateCart', 'POST', {selectedPackage: packageToAdd, updateType: "add"});
    await testRoute('update personal details', 'updatePersonalDetails', 'PUT', userToUpdate);
    await testRoute('payment', 'payment', 'POST', paymentDetails);
    await testRoute('process built package', 'processBuiltPackage', 'POST', builtPackageDetails);
}

export default test;