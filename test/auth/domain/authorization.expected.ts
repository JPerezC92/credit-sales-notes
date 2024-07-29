export const authorizationExpected = {
	accessToken: expect.objectContaining({
		value: expect.any(String),
		type: 'Bearer',
	}),
	refreshToken: expect.objectContaining({
		value: expect.any(String),
	}),
};
