import * as yup from "yup";
import { BsToggleOn } from "react-icons/bs";
import { handleMockConfig, handleMockContent } from "./Mock";
import { MockConfigForm } from "./Mock/Form";

import { BooleanField } from "./type";

/** {
    "type" : "Boolean",
    "config" : {
      "placeholder_false" : "false placeholder",
      "placeholder_true" : "true placeholder",
      "default_value" : true,
      "label" : "bool"
    }
  } */

import { removeProp } from "../../../../utils";
import { createValidationSchema } from "../../../../forms";
import { DefaultFields } from "../../../../forms/defaults";
import { Input, CheckBox } from "../../../../forms/fields";

import { FieldType } from "../../CustomType/fields";
import { Widget } from "../Widget";

const Meta = {
  icon: BsToggleOn,
  title: "Boolean",
  description: "An input that is either true or false",
};

const FormFields = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  label: DefaultFields.label,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  id: DefaultFields.id,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  placeholder_false: Input(
    "False Placeholder",
    { required: false },
    null,
    "false"
  ),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  placeholder_true: Input(
    "True Placeholder",
    { required: false },
    null,
    "true"
  ),
  default_value: CheckBox("Default to true"),
};

const schema = yup.object().shape({
  type: yup
    .string()
    .matches(/^Boolean$/, { excludeEmptyString: true })
    .required(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  config: createValidationSchema(removeProp(FormFields, "id")),
});

export const BooleanWidget: Widget<BooleanField, typeof schema> = {
  TYPE_NAME: FieldType.Boolean,
  handleMockContent,
  handleMockConfig,
  MockConfigForm,
  create: (label: string) => new BooleanField({ label }),
  Meta,
  schema,
  FormFields,
};
