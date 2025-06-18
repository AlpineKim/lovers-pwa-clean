/**
 * @jest-environment jsdom
 */
// Jest tests for firebase-auth.js

describe('firebase-auth helpers', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('signIn logs expected message', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    require('./firebase-auth.js');
    window.signIn();
    expect(logSpy).toHaveBeenCalledWith('signIn called');
    logSpy.mockRestore();
  });

  test('signOut logs expected message', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    require('./firebase-auth.js');
    window.signOut();
    expect(logSpy).toHaveBeenCalledWith('signOut called');
    logSpy.mockRestore();
  });
});
