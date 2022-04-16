import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { LabeledTextarea } from "app/core/components/LabeledTextarea"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function NoteForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
      <LabeledTextarea name="content" label="Content" placeholder="Your content" />
    </Form>
  )
}
