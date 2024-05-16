export enum FrontEndPaths {
  ORGANIZATION_INVITATION = 'organization-invitation',
}

export const generateFrontEndLink = (path: FrontEndPaths, query) => {
  return `${process.env.FRONT_END_URL}/${path}?${new URLSearchParams(query).toString()}`;
};
