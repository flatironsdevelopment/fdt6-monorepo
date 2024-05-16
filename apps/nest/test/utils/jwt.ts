import * as nock from 'nock';

export const jwksEndpoint = (host) => {
  return nock(host)
    .get('/.well-known/jwks.json')
    .reply(200, {
      keys: [
        {
          alg: 'RS256',
          e: 'AQAB',
          kid: 'LKZrpKlDWjcHFvJPbVqvinw5+2SNhjwKIMzpESFMEEQ=',
          kty: 'RSA',
          n: '5QLAqquaAy3Hhojj9DfKjtcD2rOcBXcKeQkRuHVSImKiHZRrJo41hLXkh8fj5lTW4k2acaDcLIUzwCfSlNn6DE7iqIdCRYbOE_9vBeK3h7j6v1Yy15Uu0KWG1JYBrYh7aWuW7ykrzFiD7dmV7Kv9c8oZpdHjcvBLM_PDViKCLCdDooWH-6AmtV3XzBgR98ZLZ5XcF0hysoRKbD1AB_lIhVQD2xUxoih15fva932X1lmKOW48QBg_bZbYg4B5MCbiPM9MH-wb8LyI1-3-2Hf0VOaiwge43p3GiKzWQjqf26Gw60RsjmkuVREPlCQuQ0vxWMrNxpJ0j1kUyxM7cXiNCw',
          use: 'sig',
        },
        {
          alg: 'RS256',
          e: 'AQAB',
          kid: 'darqCXTCvdwnXcyxJHZWJ4Nk1vflKH6RAll8tJZPehg=',
          kty: 'RSA',
          n: '5mpFllEcInqce1bu0HGfVzGkhj553sszBeXOGN6C3VD5ZZ7EL9u_Zum0OIbIkSDlnB5mQ_BPwvrmTV56OlCASTPK7URMOTdPaHKPxEYs21tGyaD1ablPb6490MZrE4mo-xYTqoOrt-HE8i6CTMUvT9vlJ-7-GyPHa7fFKFY335HoHX1L8rgPiq63726RC2r38RQ6fVxulZm0Ot_u7wBIEDiNmz9VlBpERuNtvvtEZ4law60hI0ZpZ-7VaBuZulprvHCcLKw9wMRd4MLzVd9S2kxyM2kCQ67hjXx-vV2wofIL0fkSGwf0n5cBl7y5uhMsjAsgU3Q06RWqGJGHrAsC0w',
          use: 'sig',
        },
      ],
    });
};

export const testAccessToken =
  'eyJraWQiOiJkYXJxQ1hUQ3Zkd25YY3l4SkhaV0o0TmsxdmZsS0g2UkFsbDh0SlpQZWhnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3NDk3ZTAzZC02NjYzLTQ0MzItOTk4OS0xMmM0MDliNDM1MTgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl81REVZTHZ2RkoiLCJjbGllbnRfaWQiOiI2MWxobmJybmFqNGowOTMwcGV2am92MjJrMSIsIm9yaWdpbl9qdGkiOiI5MjU1NmM2My1lNGY3LTRkYWQtYTAyMy01MjYxMDVkYzY2ZTIiLCJldmVudF9pZCI6ImZkYWU0NzE4LWE4N2YtNDJmOC1iOWU4LWUxMGM5NGYyZWRhYiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MDE4ODU1NTUsImV4cCI6MTcwMTg4OTE1NSwiaWF0IjoxNzAxODg1NTU1LCJqdGkiOiJkNWJiOGMyYS1jMjExLTRlZWEtYjRiZS04MGNhNTAwZTgwNDAiLCJ1c2VybmFtZSI6Ijc0OTdlMDNkLTY2NjMtNDQzMi05OTg5LTEyYzQwOWI0MzUxOCJ9.BqrABPp2B3Fa_zE6rg2KQlZqqNo77No-QoEtX9ynCYM48Pv--4s9hXY-xoJ_M-ibVYERyZr1DjEGQdUjxXE2FscGFEIfqt9te5-T-ceNNgHk32JxtJlfscTQjxDSzw7XPy763VEMw9Z8lFWM7gN8SUzV3qLdplzpaKrpahDFUyUDTwzMn-9m8R81_GsTZcQrqwVqTrtauA-wUUX6mNlBJXsSplKJt36Gdk7Wi6saN_o6-G6R2jUC5sfHGsnc6i_uZ5A1kOMx_7I9pjVllYMAi8PumwQxSd3DZKLQgtwETywNTzH5aIlOJFueWg-vE_5Kbc7Rdw6_tiQXEx-9AYOclw';
