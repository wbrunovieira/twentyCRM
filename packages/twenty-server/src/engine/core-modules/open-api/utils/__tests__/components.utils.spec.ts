import {
  fields,
  objectMetadataItemMock,
} from 'src/engine/api/__mocks__/object-metadata-item.mock';
import { computeSchemaComponents } from 'src/engine/core-modules/open-api/utils/components.utils';
import { FieldMetadataType } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';

describe('computeSchemaComponents', () => {
  it('should test all non-deprecated field types', () => {
    expect(fields.map((field) => field.type)).toEqual(
      Object.keys(FieldMetadataType).filter(
        (key) => key !== FieldMetadataType.LINK,
      ),
    );
  });
  it('should compute schema components', () => {
    expect(
      computeSchemaComponents([
        objectMetadataItemMock,
      ] as ObjectMetadataEntity[]),
    ).toEqual({
      ObjectName: {
        type: 'object',
        properties: {
          fieldUuid: {
            type: 'string',
            format: 'uuid',
          },
          fieldText: {
            type: 'string',
          },
          fieldPhone: {
            type: 'string',
          },
          fieldPhones: {
            properties: {
              additionalPhones: {
                type: 'object',
              },
              primaryPhoneCountryCode: {
                type: 'string',
              },
              primaryPhoneNumber: {
                type: 'string',
              },
            },
            type: 'object',
          },
          fieldEmail: {
            type: 'string',
            format: 'email',
          },
          fieldEmails: {
            type: 'object',
            properties: {
              primaryEmail: {
                type: 'string',
              },
              additionalEmails: {
                type: 'object',
              },
            },
          },
          fieldDateTime: {
            type: 'string',
            format: 'date-time',
          },
          fieldDate: {
            type: 'string',
            format: 'date',
          },
          fieldBoolean: {
            type: 'boolean',
          },
          fieldNumber: {
            type: 'integer',
          },
          fieldNumeric: {
            type: 'number',
          },
          fieldLinks: {
            type: 'object',
            properties: {
              primaryLinkLabel: {
                type: 'string',
              },
              primaryLinkUrl: {
                type: 'string',
              },
              secondaryLinks: {
                type: 'array',
                items: {
                  type: 'object',
                  description: 'A secondary link',
                  properties: {
                    url: {
                      type: 'string',
                    },
                    label: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          fieldCurrency: {
            type: 'object',
            properties: {
              amountMicros: {
                type: 'number',
              },
              currencyCode: {
                type: 'string',
              },
            },
          },
          fieldFullName: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string',
              },
              lastName: {
                type: 'string',
              },
            },
          },
          fieldRating: {
            type: 'string',
            enum: ['RATING_1', 'RATING_2'],
          },
          fieldSelect: {
            type: 'string',
            enum: ['OPTION_1', 'OPTION_2'],
          },
          fieldMultiSelect: {
            type: 'string',
            enum: ['OPTION_1', 'OPTION_2'],
          },
          fieldPosition: {
            type: 'number',
          },
          fieldAddress: {
            type: 'object',
            properties: {
              addressStreet1: {
                type: 'string',
              },
              addressStreet2: {
                type: 'string',
              },
              addressCity: {
                type: 'string',
              },
              addressPostcode: {
                type: 'string',
              },
              addressState: {
                type: 'string',
              },
              addressCountry: {
                type: 'string',
              },
              addressLat: {
                type: 'number',
              },
              addressLng: {
                type: 'number',
              },
            },
          },
          fieldRawJson: {
            type: 'object',
          },
          fieldRichText: {
            type: 'string',
          },
          fieldActor: {
            type: 'object',
            properties: {
              source: {
                type: 'string',
                enum: [
                  'EMAIL',
                  'CALENDAR',
                  'WORKFLOW',
                  'API',
                  'IMPORT',
                  'MANUAL',
                ],
              },
            },
          },
        },
        required: ['fieldNumber'],
      },
      'ObjectName for Update': {
        type: 'object',
        properties: {
          fieldUuid: {
            type: 'string',
            format: 'uuid',
          },
          fieldText: {
            type: 'string',
          },
          fieldPhone: {
            type: 'string',
          },
          fieldPhones: {
            properties: {
              additionalPhones: {
                type: 'object',
              },
              primaryPhoneCountryCode: {
                type: 'string',
              },
              primaryPhoneNumber: {
                type: 'string',
              },
            },
            type: 'object',
          },
          fieldEmail: {
            type: 'string',
            format: 'email',
          },
          fieldEmails: {
            type: 'object',
            properties: {
              primaryEmail: {
                type: 'string',
              },
              additionalEmails: {
                type: 'object',
              },
            },
          },
          fieldDateTime: {
            type: 'string',
            format: 'date-time',
          },
          fieldDate: {
            type: 'string',
            format: 'date',
          },
          fieldBoolean: {
            type: 'boolean',
          },
          fieldNumber: {
            type: 'integer',
          },
          fieldNumeric: {
            type: 'number',
          },
          fieldLinks: {
            type: 'object',
            properties: {
              primaryLinkLabel: {
                type: 'string',
              },
              primaryLinkUrl: {
                type: 'string',
              },
              secondaryLinks: {
                type: 'array',
                items: {
                  type: 'object',
                  description: 'A secondary link',
                  properties: {
                    url: {
                      type: 'string',
                    },
                    label: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          fieldCurrency: {
            type: 'object',
            properties: {
              amountMicros: {
                type: 'number',
              },
              currencyCode: {
                type: 'string',
              },
            },
          },
          fieldFullName: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string',
              },
              lastName: {
                type: 'string',
              },
            },
          },
          fieldRating: {
            type: 'string',
            enum: ['RATING_1', 'RATING_2'],
          },
          fieldSelect: {
            type: 'string',
            enum: ['OPTION_1', 'OPTION_2'],
          },
          fieldMultiSelect: {
            type: 'string',
            enum: ['OPTION_1', 'OPTION_2'],
          },
          fieldPosition: {
            type: 'number',
          },
          fieldAddress: {
            type: 'object',
            properties: {
              addressStreet1: {
                type: 'string',
              },
              addressStreet2: {
                type: 'string',
              },
              addressCity: {
                type: 'string',
              },
              addressPostcode: {
                type: 'string',
              },
              addressState: {
                type: 'string',
              },
              addressCountry: {
                type: 'string',
              },
              addressLat: {
                type: 'number',
              },
              addressLng: {
                type: 'number',
              },
            },
          },
          fieldRawJson: {
            type: 'object',
          },
          fieldRichText: {
            type: 'string',
          },
          fieldActor: {
            type: 'object',
            properties: {
              source: {
                type: 'string',
                enum: [
                  'EMAIL',
                  'CALENDAR',
                  'WORKFLOW',
                  'API',
                  'IMPORT',
                  'MANUAL',
                ],
              },
            },
          },
        },
      },
      'ObjectName for Response': {
        type: 'object',
        properties: {
          fieldUuid: {
            type: 'string',
            format: 'uuid',
          },
          fieldText: {
            type: 'string',
          },
          fieldPhone: {
            type: 'string',
          },
          fieldPhones: {
            properties: {
              additionalPhones: {
                type: 'object',
              },
              primaryPhoneCountryCode: {
                type: 'string',
              },
              primaryPhoneNumber: {
                type: 'string',
              },
            },
            type: 'object',
          },
          fieldEmail: {
            type: 'string',
            format: 'email',
          },
          fieldEmails: {
            type: 'object',
            properties: {
              primaryEmail: {
                type: 'string',
              },
              additionalEmails: {
                type: 'object',
              },
            },
          },
          fieldDateTime: {
            type: 'string',
            format: 'date-time',
          },
          fieldDate: {
            type: 'string',
            format: 'date',
          },
          fieldBoolean: {
            type: 'boolean',
          },
          fieldNumber: {
            type: 'integer',
          },
          fieldNumeric: {
            type: 'number',
          },
          fieldLinks: {
            type: 'object',
            properties: {
              primaryLinkLabel: {
                type: 'string',
              },
              primaryLinkUrl: {
                type: 'string',
              },
              secondaryLinks: {
                type: 'array',
                items: {
                  type: 'object',
                  description: 'A secondary link',
                  properties: {
                    url: {
                      type: 'string',
                    },
                    label: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          fieldCurrency: {
            type: 'object',
            properties: {
              amountMicros: {
                type: 'number',
              },
              currencyCode: {
                type: 'string',
              },
            },
          },
          fieldFullName: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string',
              },
              lastName: {
                type: 'string',
              },
            },
          },
          fieldRating: {
            type: 'string',
            enum: ['RATING_1', 'RATING_2'],
          },
          fieldSelect: {
            type: 'string',
            enum: ['OPTION_1', 'OPTION_2'],
          },
          fieldMultiSelect: {
            type: 'string',
            enum: ['OPTION_1', 'OPTION_2'],
          },
          fieldPosition: {
            type: 'number',
          },
          fieldAddress: {
            type: 'object',
            properties: {
              addressStreet1: {
                type: 'string',
              },
              addressStreet2: {
                type: 'string',
              },
              addressCity: {
                type: 'string',
              },
              addressPostcode: {
                type: 'string',
              },
              addressState: {
                type: 'string',
              },
              addressCountry: {
                type: 'string',
              },
              addressLat: {
                type: 'number',
              },
              addressLng: {
                type: 'number',
              },
            },
          },
          fieldRawJson: {
            type: 'object',
          },
          fieldRichText: {
            type: 'string',
          },
          fieldActor: {
            type: 'object',
            properties: {
              source: {
                type: 'string',
                enum: [
                  'EMAIL',
                  'CALENDAR',
                  'WORKFLOW',
                  'API',
                  'IMPORT',
                  'MANUAL',
                ],
              },
              workspaceMemberId: {
                type: 'string',
                format: 'uuid',
              },
              name: {
                type: 'string',
              },
            },
          },
          fieldRelation: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ToObjectMetadataName for Response',
            },
          },
        },
      },
    });
  });
});
