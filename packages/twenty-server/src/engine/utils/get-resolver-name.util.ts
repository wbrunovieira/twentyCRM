import { WorkspaceResolverBuilderMethodNames } from 'src/engine/api/graphql/workspace-resolver-builder/interfaces/workspace-resolvers-builder.interface';
import { ObjectMetadataInterface } from 'src/engine/metadata-modules/field-metadata/interfaces/object-metadata.interface';

import { camelCase } from 'src/utils/camel-case';
import { pascalCase } from 'src/utils/pascal-case';

export const getResolverName = (
  objectMetadata: Pick<ObjectMetadataInterface, 'namePlural' | 'nameSingular'>,
  type: WorkspaceResolverBuilderMethodNames,
) => {
  switch (type) {
    case 'findMany':
      return `${camelCase(objectMetadata.namePlural)}`;
    case 'findOne':
      return `${camelCase(objectMetadata.nameSingular)}`;
    case 'findDuplicates':
      return `${camelCase(objectMetadata.nameSingular)}Duplicates`;
    case 'createMany':
      return `create${pascalCase(objectMetadata.namePlural)}`;
    case 'createOne':
      return `create${pascalCase(objectMetadata.nameSingular)}`;
    case 'updateOne':
      return `update${pascalCase(objectMetadata.nameSingular)}`;
    case 'deleteOne':
      return `delete${pascalCase(objectMetadata.nameSingular)}`;
    case 'updateMany':
      return `update${pascalCase(objectMetadata.namePlural)}`;
    case 'restoreMany':
      return `restore${pascalCase(objectMetadata.namePlural)}`;
    case 'deleteMany':
      return `delete${pascalCase(objectMetadata.namePlural)}`;
    case 'destroyMany':
      return `destroy${pascalCase(objectMetadata.namePlural)}`;
    default:
      throw new Error(`Unknown resolver type: ${type}`);
  }
};
