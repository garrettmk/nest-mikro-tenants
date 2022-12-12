import { User } from '../lib/user.models';

describe('User', () => {
    it('should create a valid fake', () => {
        const result = User.getPropertiesMetadata();
        console.log({ result });

        expect(true).toBeTruthy();
    })
})