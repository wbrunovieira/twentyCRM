import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import {
  ActorMetadata,
  FieldActorSource,
} from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { AddressMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/address.composite-type';
import { CurrencyMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/currency.composite-type';
import { LinksMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/links.composite-type';
import { FieldMetadataType } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import {
  RelationMetadataType,
  RelationOnDeleteAction,
} from 'src/engine/metadata-modules/relation-metadata/relation-metadata.entity';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsDeprecated } from 'src/engine/twenty-orm/decorators/workspace-is-deprecated.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { COMPANY_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { ActivityTargetWorkspaceEntity } from 'src/modules/activity/standard-objects/activity-target.workspace-entity';
import { AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { FavoriteWorkspaceEntity } from 'src/modules/favorite/standard-objects/favorite.workspace-entity';
import { NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.company,
  namePlural: 'companies',
  labelSingular: 'Company',
  labelPlural: 'Companies',
  description: 'A company',
  icon: 'IconBuildingSkyscraper',
  labelIdentifierStandardId: COMPANY_STANDARD_FIELD_IDS.name,
  softDelete: true,
})
export class CompanyWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: COMPANY_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: 'Name',
    description: 'The company name',
    icon: 'IconBuildingSkyscraper',
  })
  name: string;

  @WorkspaceField({
    standardId: COMPANY_STANDARD_FIELD_IDS.domainName,
    type: FieldMetadataType.LINKS,
    label: 'Domain Name',
    description:
      'The company website URL. We use this url to fetch the company icon',
    icon: 'IconLink',
  })
  domainName?: LinksMetadata;

  @WorkspaceField({
    standardId: COMPANY_STANDARD_FIELD_IDS.employees,
    type: FieldMetadataType.NUMBER,
    label: 'Employees',
    description: 'Number of employees in the company',
    icon: 'IconUsers',
  })
  @WorkspaceIsNullable()
  employees: number | null;

  @WorkspaceField({
    standardId: COMPANY_STANDARD_FIELD_IDS.linkedinLink,
    type: FieldMetadataType.LINKS,
    label: 'Linkedin',
    description: 'The company Linkedin account',
    icon: 'IconBrandLinkedin',
  })
  @WorkspaceIsNullable()
  linkedinLink: LinksMetadata | null;

  @WorkspaceField({
    standardId: COMPANY_STANDARD_FIELD_IDS.xLink,
    type: FieldMetadataType.LINKS,
    label: 'X',
    description: 'The company Twitter/X account',
    icon: 'IconBrandX',
  })
  @WorkspaceIsNullable()
  xLink: LinksMetadata | null;

  @WorkspaceField({
    standardId: COMPANY_STANDARD_FIELD_IDS.annualRecurringRevenue,
    type: FieldMetadataType.CURRENCY,
    label: 'ARR',
    description:
      'Annual Recurring Revenue: The actual or estimated annual revenue of the company',
    icon: 'IconMoneybag',
  })
  @WorkspaceIsNullable()
  annualRecurringRevenue: CurrencyMetadata | null;

  @WorkspaceField({
    standardId: COMPANY_STANDARD_FIELD_IDS.address,
    type: FieldMetadataType.ADDRESS,
    label: 'Address',
    description: 'Address of the company',
    icon: 'IconMap',
  })
  @WorkspaceIsNullable()
  address: AddressMetadata;

  @WorkspaceField({
    standardId: COMPANY_STANDARD_FIELD_IDS.idealCustomerProfile,
    type: FieldMetadataType.BOOLEAN,
    label: 'ICP',
    description:
      'Ideal Customer Profile:  Indicates whether the company is the most suitable and valuable customer for you',
    icon: 'IconTarget',
    defaultValue: false,
  })
  idealCustomerProfile: boolean;

  @WorkspaceField({
    standardId: COMPANY_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: 'Position',
    description: 'Company record position',
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  position: number;

  @WorkspaceField({
    standardId: COMPANY_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: 'Created by',
    icon: 'IconCreativeCommonsSa',
    description: 'The creator of the record',
    defaultValue: {
      source: `'${FieldActorSource.MANUAL}'`,
      name: "''",
    },
  })
  createdBy: ActorMetadata;

  // Relations
  @WorkspaceRelation({
    standardId: COMPANY_STANDARD_FIELD_IDS.people,
    type: RelationMetadataType.ONE_TO_MANY,
    label: 'People',
    description: 'People linked to the company.',
    icon: 'IconUsers',
    inverseSideTarget: () => PersonWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  people: Relation<PersonWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: COMPANY_STANDARD_FIELD_IDS.accountOwner,
    type: RelationMetadataType.MANY_TO_ONE,
    label: 'Account Owner',
    description:
      'Your team member responsible for managing the company account',
    icon: 'IconUserCircle',
    inverseSideTarget: () => WorkspaceMemberWorkspaceEntity,
    inverseSideFieldKey: 'accountOwnerForCompanies',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  accountOwner: Relation<WorkspaceMemberWorkspaceEntity> | null;

  @WorkspaceJoinColumn('accountOwner')
  accountOwnerId: string | null;

  @WorkspaceRelation({
    standardId: COMPANY_STANDARD_FIELD_IDS.activityTargets,
    type: RelationMetadataType.ONE_TO_MANY,
    label: 'Activities',
    description: 'Activities tied to the company',
    icon: 'IconCheckbox',
    inverseSideTarget: () => ActivityTargetWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  activityTargets: Relation<ActivityTargetWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: COMPANY_STANDARD_FIELD_IDS.taskTargets,
    type: RelationMetadataType.ONE_TO_MANY,
    label: 'Tasks',
    description: 'Tasks tied to the company',
    icon: 'IconCheckbox',
    inverseSideTarget: () => TaskTargetWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  taskTargets: Relation<TaskTargetWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: COMPANY_STANDARD_FIELD_IDS.noteTargets,
    type: RelationMetadataType.ONE_TO_MANY,
    label: 'Notes',
    description: 'Notes tied to the company',
    icon: 'IconNotes',
    inverseSideTarget: () => NoteTargetWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  noteTargets: Relation<NoteTargetWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: COMPANY_STANDARD_FIELD_IDS.opportunities,
    type: RelationMetadataType.ONE_TO_MANY,
    label: 'Opportunities',
    description: 'Opportunities linked to the company.',
    icon: 'IconTargetArrow',
    inverseSideTarget: () => OpportunityWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  opportunities: Relation<OpportunityWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: COMPANY_STANDARD_FIELD_IDS.favorites,
    type: RelationMetadataType.ONE_TO_MANY,
    label: 'Favorites',
    description: 'Favorites linked to the company',
    icon: 'IconHeart',
    inverseSideTarget: () => FavoriteWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  favorites: Relation<FavoriteWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: COMPANY_STANDARD_FIELD_IDS.attachments,
    type: RelationMetadataType.ONE_TO_MANY,
    label: 'Attachments',
    description: 'Attachments linked to the company',
    icon: 'IconFileImport',
    inverseSideTarget: () => AttachmentWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  attachments: Relation<AttachmentWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: COMPANY_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationMetadataType.ONE_TO_MANY,
    label: 'Timeline Activities',
    description: 'Timeline Activities linked to the company',
    icon: 'IconIconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: COMPANY_STANDARD_FIELD_IDS.address_deprecated,
    type: FieldMetadataType.TEXT,
    label: 'Address (deprecated) ',
    description:
      'Address of the company - deprecated in favor of new address field',
    icon: 'IconMap',
  })
  @WorkspaceIsDeprecated()
  @WorkspaceIsNullable()
  addressOld: string;
}
