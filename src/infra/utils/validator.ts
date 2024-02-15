import Ajv, { JSONSchemaType, Schema, ValidateFunction } from 'ajv'
import UnprocessableEntityException from '../../domain/exceptions/UnprocessableEntityException'

export default class Validator {
  static schema<T = unknown>(
    schema: Schema | JSONSchemaType<T>,
  ): ValidateFunction {
    const ajv = new Ajv()
    return ajv.compile(schema)
  }
  static validate(validator: ValidateFunction, data: Object): void {
    const valid = validator(data)
    if (!valid) throw new UnprocessableEntityException('')
  }
}
