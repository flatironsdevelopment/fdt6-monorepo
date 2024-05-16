import { handleResponse } from './utils'

describe('handleResponse function', () => {
  test('should return JSON data when response is ok', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: 'someData' })
    } as any as Response
    const result = await handleResponse(mockResponse)
    expect(result).toEqual({ data: 'someData' })
  })

  test('should throw an error with the message from the response when response is not ok', async () => {
    const errorMessage = 'Error message from API'
    const mockErrorResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({ message: errorMessage })
    } as any as Response

    try {
      await handleResponse(mockErrorResponse)
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe(errorMessage)
    }
  })
})
