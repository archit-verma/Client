// __tests__/user-test.js
import {getUser} from "./utils/api";

//testing if it gets blocked when trying to access unauthorised data.
it('should load user data', () => {
    return getUser('uvin1')
        .then(data => {
            // expect(data).toBeDefined()
            expect(data.message).toEqual('not allowed')
        })
})
