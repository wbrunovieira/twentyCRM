import { getObjectMetadataItemsMock } from '@/object-metadata/utils/getObjectMetadataItemsMock';
import { mapObjectMetadataToGraphQLQuery } from '@/object-metadata/utils/mapObjectMetadataToGraphQLQuery';
import { normalizeGQLQuery } from '~/utils/normalizeGQLQuery';

const mockObjectMetadataItems = getObjectMetadataItemsMock();

const personObjectMetadataItem = mockObjectMetadataItems.find(
  (item) => item.nameSingular === 'person',
);

if (!personObjectMetadataItem) {
  throw new Error('ObjectMetadataItem not found');
}

describe('mapObjectMetadataToGraphQLQuery', () => {
  it('should query only specified recordGqlFields', async () => {
    const res = mapObjectMetadataToGraphQLQuery({
      objectMetadataItems: mockObjectMetadataItems,
      objectMetadataItem: personObjectMetadataItem,
      recordGqlFields: {
        company: true,
        xLink: true,
        id: true,
        createdAt: true,
        city: true,
        email: true,
        jobTitle: true,
        name: true,
        phone: true,
        linkedinLink: true,
        updatedAt: true,
        avatarUrl: true,
        companyId: true,
      },
    });
    expect(normalizeGQLQuery(res)).toEqual(
      normalizeGQLQuery(`{
    __typename
    name
    {
      firstName
      lastName
    }
    email
    phone
    createdAt
    avatarUrl
    jobTitle
    city
    id
    xLink
    {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    company
    {
    __typename
    idealCustomerProfile
    id
    xLink
    {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    annualRecurringRevenue
    {
      amountMicros
      currencyCode
    }
    address
    {
      addressStreet1
      addressStreet2
      addressCity
      addressState
      addressCountry
      addressPostcode
      addressLat
      addressLng
    }
    employees
    position
    name
    linkedinLink
    {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    createdAt
    accountOwnerId
    domainName
    {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    updatedAt
    }
    updatedAt
    companyId
    linkedinLink
    {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    }`),
    );
  });

  it('should load only specified operation fields nested', async () => {
    const res = mapObjectMetadataToGraphQLQuery({
      objectMetadataItems: mockObjectMetadataItems,
      objectMetadataItem: personObjectMetadataItem,
      recordGqlFields: { company: { id: true }, id: true, name: true },
    });
    expect(normalizeGQLQuery(res)).toEqual(
      normalizeGQLQuery(`{
__typename
id
company
{
__typename
id
}
name
{
  firstName
  lastName
}
}`),
    );
  });
});
