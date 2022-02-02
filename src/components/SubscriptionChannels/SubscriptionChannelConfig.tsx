import { Input, FormControl, FormLabel } from "@chakra-ui/react";
import { Field, FieldProps } from "formik";

export interface SubscriptionConfig {
  name: string;
  label: string;
  optional?: boolean;
}

interface SubscriptionChannelConfigProps {
  config: SubscriptionConfig;
}

const SubscriptionChannelConfig = ({
  config,
}: SubscriptionChannelConfigProps) => {
  return (
    <Field key={config.name} name={config.name}>
      {({ field }: FieldProps) => {
        return (
          <FormControl
            display="flex"
            alignItems="center"
            isRequired={!config.optional}
          >
            <FormLabel flexShrink={0} fontSize="sm" mb={0} w={32}>
              {config.label}
            </FormLabel>
            <Input size="sm" bgColor="white" {...field} />
          </FormControl>
        );
      }}
    </Field>
  );
};

export default SubscriptionChannelConfig;
