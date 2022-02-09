import { Input, FormControl, FormLabel } from "@chakra-ui/react";
import { Field, FieldProps } from "formik";

import type { ProfileField } from "../../../lib/configs/methods";

interface SubscriptionProfileFieldProps {
  field: ProfileField;
}

const SubscriptionProfileField = ({ field }: SubscriptionProfileFieldProps) => {
  return (
    <Field key={field.name} name={field.name}>
      {({ field: inputProps }: FieldProps) => {
        return (
          <FormControl
            display="flex"
            alignItems="center"
            isRequired={!field.optional}
          >
            <FormLabel flexShrink={0} fontSize="sm" mb={0} w={32}>
              {field.label}
            </FormLabel>
            <Input size="sm" bgColor="white" {...inputProps} />
          </FormControl>
        );
      }}
    </Field>
  );
};

export default SubscriptionProfileField;
