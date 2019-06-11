import userServices from '../userServices';

describe('UserServices', () => {
  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(userServices)).toHaveLength(3);
  });

  it('should have specific methods', () => {
    expect(userServices.authorizeUser).toBeDefined();
    expect(userServices.getLocale).toBeDefined();
    expect(userServices.logoutUser).toBeDefined();
  });

  it('should return promises for every method', done => {
    const promises = Object.keys(userServices).map(value => userServices[value]());

    Promise.all(promises).then(success => {
      expect(success.length).toEqual(Object.keys(userServices).length);
      done();
    });
  });
});
