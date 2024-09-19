import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/SubMenuTopBarContainer';
import { Breadcrumb } from '@/ui/navigation/bread-crumb/components/Breadcrumb';
import { useNavigate } from 'react-router-dom';

import { SettingsServerlessFunctionNewForm } from '@/settings/serverless-functions/components/SettingsServerlessFunctionNewForm';
import { useCreateOneServerlessFunction } from '@/settings/serverless-functions/hooks/useCreateOneServerlessFunction';
import { ServerlessFunctionNewFormValues } from '@/settings/serverless-functions/hooks/useServerlessFunctionUpdateFormState';
import { SettingsServerlessFunctionHotkeyScope } from '@/settings/serverless-functions/types/SettingsServerlessFunctionHotKeyScope';
import { getSettingsPagePath } from '@/settings/utils/getSettingsPagePath';
import { SettingsPath } from '@/types/SettingsPath';
import { DEFAULT_CODE } from '@/ui/input/code-editor/components/CodeEditor';
import { useScopedHotkeys } from '@/ui/utilities/hotkey/hooks/useScopedHotkeys';
import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { IconFunction } from 'twenty-ui';
import { useHotkeyScopeOnMount } from '~/hooks/useHotkeyScopeOnMount';
import { isDefined } from '~/utils/isDefined';

export const SettingsServerlessFunctionsNew = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<ServerlessFunctionNewFormValues>(
    {
      name: '',
      description: '',
    },
  );

  const { createOneServerlessFunction } = useCreateOneServerlessFunction();
  const handleSave = async () => {
    const newServerlessFunction = await createOneServerlessFunction({
      name: formValues.name,
      description: formValues.description,
      code: DEFAULT_CODE,
    });

    if (!isDefined(newServerlessFunction?.data)) {
      return;
    }
    navigate(
      getSettingsPagePath(SettingsPath.ServerlessFunctions, {
        id: newServerlessFunction.data.createOneServerlessFunction.id,
      }),
    );
  };

  const onChange = (key: string) => {
    return (value: string | undefined) => {
      setFormValues((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    };
  };

  const canSave = !!formValues.name && createOneServerlessFunction;

  useHotkeyScopeOnMount(
    SettingsServerlessFunctionHotkeyScope.ServerlessFunctionNew,
  );

  useScopedHotkeys(
    [Key.Enter],
    () => {
      if (canSave !== false) {
        handleSave();
      }
    },
    SettingsServerlessFunctionHotkeyScope.ServerlessFunctionNew,
    [canSave],
  );
  useScopedHotkeys(
    [Key.Escape],
    () => {
      navigate(getSettingsPagePath(SettingsPath.ServerlessFunctions));
    },
    SettingsServerlessFunctionHotkeyScope.ServerlessFunctionNew,
  );

  return (
    <SubMenuTopBarContainer
      Icon={IconFunction}
      title={
        <Breadcrumb
          links={[
            { children: 'Functions', href: '/settings/functions' },
            { children: 'New' },
          ]}
        />
      }
      actionButton={
        <SaveAndCancelButtons
          isSaveDisabled={!canSave}
          onCancel={() => {
            navigate('/settings/functions');
          }}
          onSave={handleSave}
        />
      }
    >
      <SettingsPageContainer>
        <SettingsServerlessFunctionNewForm
          formValues={formValues}
          onChange={onChange}
        />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};

export default SettingsServerlessFunctionsNew;
